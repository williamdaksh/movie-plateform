import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_URL } from '../api/tmdb';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? IMG_URL + movie.poster_path
    : 'https://via.placeholder.com/200x300?text=No+Image';

  const type = movie.media_type 
  ? movie.media_type  // agar media_type hai toh use karo
  : movie.title 
    ? 'movie'         // agar title hai toh movie hai
    : 'tv'; 

  const handleClick = () => {
    navigate(`/${type}/${movie.id}`);
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <img
        src={posterUrl}
        alt={movie.title || movie.name}
        style={styles.image}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>
          {movie.title || movie.name}
        </h3>
        <p style={styles.rating}>
          ⭐ {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: '200px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  },
  info: {
    padding: '10px',
  },
  title: {
    fontSize: '14px',
    margin: '0 0 5px 0',
  },
  rating: {
    fontSize: '13px',
    color: '#f5c518',
    margin: 0,
  },
};

export default MovieCard;