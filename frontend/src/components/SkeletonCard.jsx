import React from 'react';

const SkeletonCard = () => {
  return (
    <div style={styles.card}>
      <div style={styles.image} className="skeleton" />
      <div style={styles.info}>
        <div style={styles.title} className="skeleton" />
        <div style={styles.rating} className="skeleton" />
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
  },
  image: {
    width: '100%',
    height: '300px',
    backgroundColor: '#2a2a3e',
  },
  info: {
    padding: '10px',
  },
  title: {
    height: '16px',
    backgroundColor: '#2a2a3e',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  rating: {
    height: '12px',
    width: '60%',
    backgroundColor: '#2a2a3e',
    borderRadius: '4px',
  },
};

export default SkeletonCard;