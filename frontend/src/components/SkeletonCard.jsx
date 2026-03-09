import React from 'react';

const SkeletonCard = () => {
  return (
    <div style={{ width: '100%' }}>
      {/* Poster skeleton */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          aspectRatio: '2/3',
          borderRadius: '4px',
          backgroundColor: '#111',
        }}
      />
      {/* Info skeleton */}
      <div style={{ padding: '10px 2px 0' }}>
        <div style={{ width: '20px', height: '1px', backgroundColor: '#1a1a1a', marginBottom: '8px' }} />
        <div
          className="skeleton"
          style={{ height: '13px', width: '80%', backgroundColor: '#111', borderRadius: '2px', marginBottom: '6px' }}
        />
        <div
          className="skeleton"
          style={{ height: '11px', width: '40%', backgroundColor: '#111', borderRadius: '2px' }}
        />
      </div>
    </div>
  );
};

export default SkeletonCard;