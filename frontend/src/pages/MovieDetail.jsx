import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetail, clearDetail } from '../store/slices/movieSlice';
import { IMG_URL } from '../api/tmdb';
import { addFavorite, removeFavorite, checkFavorite } from '../store/slices/favoriteSlice';
import { addHistory } from '../store/slices/historySlice';
import tmdb from '../api/tmdb';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const type = window.location.pathname.startsWith('/tv') ? 'tv' : 'movie';

  const { isFavorite } = useSelector((s) => s.favorites);
  const { user } = useSelector((s) => s.auth);
  const { detail, videos, cast, detailLoading } = useSelector((s) => s.movies);

  const [similar, setSimilar] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview | trailer | cast
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchMovieDetail({ id, type }));
    // Fetch similar
    tmdb.get(`/${type}/${id}/similar`).then(r => setSimilar(r.data.results.slice(0, 12))).catch(() => {});
    return () => dispatch(clearDetail());
  }, [id]);

  useEffect(() => {
    if (detail && user) {
      dispatch(addHistory({ movieId: String(detail.id), title: detail.title || detail.name, poster: detail.poster_path, mediaType: type, rating: detail.vote_average }));
      dispatch(checkFavorite(String(detail.id)));
    }
  }, [detail]);

  const handleFav = () => {
    if (!user) { navigate('/login'); return; }
    if (isFavorite) {
      dispatch(removeFavorite(String(detail.id)));
    } else {
      dispatch(addFavorite({ movieId: String(detail.id), title: detail.title || detail.name, poster: detail.poster_path, mediaType: type, rating: detail.vote_average }));
    }
  };

  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const backdropUrl = detail?.backdrop_path ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}` : null;
  const posterUrl = detail?.poster_path ? IMG_URL + detail.poster_path : 'https://via.placeholder.com/300x450?text=No+Image';

  // Runtime formatter
  const formatRuntime = (min) => {
    if (!min) return null;
    return `${Math.floor(min / 60)}h ${min % 60}m`;
  };

  if (detailLoading) return <LoadingSkeleton />;
  if (!detail) return (
    <div style={{ background: '#080810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <h2 style={{ color: '#F0EAD6', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2 }}>Movie Not Found</h2>
        <button onClick={() => navigate('/')} style={btnStyle}>Go Home</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#080810', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#F0EAD6' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tab-btn { background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; padding: 10px 0; position: relative; transition: color 0.2s; }
        .tab-btn::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #C9A84C; transform: scaleX(0); transition: transform 0.2s; border-radius: 1px; }
        .tab-btn.active::after { transform: scaleX(1); }

        .cast-card:hover img { transform: scale(1.05); }
        .similar-card:hover { transform: translateY(-4px); }
        .similar-card:hover img { filter: brightness(0.7); }

        .genre-pill { padding: 5px 14px; border-radius: 20px; font-size: 11px; letter-spacing: 1px; border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; background: rgba(201,168,76,0.06); font-family: 'DM Sans', sans-serif; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }

        @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .shimmer { animation: shimmer 1.5s ease infinite; }

        /* Responsive */
        .detail-hero { display: flex; gap: 48px; align-items: flex-start; padding: 40px 64px 48px; }
        @media (max-width: 900px) { .detail-hero { flex-direction: column; padding: 24px; gap: 24px; } }
        @media (max-width: 640px) { .detail-hero { padding: 16px; } }

        .content-area { padding: 0 64px 80px; }
        @media (max-width: 900px) { .content-area { padding: 0 24px 60px; } }
        @media (max-width: 640px) { .content-area { padding: 0 16px 48px; } }

        .cast-row { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; }
        .cast-row::-webkit-scrollbar { display: none; }

        .similar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px 14px; }
        @media (max-width: 640px) { .similar-grid { grid-template-columns: repeat(2, 1fr); gap: 12px 10px; } }
      `}</style>

      {/* ── BACKDROP HERO ── */}
      <div style={{ position: 'relative', height: '70vh', minHeight: 420, overflow: 'hidden' }}>
        {backdropUrl && (
          <img src={backdropUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.35)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080810 0%, rgba(8,8,16,0.3) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,16,0.6) 0%, transparent 20%)' }} />

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 80, left: 32, zIndex: 10,
          background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', width: 40, height: 40, color: '#F0EAD6',
          fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.borderColor = '#C9A84C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >‹</button>
      </div>

      {/* ── DETAIL CARD — overlaps backdrop ── */}
      <div style={{ marginTop: '-180px', position: 'relative', zIndex: 10 }}>
        <div className="detail-hero fade-in">

          {/* Poster */}
          <div style={{ flexShrink: 0, width: 240 }}>
            <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.06)', background: '#111' }}>
              <img
                src={posterUrl}
                alt={detail.title || detail.name}
                onLoad={() => setImgLoaded(true)}
                style={{ width: '100%', display: 'block', objectFit: 'cover', transition: 'opacity 0.4s', opacity: imgLoaded ? 1 : 0 }}
              />
            </div>
            {/* Favorite + Rating below poster */}
            <button onClick={handleFav} style={{
              width: '100%', marginTop: 12, padding: '11px',
              background: isFavorite ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
              border: isFavorite ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, color: isFavorite ? '#C9A84C' : '#9A8E7F',
              fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {isFavorite ? '♥ Favorited' : '♡ Add to Favorites'}
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingTop: 16 }}>
            {/* Genres */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {detail.genres?.map(g => <span key={g.id} className="genre-pill">{g.name}</span>)}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 900, color: '#F5F0E8', lineHeight: 1.05, marginBottom: 16 }}>
              {detail.title || detail.name}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#C9A84C', fontSize: 20 }}>★</span>
                <span style={{ color: '#F0EAD6', fontSize: 22, fontWeight: 700 }}>{detail.vote_average?.toFixed(1)}</span>
                <span style={{ color: '#6A5F52', fontSize: 13 }}>/10</span>
              </div>
              <Dot />
              <span style={{ color: '#9A9080', fontSize: 14 }}>{(detail.release_date || detail.first_air_date || '').slice(0, 4)}</span>
              {detail.runtime && <><Dot /><span style={{ color: '#9A9080', fontSize: 14 }}>{formatRuntime(detail.runtime)}</span></>}
              {detail.number_of_seasons && <><Dot /><span style={{ color: '#9A9080', fontSize: 14 }}>{detail.number_of_seasons} Season{detail.number_of_seasons > 1 ? 's' : ''}</span></>}
              {detail.status && <><Dot /><span style={{ color: '#9A9080', fontSize: 13, background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 3 }}>{detail.status}</span></>}
            </div>

            {/* Tagline */}
            {detail.tagline && (
              <p style={{ color: '#C9A84C', fontSize: 14, fontStyle: 'italic', letterSpacing: '0.5px', marginBottom: 16, opacity: 0.8 }}>
                "{detail.tagline}"
              </p>
            )}

            {/* Overview */}
            <p style={{ color: '#A09880', fontSize: 15, lineHeight: 1.85, fontWeight: 300, maxWidth: 680, marginBottom: 32 }}>
              {detail.overview || 'No description available.'}
            </p>

            {/* Watch Now */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('trailer')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A', border: 'none', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: 3, cursor: 'pointer' }}>
                ▶ Watch Trailer
              </button>
              {detail.homepage && (
                <a href={detail.homepage} target="_blank" rel="noreferrer" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#F5F0E8', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", borderRadius: 3, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  Official Site ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="content-area">
          <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 36 }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'trailer', label: 'Trailer' },
              { key: 'cast', label: `Cast (${cast.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                style={{ color: activeTab === tab.key ? '#C9A84C' : '#6A5F52' }}
                onClick={() => setActiveTab(tab.key)}
              >{tab.label}</button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
                {[
                  { label: 'Original Title', value: detail.original_title || detail.original_name },
                  { label: 'Language', value: detail.original_language?.toUpperCase() },
                  { label: 'Country', value: detail.production_countries?.[0]?.name },
                  { label: 'Budget', value: detail.budget ? `$${(detail.budget / 1e6).toFixed(1)}M` : null },
                  { label: 'Revenue', value: detail.revenue ? `$${(detail.revenue / 1e6).toFixed(1)}M` : null },
                  { label: 'Vote Count', value: detail.vote_count ? `${detail.vote_count.toLocaleString()} votes` : null },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '14px 18px' }}>
                    <div style={{ color: '#6A5F52', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>{item.label}</div>
                    <div style={{ color: '#D4C9B0', fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Production companies */}
              {detail.production_companies?.length > 0 && (
                <div>
                  <SectionHeading label="Production" title="Made By" />
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                    {detail.production_companies.map(c => (
                      <div key={c.id} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: '#9A8E7F', fontSize: 13 }}>
                        {c.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trailer tab */}
          {activeTab === 'trailer' && (
            <div className="fade-in">
              {trailer ? (
                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                  <iframe
                    width="100%" height="500"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                    title="Trailer"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                  <p style={{ color: '#6A5F52', fontSize: 15 }}>No trailer available for this title.</p>
                </div>
              )}

              {/* Other videos */}
              {videos.filter(v => v.site === 'YouTube' && v.key !== trailer?.key).slice(0, 4).length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <SectionHeading label="More Videos" title="Clips & Teasers" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 20 }}>
                    {videos.filter(v => v.site === 'YouTube' && v.key !== trailer?.key).slice(0, 4).map(v => (
                      <div key={v.id} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <iframe width="100%" height="160" src={`https://www.youtube.com/embed/${v.key}?rel=0`} title={v.name} frameBorder="0" allowFullScreen />
                        <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)' }}>
                          <p style={{ color: '#9A8E7F', fontSize: 12, margin: 0 }}>{v.type} · {v.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cast tab */}
          {activeTab === 'cast' && (
            <div className="fade-in">
              <div className="cast-row">
                {cast.map((person, i) => (
                  <div key={person.id} className="cast-card" style={{ flexShrink: 0, width: 120, animationDelay: `${i * 0.05}s` }}>
                    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 10, background: '#111' }}>
                      <img
                        src={person.profile_path ? IMG_URL + person.profile_path : 'https://via.placeholder.com/120x160?text=?'}
                        alt={person.name}
                        style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      />
                    </div>
                    <p style={{ color: '#D4C9B0', fontSize: 13, fontWeight: 500, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.name}</p>
                    <p style={{ color: '#6A5F52', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Similar Movies ── */}
          {similar.length > 0 && (
            <div style={{ marginTop: 60 }}>
              <SectionHeading label="You May Also Like" title="Similar Titles" />
              <div className="similar-grid" style={{ marginTop: 24 }}>
                {similar.map(m => (
                  <div
                    key={m.id}
                    className="similar-card"
                    onClick={() => navigate(`/${m.media_type === 'tv' || type === 'tv' ? 'tv' : 'movie'}/${m.id}`)}
                    style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.25s' }}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={m.poster_path ? IMG_URL + m.poster_path : 'https://via.placeholder.com/150x220?text=?'}
                        alt={m.title || m.name}
                        style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'filter 0.3s' }}
                      />
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 3, padding: '2px 7px', fontSize: 11, color: '#F0EAD6', backdropFilter: 'blur(4px)' }}>
                        ★ {m.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ color: '#D4C9B0', fontSize: 13, fontWeight: 500, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title || m.name}</p>
                      <p style={{ color: '#6A5F52', fontSize: 11, margin: 0 }}>{(m.release_date || m.first_air_date || '').slice(0, 4)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Helpers ── */
const Dot = () => <span style={{ color: '#3A3530' }}>·</span>;

const SectionHeading = ({ label, title }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <div style={{ height: '1px', width: 22, backgroundColor: '#C9A84C' }} />
      <span style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
    </div>
    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>{title}</h3>
  </div>
);

const btnStyle = { marginTop: 20, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A', border: 'none', borderRadius: 3, fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: 'pointer' };

const LoadingSkeleton = () => (
  <div style={{ background: '#080810', minHeight: '100vh', padding: '64px 64px 40px' }}>
    <div style={{ height: '45vh', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 32 }} className="shimmer" />
    <div style={{ display: 'flex', gap: 40 }}>
      <div style={{ width: 240, height: 360, background: 'rgba(255,255,255,0.04)', borderRadius: 10 }} className="shimmer" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[60, 36, 24, 100, 48].map((h, i) => (
          <div key={i} style={{ height: h, background: 'rgba(255,255,255,0.04)', borderRadius: 4, width: i === 1 ? '40%' : '100%' }} className="shimmer" />
        ))}
      </div>
    </div>
  </div>
);

export default MovieDetail;