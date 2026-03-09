import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trending, loading, page, hasMore } = useSelector((s) => s.movies);
  
  const observerRef = useRef(null);

  const lastCardRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) dispatch(fetchTrendingMovies(page + 1));
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, page]);

  useEffect(() => { dispatch(fetchTrendingMovies(1)); }, [dispatch]);

  const hero = trending[0];
  const heroImg = hero?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${hero.backdrop_path}`
    : null;

  // Hero gradient changes slightly in light mode — still dark for readability
  const heroBottomColor = '#030303';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', transition: 'background-color 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .hero-watch-btn:hover { opacity: 0.85; }
        .hero-info-btn:hover { border-color: rgba(201,168,76,0.5) !important; }

        .hero-content { padding: 80px 80px 0; max-width: 700px; }
        @media (max-width: 1024px) { .hero-content { padding: 80px 40px 0; max-width: 600px; } }
        @media (max-width: 640px)  { .hero-content { padding: 80px 20px 0; max-width: 100%; } }

        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 28px 20px;
        }
        @media (max-width: 640px)  { .movies-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; } }
        @media (min-width: 641px) and (max-width: 1024px) { .movies-grid { grid-template-columns: repeat(3, 1fr); gap: 20px 16px; } }

        .grid-section { padding: 60px 48px 80px; }
        @media (max-width: 1024px) { .grid-section { padding: 48px 24px 60px; } }
        @media (max-width: 640px)  { .grid-section { padding: 36px 16px 48px; } }

        .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .hero-buttons { gap: 10px; }
          .hero-watch-btn, .hero-info-btn { flex: 1; justify-content: center; padding: 12px 16px !important; }
        }
      `}</style>

      {/* ── HERO — always dark overlay for readability ── */}
      {hero && heroImg && (
        <div style={{ position: 'relative', overflow: 'hidden', height: '100vh', minHeight: '500px' }}>
          <img
            src={heroImg}
            alt={hero.title || hero.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.45)' }}
          />
          {/* Left gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(3,3,3,0.97) 0%, rgba(3,3,3,0.65) 50%, rgba(3,3,3,0.1) 100%)' }} />
          {/* Bottom gradient — blends into page bg */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${heroBottomColor} 0%, transparent 55%)` }} />
          {/* Top gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,3,3,0.6) 0%, transparent 20%)' }} />

          <div className="hero-content" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '64px' }}>
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ height: '1px', width: 28, backgroundColor: '#C9A84C' }} />
              <span style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Featured Today</span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5.5vw, 72px)', fontWeight: 900, color: '#F5F0E8', lineHeight: 1.05, marginBottom: 14, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              {hero.title || hero.name}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ color: '#C9A84C', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>★ {hero.vote_average?.toFixed(1)}</span>
              <span style={{ color: '#504840' }}>·</span>
              <span style={{ color: '#9A9080', fontSize: '13px', letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif" }}>{(hero.release_date || hero.first_air_date || '').slice(0, 4)}</span>
              {hero.media_type === 'tv' && (
                <><span style={{ color: '#504840' }}>·</span>
                <span style={{ color: '#fff', fontSize: '9px', letterSpacing: '1.5px', background: 'rgba(180,30,30,0.8)', padding: '2px 7px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>SERIES</span></>
              )}
            </div>

            {/* Overview */}
            <p style={{ color: '#A09880', fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: 36, maxWidth: '520px', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
              {hero.overview?.slice(0, 160)}...
            </p>

            {/* Buttons */}
            <div className="hero-buttons">
              <button className="hero-watch-btn"
                onClick={() => navigate(`/${hero.media_type === 'tv' ? 'tv' : 'movie'}/${hero.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 36px', background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A', border: 'none', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: '3px', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                ▶ Watch Now
              </button>
              <button className="hero-info-btn"
                onClick={() => navigate(`/${hero.media_type === 'tv' ? 'tv' : 'movie'}/${hero.id}`)}
                style={{ padding: '13px 28px', backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', color: '#F5F0E8', cursor: 'pointer', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", borderRadius: '3px', transition: 'border-color 0.2s' }}>
                More Info
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.3, pointerEvents: 'none' }}>
            <span style={{ color: '#9A9080', fontSize: '9px', letterSpacing: '4px', fontFamily: "'DM Sans', sans-serif" }}>SCROLL</span>
            <div style={{ width: '1px', height: 36, background: 'linear-gradient(to bottom, #9A9080, transparent)' }} />
          </div>
        </div>
      )}

      {/* ── GRID — uses CSS variables, changes with theme ── */}
      <div className="grid-section">
        {/* Section heading */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ height: '1px', width: 28, backgroundColor: 'var(--gold)' }} />
            <span style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Trending Now</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, transition: 'color 0.3s' }}>
            Most Watched
          </h2>
        </div>

        {/* Grid */}
        <div className="movies-grid">
          {trending.map((movie, index) => {
            const isLast = index === trending.length - 1;
            return (
              <div key={movie.id} ref={isLast ? lastCardRef : null}>
                <MovieCard movie={movie} />
              </div>
            );
          })}
          {loading && Array(8).fill(0).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
        </div>

        {/* End of list */}
        {!hasMore && !loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 60 }}>
            <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, var(--border-gold))` }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>End of List</span>
            <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, var(--border-gold))` }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;