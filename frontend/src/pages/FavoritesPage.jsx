import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites } from '../store/slices/favoriteSlice';
import { IMG_URL } from '../api/tmdb';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchFavorites());
  }, [user]);

  return (
    <div style={styles.page}>
      {/* Background grain */}
      <div style={styles.grain} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLine} />
          <div>
            <span style={styles.label}>{favorites.length} Titles</span>
            <h1 style={styles.heading}>My <span style={styles.gold}>Favorites</span></h1>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div style={styles.emptyWrapper}>
            <div style={styles.emptyIcon}>♡</div>
            <h2 style={styles.emptyTitle}>No favorites yet</h2>
            <p style={styles.emptyText}>
              Browse movies and series and add them to your favorites list.
            </p>
            <button
              style={styles.browseBtn}
              onClick={() => navigate('/')}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
                e.currentTarget.style.borderColor = '#C9A84C';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              }}
            >
              Browse Now
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {favorites.map((item, index) => (
              <div
                key={item.movieId}
                style={{ ...styles.card, animationDelay: `${index * 0.06}s` }}
                className="fav-card"
                onClick={() => navigate(`/${item.mediaType}/${item.movieId}`)}
              >
                <div style={styles.imgWrapper}>
                  <img
                    src={item.poster ? IMG_URL + item.poster : 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={item.title}
                    style={styles.image}
                  />
                  {/* Overlay on hover */}
                  <div style={styles.overlay} className="fav-overlay">
                    <span style={styles.playBtn}>▶</span>
                  </div>
                  {/* Media type badge */}
                  {item.mediaType === 'tv' && (
                    <div style={styles.badge}>SERIES</div>
                  )}
                  {/* Rating */}
                  <div style={styles.ratingBadge}>
                    <span style={styles.star}>★</span>
                    {item.rating?.toFixed(1)}
                  </div>
                </div>
                <div style={styles.info}>
                  <p style={styles.title}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .fav-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .fav-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .fav-card:hover .fav-overlay {
          opacity: 1;
        }

        .fav-card:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 480px) {
          .fav-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#080810',
    minHeight: '100vh',
    position: 'relative',
    fontFamily: "'DM Sans', sans-serif",
  },
  grain: {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat',
    backgroundSize: '128px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '84px 28px 60px', // 64px navbar + 20px gap
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '44px',
  },
  headerLine: {
    width: '4px',
    height: '64px',
    borderRadius: '4px',
    background: 'linear-gradient(180deg, #C9A84C, #7a5c00)',
    flexShrink: 0,
    marginTop: '4px',
  },
  label: {
    color: '#C9A84C',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '4px',
  },
  heading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(32px, 5vw, 52px)',
    color: '#F0EAD6',
    margin: 0,
    letterSpacing: '2px',
    lineHeight: 1.1,
  },
  gold: { color: '#C9A84C' },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '20px',
  },

  // Card
  card: {
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111118',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  imgWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s ease',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(201,168,76,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#080810',
    fontSize: '16px',
    paddingLeft: '3px',
  },
  badge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    background: 'rgba(180,30,30,0.9)',
    color: '#fff',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    padding: '3px 7px',
    borderRadius: '2px',
  },
  ratingBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.75)',
    color: '#F0EAD6',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 7px',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    backdropFilter: 'blur(4px)',
  },
  star: { color: '#C9A84C', fontSize: '10px' },
  info: {
    padding: '10px 12px 12px',
  },
  title: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#D4C9B0',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  // Empty state
  emptyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '64px',
    color: '#C9A84C',
    lineHeight: 1,
  },
  emptyTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '36px',
    color: '#F0EAD6',
    margin: 0,
    letterSpacing: '2px',
  },
  emptyText: {
    color: '#6A5F52',
    fontSize: '14px',
    maxWidth: '300px',
    lineHeight: 1.6,
  },
  browseBtn: {
    marginTop: '8px',
    padding: '10px 28px',
    background: 'transparent',
    border: '1px solid rgba(201,168,76,0.4)',
    borderRadius: '3px',
    color: '#C9A84C',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default FavoritesPage;