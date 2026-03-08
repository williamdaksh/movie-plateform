import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_URL } from '../api/tmdb';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const posterUrl = movie.poster_path
    ? IMG_URL + movie.poster_path
    : 'https://via.placeholder.com/200x300?text=No+Image';

  const type = movie.media_type
    ? movie.media_type
    : movie.title ? 'movie' : 'tv';

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hovered ? '0 10px 30px rgba(229, 9, 20, 0.4)' : '0 2px 10px rgba(0,0,0,0.3)',
      }}
      onClick={() => navigate(`/${type}/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.imageWrapper}>
        <img
          src={posterUrl}
          alt={movie.title || movie.name}
          style={styles.image}
        />
        {/* Hover overlay */}
        {hovered && (
          <div style={styles.overlay}>
            <p style={styles.overlayText}>▶ Watch Now</p>
            <p style={styles.overlayRating}>
              ⭐ {movie.vote_average?.toFixed(1)}
            </p>
          </div>
        )}
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title || movie.name}</h3>
        <p style={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  overlayText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#e50914',
    padding: '8px 20px',
    borderRadius: '25px',
    margin: 0,
  },
  overlayRating: {
    color: '#f5c518',
    fontSize: '16px',
    margin: 0,
  },
  info: {
    padding: '10px',
  },
  title: {
    fontSize: '13px',
    margin: '0 0 5px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rating: {
    fontSize: '12px',
    color: '#f5c518',
    margin: 0,
  },
};

export default MovieCard;