import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetail, clearDetail } from '../store/slices/movieSlice';
import { IMG_URL } from '../api/tmdb';
import { addFavorite, removeFavorite, checkFavorite } from '../store/slices/favoriteSlice';
import { addHistory } from '../store/slices/historySlice';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const path = window.location.pathname;
  const type = path.startsWith('/tv') ? 'tv' : 'movie';

  const { isFavorite } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const { detail, videos, cast, detailLoading } = useSelector((state) => state.movies);

  // Movie fetch karo
  useEffect(() => {
    dispatch(fetchMovieDetail({ id, type }));
    return () => dispatch(clearDetail());
  }, [id, dispatch]);

  // History save karo + favorite check karo
  useEffect(() => {
    if (detail && user) {
      dispatch(addHistory({
        movieId: String(detail.id),
        title: detail.title || detail.name,
        poster: detail.poster_path,
        mediaType: type,
        rating: detail.vote_average,
      }));
      dispatch(checkFavorite(String(detail.id)));
    }
  }, [detail]);

  const handleFavoriteToggle = () => {
    if (!user) { navigate('/login'); return; }
    if (isFavorite) {
      dispatch(removeFavorite(String(detail.id)));
    } else {
      dispatch(addFavorite({
        movieId: String(detail.id),
        title: detail.title || detail.name,
        poster: detail.poster_path,
        mediaType: type,
        rating: detail.vote_average,
      }));
    }
  };

  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');

  if (detailLoading) return (
    <div style={{backgroundColor: '#0f0f1a', minHeight: '100vh', padding: '40px'}}>
      <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
        <div className="skeleton" style={{width: '280px', height: '420px', borderRadius: '10px', backgroundColor: '#2a2a3e'}} />
        <div style={{flex: 1, minWidth: '280px'}}>
          <div className="skeleton" style={{height: '40px', backgroundColor: '#2a2a3e', borderRadius: '4px', marginBottom: '15px'}} />
          <div className="skeleton" style={{height: '20px', width: '30%', backgroundColor: '#2a2a3e', borderRadius: '4px', marginBottom: '10px'}} />
          <div className="skeleton" style={{height: '20px', width: '40%', backgroundColor: '#2a2a3e', borderRadius: '4px', marginBottom: '20px'}} />
          <div className="skeleton" style={{height: '100px', backgroundColor: '#2a2a3e', borderRadius: '4px'}} />
        </div>
      </div>
    </div>
  );

  if (!detail) return <h2 style={styles.center}>Movie nahi mili 😕</h2>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Wapas jao
      </button>

      <div style={styles.hero}>
        <img
          src={detail.poster_path ? IMG_URL + detail.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={detail.title || detail.name}
          style={styles.poster}
        />
        <div style={styles.info}>
          <h1 style={styles.title}>{detail.title || detail.name}</h1>
          <p style={styles.rating}>⭐ {detail.vote_average?.toFixed(1)} / 10</p>
          <p style={styles.date}>📅 {detail.release_date || detail.first_air_date}</p>
          <p style={styles.overview}>{detail.overview || 'Description available nahi hai.'}</p>
          <div style={styles.genres}>
            {detail.genres?.map((g) => (
              <span key={g.id} style={styles.genre}>{g.name}</span>
            ))}
          </div>
          <button
            onClick={handleFavoriteToggle}
            style={{
              ...styles.favBtn,
              backgroundColor: isFavorite ? '#e50914' : 'transparent',
              border: isFavorite ? 'none' : '2px solid white',
            }}
          >
            {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎬 Trailer</h2>
        {trailer ? (
          <iframe
            width="100%"
            height="450"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
            style={styles.iframe}
          />
        ) : (
          <p style={styles.noTrailer}>Trailer abhi available nahi hai 😕</p>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎭 Cast</h2>
        <div style={styles.castGrid}>
          {cast.map((person) => (
            <div key={person.id} style={styles.castCard}>
              <img
                src={person.profile_path ? IMG_URL + person.profile_path : 'https://via.placeholder.com/100x150?text=No+Photo'}
                alt={person.name}
                style={styles.castImg}
              />
              <p style={styles.castName}>{person.name}</p>
              <p style={styles.castRole}>{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#0f0f1a', minHeight: '100vh', padding: '20px 40px', color: 'white' },
  backBtn: { backgroundColor: '#e50914', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', fontSize: '15px' },
  hero: { display: 'flex', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' },
  poster: { width: '280px', borderRadius: '10px', objectFit: 'cover' },
  info: { flex: 1, minWidth: '280px' },
  title: { fontSize: '32px', marginBottom: '10px' },
  rating: { fontSize: '18px', color: '#f5c518' },
  date: { fontSize: '15px', color: '#aaa' },
  overview: { fontSize: '16px', lineHeight: '1.7', margin: '15px 0' },
  genres: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  genre: { backgroundColor: '#e50914', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px' },
  iframe: { borderRadius: '10px' },
  noTrailer: { color: '#aaa', fontSize: '16px' },
  castGrid: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  castCard: { textAlign: 'center', width: '100px' },
  castImg: { width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px' },
  castName: { fontSize: '12px', margin: '5px 0 2px', fontWeight: 'bold' },
  castRole: { fontSize: '11px', color: '#aaa', margin: 0 },
  center: { color: 'white', textAlign: 'center', marginTop: '50px' },
  favBtn: { padding: '10px 25px', color: 'white', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' },
};

export default MovieDetail;