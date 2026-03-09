import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchTopRatedSeries,
  fetchLatestMovies,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchUpcoming,
} from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const HERO_COUNT = 5;

/* ── Horizontal scroll section ── */
const Section = ({ title, label, items, loading }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div style={{ marginBottom: 52 }}>
      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, padding: '0 4px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ height: '1px', width: 24, backgroundColor: '#C9A84C' }} />
            <span style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
              {label}
            </span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
            {title}
          </h2>
        </div>
        {/* Arrow controls */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['‹', '›'].map((ch, i) => (
            <button key={ch} onClick={() => scroll(i === 0 ? -1 : 1)} style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#D4C9B0', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >{ch}</button>
          ))}
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={rowRef}
        style={{
          display: 'flex', gap: 14, overflowX: 'auto',
          paddingBottom: 12,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
      >
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        {loading
          ? Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ flexShrink: 0, width: 150 }}><SkeletonCard /></div>
          ))
          : items.map(movie => (
            <div key={movie.id} style={{ flexShrink: 0, width: 150 }}>
              <MovieCard movie={movie} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

/* ── Main Home ── */
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    trending, loading, page, hasMore,
    topRatedMovies, topRatedSeries,
    latestMovies, popularMovies, popularSeries, upcoming,
  } = useSelector((s) => s.movies);

  const observerRef = useRef(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const autoPlayRef = useRef(null);

  const lastCardRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) dispatch(fetchTrendingMovies(page + 1));
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, page]);

  useEffect(() => {
    dispatch(fetchTrendingMovies(1));
    dispatch(fetchTopRatedMovies());
    dispatch(fetchTopRatedSeries());
    dispatch(fetchLatestMovies());
    dispatch(fetchPopularMovies());
    dispatch(fetchPopularSeries());
    dispatch(fetchUpcoming());
  }, [dispatch]);

  const heroes = trending.slice(0, HERO_COUNT);

  const goTo = (idx) => {
    if (animating || idx === heroIndex) return;
    setAnimating(true);
    setTimeout(() => { setHeroIndex(idx); setAnimating(false); }, 300);
  };
  const goNext = () => goTo((heroIndex + 1) % Math.max(heroes.length, 1));
  const goPrev = () => goTo((heroIndex - 1 + Math.max(heroes.length, 1)) % Math.max(heroes.length, 1));
  const resetAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(goNext, 6000);
  };

  useEffect(() => {
    if (heroes.length === 0) return;
    autoPlayRef.current = setInterval(goNext, 6000);
    return () => clearInterval(autoPlayRef.current);
  }, [heroIndex, heroes.length]);

  const hero = heroes[heroIndex];
  const heroImg = hero?.backdrop_path ? `https://image.tmdb.org/t/p/original${hero.backdrop_path}` : null;

  const sections = [
    { key: 'popular-movies',  label: 'Most Viewed',      title: 'Popular Movies',     items: popularMovies },
    { key: 'popular-series',  label: 'Top Series',       title: 'Popular Series',     items: popularSeries },
    { key: 'top-movies',      label: 'Highest Rated',    title: 'Top Rated Movies',   items: topRatedMovies },
    { key: 'top-series',      label: 'Highest Rated',    title: 'Top Rated Series',   items: topRatedSeries },
    { key: 'latest',          label: 'Now Playing',      title: 'Latest Releases',    items: latestMovies },
    { key: 'upcoming',        label: 'Coming Soon',      title: 'Upcoming Movies',    items: upcoming },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030303' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .hero-content { padding: 0 80px; max-width: 680px; }
        @media (max-width: 1024px) { .hero-content { padding: 0 40px; max-width: 580px; } }
        @media (max-width: 640px)  { .hero-content { padding: 0 20px; max-width: 100%; } }

        .arrow-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #F0EAD6; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
        }
        .arrow-btn:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.5); color: #C9A84C; }

        .page-sections { padding: 52px 48px 80px; }
        @media (max-width: 1024px) { .page-sections { padding: 40px 24px 60px; } }
        @media (max-width: 640px)  { .page-sections { padding: 28px 16px 48px; } }

        .trending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 24px 16px;
        }
        @media (max-width: 640px) { .trending-grid { grid-template-columns: repeat(2,1fr); gap: 12px 10px; } }
        @media (min-width: 641px) and (max-width: 1024px) { .trending-grid { grid-template-columns: repeat(3,1fr); } }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-anim { animation: fadeSlide 0.4s ease forwards; }
      `}</style>

      {/* ── HERO SLIDER ── */}
      {hero && heroImg && (
        <div style={{ position: 'relative', overflow: 'hidden', height: '100vh', minHeight: '520px' }}>
          <img key={heroImg} src={heroImg} alt={hero.title || hero.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.75)', transition: 'opacity 0.4s' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.4) 45%, rgba(3,3,3,0.0) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #030303 0%, rgba(3,3,3,0.2) 35%, transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,3,3,0.5) 0%, transparent 15%)' }} />

          <div className="hero-content" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '64px' }}>
            <div key={heroIndex} className="hero-anim">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ height: '1px', width: 28, backgroundColor: '#C9A84C' }} />
                <span style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Featured Today</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 70px)', fontWeight: 900, color: '#F5F0E8', lineHeight: 1.05, marginBottom: 14, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                {hero.title || hero.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ color: '#C9A84C', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>★ {hero.vote_average?.toFixed(1)}</span>
                <span style={{ color: '#504840' }}>·</span>
                <span style={{ color: '#9A9080', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{(hero.release_date || hero.first_air_date || '').slice(0, 4)}</span>
                {hero.media_type === 'tv' && (
                  <span style={{ color: '#fff', fontSize: '9px', letterSpacing: '1.5px', background: 'rgba(180,30,30,0.85)', padding: '2px 8px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>SERIES</span>
                )}
              </div>
              <p style={{ color: '#A09880', fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: 32, maxWidth: '500px', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                {hero.overview?.slice(0, 150)}...
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                <button onClick={() => navigate(`/${hero.media_type === 'tv' ? 'tv' : 'movie'}/${hero.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A', border: 'none', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: '3px', cursor: 'pointer' }}>
                  ▶ Watch Now
                </button>
                <button onClick={() => navigate(`/${hero.media_type === 'tv' ? 'tv' : 'movie'}/${hero.id}`)}
                  style={{ padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', color: '#F5F0E8', cursor: 'pointer', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", borderRadius: '3px' }}>
                  More Info
                </button>
              </div>
            </div>

            {/* Slider controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button className="arrow-btn" onClick={() => { goPrev(); resetAutoPlay(); }}>‹</button>
              <div style={{ display: 'flex', gap: 8 }}>
                {heroes.map((m, i) => {
                  const thumb = m.backdrop_path ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}` : null;
                  const isActive = i === heroIndex;
                  return (
                    <div key={m.id} onClick={() => { goTo(i); resetAutoPlay(); }} style={{ width: isActive ? 88 : 62, height: isActive ? 50 : 38, borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', border: isActive ? '2px solid #C9A84C' : '2px solid rgba(255,255,255,0.1)', opacity: isActive ? 1 : 0.45, transition: 'all 0.3s', flexShrink: 0, background: '#111' }}>
                      {thumb && <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                  );
                })}
              </div>
              <button className="arrow-btn" onClick={() => { goNext(); resetAutoPlay(); }}>›</button>
              <div style={{ display: 'flex', gap: 5, marginLeft: 4 }}>
                {heroes.map((_, i) => (
                  <div key={i} onClick={() => { goTo(i); resetAutoPlay(); }} style={{ width: i === heroIndex ? 20 : 6, height: 6, borderRadius: 3, background: i === heroIndex ? '#C9A84C' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ALL SECTIONS ── */}
      <div className="page-sections">

        {/* Horizontal scroll sections */}
        {sections.map(s => (
          <Section key={s.key} label={s.label} title={s.title} items={s.items} loading={s.items.length === 0} />
        ))}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '52px 0 40px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2))' }} />
          <span style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Trending Today</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.2))' }} />
        </div>

        {/* Trending grid heading */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ height: '1px', width: 24, backgroundColor: '#C9A84C' }} />
            <span style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>All Trending</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>
            Most Watched Today
          </h2>
        </div>

        {/* Infinite scroll grid */}
        <div className="trending-grid">
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

        {!hasMore && !loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 60 }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2))' }} />
            <span style={{ color: '#504840', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>End of List</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.2))' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;