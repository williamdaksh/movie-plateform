import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { IMG_URL } from '../api/tmdb';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trending, loading, error, page, hasMore } = useSelector(
    (state) => state.movies
  );

  const observerRef = useRef(null);
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchTrendingMovies(page + 1));
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page]
  );

  useEffect(() => {
    dispatch(fetchTrendingMovies(1));
  }, [dispatch]);

  // Hero movie — pehli trending movie
  const heroMovie = trending[0];

  if (error) return <h2 style={styles.center}>{error}</h2>;

  return (
    <div style={styles.container}>

      {/* Hero Banner */}
      {heroMovie && (
        <div
          style={{
            ...styles.hero,
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`,
          }}
        >
          <div style={styles.heroOverlay}>
            <h1 style={styles.heroTitle}>
              {heroMovie.title || heroMovie.name}
            </h1>
            <p style={styles.heroOverview}>
              {heroMovie.overview?.slice(0, 150)}...
            </p>
            <div style={styles.heroButtons}>
              <button
                style={styles.watchBtn}
                onClick={() => navigate(`/movie/${heroMovie.id}`)}
              >
                ▶ Watch Now
              </button>
              <button
                style={styles.infoBtn}
                onClick={() => navigate(`/movie/${heroMovie.id}`)}
              >
                ℹ More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trending Section */}
      <div style={styles.section}>
        <h2 style={styles.heading}>🔥 Trending Movies</h2>
        <div style={styles.grid}>
          {trending.map((movie, index) => {
            if (index === trending.length - 1) {
              return (
                <div ref={lastMovieRef} key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              );
            }
            return <MovieCard key={movie.id} movie={movie} />;
          })}
          {loading && Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        {!hasMore && !loading && (
          <p style={styles.end}>🎬 Sab movies dekh li!</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0f0f1a', minHeight: '100vh', color: 'white' },
  hero: {
    height: '550px',
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
  },
  heroOverlay: {
    background: 'linear-gradient(to top, #0f0f1a 0%, rgba(15,15,26,0.6) 60%, transparent 100%)',
    width: '100%',
    padding: '40px',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
  },
  heroOverview: {
    fontSize: '16px',
    color: '#ccc',
    maxWidth: '600px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
  },
  watchBtn: {
    padding: '12px 30px',
    backgroundColor: '#e50914',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  infoBtn: {
    padding: '12px 30px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
  },
  section: { padding: '20px 30px' },
  heading: { fontSize: '24px', marginBottom: '20px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
  center: { color: 'white', textAlign: 'center', marginTop: '50px' },
  end: { color: '#aaa', textAlign: 'center', marginTop: '30px', fontSize: '16px' },
};

export default Home;