import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHistory, clearAllHistory } from '../store/slices/historySlice';
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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>🕐 Watch History</h1>
        {history.length > 0 && (
          <button
            onClick={() => dispatch(clearAllHistory())}
            style={styles.clearBtn}
          >
            🗑️ Clear All
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p style={styles.empty}>Koi history nahi hai abhi 😕</p>
      ) : (
        <div style={styles.grid}>
          {history.map((item) => (
            <div
              key={item._id}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  heading: { fontSize: '28px' },
  clearBtn: { padding: '8px 18px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#aaa', fontSize: '18px', marginTop: '50px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
  card: { width: '200px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1a1a2e', cursor: 'pointer' },
  image: { width: '100%', height: '300px', objectFit: 'cover' },
  info: { padding: '10px' },
  title: { fontSize: '14px', margin: '0 0 5px', fontWeight: 'bold' },
  rating: { fontSize: '13px', color: '#f5c518', margin: 0 },
};

export default HistoryPage;