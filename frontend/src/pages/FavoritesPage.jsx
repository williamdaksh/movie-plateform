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
    <div style={styles.container}>
      <h1 style={styles.heading}>❤️ My Favorites</h1>
      {favorites.length === 0 ? (
        <p style={styles.empty}>Koi favorite nahi hai abhi 😕</p>
      ) : (
        <div style={styles.grid}>
          {favorites.map((item) => (
            <div
              key={item.movieId}
              style={styles.card}
              onClick={() => navigate(`/${item.mediaType}/${item.movieId}`)}
            >
              <img
                src={item.poster
                  ? IMG_URL + item.poster
                  : 'https://via.placeholder.com/200x300?text=No+Image'}
                alt={item.title}
                style={styles.image}
              />
              <div style={styles.info}>
                <p style={styles.title}>{item.title}</p>
                <p style={styles.rating}>⭐ {item.rating?.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0f0f1a', minHeight: '100vh', padding: '20px', color: 'white' },
  heading: { textAlign: 'center', marginBottom: '30px', fontSize: '28px' },
  empty: { textAlign: 'center', color: '#aaa', fontSize: '18px', marginTop: '50px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
  card: { width: '200px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1a1a2e', cursor: 'pointer' },
  image: { width: '100%', height: '300px', objectFit: 'cover' },
  info: { padding: '10px' },
  title: { fontSize: '14px', margin: '0 0 5px', fontWeight: 'bold' },
  rating: { fontSize: '13px', color: '#f5c518', margin: 0 },
};

export default FavoritesPage;