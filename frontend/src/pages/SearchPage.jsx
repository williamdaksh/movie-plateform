import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
  const { results, loading, query } = useSelector(
    (state) => state.search
  );

  if (loading) return <h2 style={styles.center}>Searching... 🔍</h2>;

  if (results.length === 0)
    return (
      <h2 style={styles.center}>
        "{query}" ke liye koi result nahi mila 😕
      </h2>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        🔍 Results for "{query}"
      </h2>
      <div style={styles.grid}>
        {results.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
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

export default SearchPage;