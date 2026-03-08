import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const Home = () => {
  const dispatch = useDispatch();
  const { trending, loading, error } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchTrendingMovies());
  }, [dispatch]);

  if (error) return <h2 style={styles.center}>{error}</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔥 Trending Movies</h1>
      <div style={styles.grid}>
        {loading
          ? // Skeleton cards dikhao
            Array(12).fill(0).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : // Real movies dikhao
            trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
        }
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f0f1a',
    minHeight: '100vh',
    padding: '20px',
  },
  heading: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '30px',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  center: {
    color: 'white',
    textAlign: 'center',
    marginTop: '50px',
  },
};

export default Home;