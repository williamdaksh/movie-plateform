import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_URL } from '../api/tmdb';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const poster = movie.poster_path
    ? IMG_URL + movie.poster_path
    : 'https://via.placeholder.com/200x300?text=No+Image';

  const type = movie.media_type ? movie.media_type : movie.title ? 'movie' : 'tv';
  const rating = movie.vote_average?.toFixed(1);
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const title = movie.title || movie.name || '';

  return (
    <div
      onClick={() => navigate(`/${type}/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      {/* Poster wrapper */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        border: hovered ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.75)' : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'border 0.3s, box-shadow 0.3s',
        aspectRatio: '2/3',
      }}>
        {/* Poster image */}
        <img
          src={poster}
          alt={title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transition: 'transform 0.5s ease, filter 0.35s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            filter: hovered ? 'brightness(0.35)' : 'brightness(0.88)',
          }}
        />

        {/* Rating — top right */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(201,168,76,0.4)',
          padding: '3px 8px', borderRadius: '2px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{ color: '#C9A84C', fontSize: '10px' }}>★</span>
          <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'DM Sans, sans-serif' }}>
            {rating}
          </span>
        </div>

        {/* TV badge — top left */}
        {type === 'tv' && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'rgba(139,0,0,0.9)',
            padding: '2px 8px', borderRadius: '2px',
            fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
            color: '#F0EAD6', fontFamily: 'DM Sans, sans-serif',
          }}>Series</div>
        )}

        {/* Hover overlay — centered */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '50%',
            border: '1.5px solid #C9A84C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#C9A84C', fontSize: '16px', marginLeft: '3px' }}>▶</span>
          </div>
          <span style={{
            color: '#F0EAD6', fontSize: '10px', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
          }}>View Details</span>
        </div>
      </div>

      {/* Info below poster */}
      <div style={{ paddingTop: '12px', paddingLeft: '2px' }}>
        {/* Gold line */}
        <div style={{
          height: '1px', backgroundColor: '#C9A84C',
          width: hovered ? '32px' : '16px',
          marginBottom: '8px',
          transition: 'width 0.3s ease',
        }} />
        {/* Title */}
        <p style={{
          color: hovered ? '#F0EAD6' : '#8A8070',
          fontSize: '13px', fontWeight: 500,
          fontFamily: 'DM Sans, sans-serif',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          letterSpacing: '0.2px',
          transition: 'color 0.3s',
          marginBottom: '3px',
        }}>{title}</p>
        {/* Year */}
        <span style={{
          color: '#4A4035', fontSize: '11px',
          letterSpacing: '1.5px', fontFamily: 'DM Sans, sans-serif',
        }}>{year}</span>
      </div>
    </div>
  );
};

export default MovieCard;
