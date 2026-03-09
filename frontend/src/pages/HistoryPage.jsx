import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHistory, clearAllHistory, deleteHistoryItem } from '../store/slices/historySlice';
import { IMG_URL } from '../api/tmdb';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { history } = useSelector((state) => state.history);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchHistory());
  }, [user]);

  return (
    <div style={styles.page}>
      {/* Background grain */}
      <div style={styles.grain} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerLine} />
            <div>
              <span style={styles.label}>{history.length} Titles Watched</span>
              <h1 style={styles.heading}>Watch <span style={styles.gold}>History</span></h1>
            </div>
          </div>

          {history.length > 0 && (
            <button
              style={styles.clearBtn}
              onClick={() => dispatch(clearAllHistory())}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(180,40,40,0.15)';
                e.currentTarget.style.borderColor = '#B42828';
                e.currentTarget.style.color = '#E05555';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(180,40,40,0.35)';
                e.currentTarget.style.color = '#8A4040';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginRight: '7px' }}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Empty state */}
        {history.length === 0 ? (
          <div style={styles.emptyWrapper}>
            <div style={styles.emptyIcon}>◷</div>
            <h2 style={styles.emptyTitle}>No watch history yet</h2>
            <p style={styles.emptyText}>
              Start watching movies and series — they'll appear here automatically.
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
            {history.map((item, index) => (
              <div
                key={item._id}
                style={{ ...styles.card, animationDelay: `${index * 0.06}s` }}
                className="hist-card"
                onClick={() => navigate(`/${item.mediaType}/${item.movieId}`)}
              >
                <div style={styles.imgWrapper}>
                  <img
                    src={item.poster ? IMG_URL + item.poster : 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={item.title}
                    style={styles.image}
                  />
                  {/* Hover overlay */}
                  <div style={styles.overlay} className="hist-overlay">
                    <span style={styles.playBtn}>▶</span>
                  </div>
                  {/* Delete button */}
                  <button
                    style={styles.deleteBtn}
                    className="hist-delete-btn"
                    onClick={e => {
                      e.stopPropagation(); // card click na ho
                      dispatch(deleteHistoryItem(item._id));
                    }}
                    title="Remove from history"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                  {/* Series badge */}
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

        .hist-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .hist-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hist-card:hover .hist-overlay {
          opacity: 1;
        }

        .hist-card:hover img {
          transform: scale(1.05);
        }

        .hist-delete-btn {
          opacity: 0;
          transition: opacity 0.2s ease, background 0.2s ease;
        }

        .hist-card:hover .hist-delete-btn {
          opacity: 1;
        }

        .hist-delete-btn:hover {
          background: rgba(200, 40, 40, 0.9) !important;
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
    padding: '84px 28px 60px',
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '44px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
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

  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '9px 20px',
    background: 'transparent',
    border: '1px solid rgba(180,40,40,0.35)',
    borderRadius: '3px',
    color: '#8A4040',
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

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
  deleteBtn: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.75)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#E05555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    zIndex: 10,
  },
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
    maxWidth: '320px',
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

export default HistoryPage;