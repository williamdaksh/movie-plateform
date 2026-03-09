import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
  const { results, loading, query } = useSelector((state) => state.search);

  // Agar query hi nahi hai, toh kuch bhi mat dikhao (Home page dikhega)
  if (!query || query.trim() === '') {
    return null;
  }

  return (
    <div style={styles.page}>
      {/* Animated background grain */}
      <div style={styles.grain} />

      {loading ? (
        <div style={styles.centerWrapper}>
          <div style={styles.spinnerWrapper}>
            <div style={styles.spinner} />
          </div>
          <p style={styles.loadingText}>Searching<span style={styles.dots}>...</span></p>
        </div>
      ) : results.length === 0 ? (
        <div style={styles.centerWrapper}>
          <div style={styles.noResultIcon}>🎬</div>
          <h2 style={styles.noResultHeading}>Koi result nahi mila</h2>
          <p style={styles.noResultSub}>
            <span style={styles.queryHighlight}>"{query}"</span> ke liye kuch nahi mila.
            <br />Spelling check karein ya kuch aur try karein.
          </p>
        </div>
      ) : (
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLine} />
            <div style={styles.headerContent}>
              <span style={styles.resultCount}>{results.length} Results</span>
              <h2 style={styles.heading}>
                Results for{' '}
                <span style={styles.queryText}>"{query}"</span>
              </h2>
            </div>
          </div>

          {/* Grid */}
          <div style={styles.grid}>
            {results.map((item, index) => (
              <div
                key={item.id}
                style={{
                  ...styles.cardWrapper,
                  animationDelay: `${index * 0.07}s`,
                }}
                className="search-card-fade"
              >
                <MovieCard movie={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inline CSS for animations and responsive grid */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .search-card-fade {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes dot-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        /* Responsive Grid */
        .search-grid-responsive {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 480px) {
          .search-grid-responsive {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          .search-grid-responsive {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
        }

        @media (min-width: 1024px) {
          .search-grid-responsive {
            grid-template-columns: repeat(5, 1fr);
            gap: 28px;
          }
        }

        @media (min-width: 1400px) {
          .search-grid-responsive {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#080810',
    minHeight: '100vh',
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  grain: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
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
    padding: '84px 20px 60px', // 64px navbar + 20px gap
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '40px',
  },
  headerLine: {
    width: '4px',
    height: '64px',
    borderRadius: '4px',
    background: 'linear-gradient(180deg, #c9a227, #7a5c00)',
    flexShrink: 0,
    marginTop: '4px',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  resultCount: {
    color: '#c9a227',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(28px, 5vw, 48px)',
    color: '#f0f0f0',
    margin: 0,
    letterSpacing: '1px',
    lineHeight: 1.1,
  },
  queryText: {
    color: '#c9a227',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  },
  cardWrapper: {
    borderRadius: '10px',
    overflow: 'hidden',
  },

  // Center states
  centerWrapper: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '40px 20px',
    textAlign: 'center',
  },
  spinnerWrapper: {
    marginBottom: '24px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '3px solid rgba(201,162,39,0.2)',
    borderTopColor: '#c9a227',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#888',
    fontSize: '16px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  dots: {
    display: 'inline-block',
    animation: 'dot-blink 1.2s infinite',
  },
  noResultIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    filter: 'grayscale(0.5)',
  },
  noResultHeading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(28px, 6vw, 52px)',
    color: '#f0f0f0',
    margin: '0 0 16px',
    letterSpacing: '2px',
  },
  noResultSub: {
    color: '#888',
    fontSize: '15px',
    lineHeight: '1.7',
    maxWidth: '380px',
  },
  queryHighlight: {
    color: '#c9a227',
    fontWeight: '500',
  },
};

export default SearchPage;