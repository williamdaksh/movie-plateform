import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import { toast } from '../store/slices/toastSlice';
import { IMG_URL } from '../api/tmdb';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { favorites } = useSelector(s => s.favorites);
  const { history } = useSelector(s => s.history);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Cineverse Member';

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(toast.info('Logged out successfully'));
    navigate('/');
  };

  const stats = [
    { label: 'Movies Watched', value: history.filter(h => h.mediaType === 'movie').length, icon: '🎬' },
    { label: 'Series Watched', value: history.filter(h => h.mediaType === 'tv').length, icon: '📺' },
    { label: 'Favorites', value: favorites.length, icon: '♥' },
    { label: 'Total Watched', value: history.length, icon: '⏱' },
  ];

  return (
    <div style={{ background: '#080810', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", paddingTop: 64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .tab-btn { background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; padding: 12px 0; position: relative; transition: color 0.2s; }
        .tab-btn::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #C9A84C; transform: scaleX(0); transition: transform 0.25s; border-radius: 1px; }
        .tab-btn.active::after { transform: scaleX(1); }

        .stat-card:hover { border-color: rgba(201,168,76,0.3) !important; transform: translateY(-2px); }

        .profile-container { max-width: 900px; margin: 0 auto; padding: 48px 28px 80px; }
        @media (max-width: 640px) { .profile-container { padding: 28px 16px 60px; } }

        .history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
        @media (max-width: 640px) { .history-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <div className="profile-container">

        {/* ── Profile Header ── */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginBottom: 48, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, color: '#080810',
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2,
              border: '3px solid rgba(201,168,76,0.3)',
              boxShadow: '0 0 0 6px rgba(201,168,76,0.06)',
            }}>
              {initials}
            </div>
            {user.isAdmin && (
              <div style={{ position: 'absolute', bottom: 2, right: 2, background: '#C9A84C', color: '#080810', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10, letterSpacing: 1 }}>
                ADMIN
              </div>
            )}
          </div>

          {/* Name & info */}
          <div style={{ flex: 1 }}>
            <p style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 6 }}>
              {memberSince}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 6px' }}>
              {user.name}
            </h1>
            <p style={{ color: '#6A5F52', fontSize: 14, margin: 0 }}>{user.email}</p>
          </div>

          {/* Sign out */}
          <button onClick={handleLogout} style={{
            padding: '10px 22px',
            background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 4, color: '#8A4040',
            fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#E05555'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8A4040'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          >
            Sign Out
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 44 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '20px 22px',
              transition: 'all 0.2s', cursor: 'default',
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#C9A84C', letterSpacing: 1, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: '#6A5F52', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.2), transparent)', marginBottom: 32 }} />

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 28, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 32 }}>
          {[
            { key: 'stats', label: 'Activity' },
            { key: 'favorites', label: `Favorites (${favorites.length})` },
            { key: 'history', label: `History (${history.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              style={{ color: activeTab === tab.key ? '#C9A84C' : '#6A5F52' }}
              onClick={() => setActiveTab(tab.key)}
            >{tab.label}</button>
          ))}
        </div>

        {/* Activity tab */}
        {activeTab === 'stats' && (
          <div className="fade-up">
            {history.length === 0 ? (
              <EmptyState icon="⏱" title="No activity yet" sub="Start watching movies and series to see your activity here." action={() => navigate('/')} actionLabel="Browse Now" />
            ) : (
              <div>
                <p style={{ color: '#6A5F52', fontSize: 13, marginBottom: 24 }}>Recently watched</p>
                <div className="history-grid">
                  {history.slice(0, 12).map((item, i) => (
                    <div key={item._id || i} onClick={() => navigate(`/${item.mediaType}/${item.movieId}`)}
                      style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <img
                        src={item.poster ? IMG_URL + item.poster : 'https://via.placeholder.com/130x190?text=?'}
                        alt={item.title} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '8px 10px' }}>
                        <p style={{ color: '#D4C9B0', fontSize: 12, fontWeight: 500, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                        <p style={{ color: '#6A5F52', fontSize: 11, margin: 0 }}>★ {item.rating?.toFixed(1)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Favorites tab */}
        {activeTab === 'favorites' && (
          <div className="fade-up">
            {favorites.length === 0 ? (
              <EmptyState icon="♡" title="No favorites yet" sub="Add movies and series to your favorites list." action={() => navigate('/')} actionLabel="Browse Now" />
            ) : (
              <div className="history-grid">
                {favorites.map((item, i) => (
                  <div key={item.movieId || i} onClick={() => navigate(`/${item.mediaType}/${item.movieId}`)}
                    style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={item.poster ? IMG_URL + item.poster : 'https://via.placeholder.com/130x190?text=?'}
                      alt={item.title} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '8px 10px' }}>
                      <p style={{ color: '#D4C9B0', fontSize: 12, fontWeight: 500, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                      <p style={{ color: '#C9A84C', fontSize: 11, margin: 0 }}>★ {item.rating?.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History tab */}
        {activeTab === 'history' && (
          <div className="fade-up">
            {history.length === 0 ? (
              <EmptyState icon="◷" title="No watch history" sub="Movies and series you watch will appear here." action={() => navigate('/')} actionLabel="Start Watching" />
            ) : (
              <div className="history-grid">
                {history.map((item, i) => (
                  <div key={item._id || i} onClick={() => navigate(`/${item.mediaType}/${item.movieId}`)}
                    style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={item.poster ? IMG_URL + item.poster : 'https://via.placeholder.com/130x190?text=?'}
                      alt={item.title} style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '8px 10px' }}>
                      <p style={{ color: '#D4C9B0', fontSize: 12, fontWeight: 500, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                      <p style={{ color: '#6A5F52', fontSize: 11, margin: 0 }}>★ {item.rating?.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon, title, sub, action, actionLabel }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{ fontSize: 52, color: '#C9A84C', marginBottom: 16 }}>{icon}</div>
    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#F5F0E8', marginBottom: 10 }}>{title}</h3>
    <p style={{ color: '#6A5F52', fontSize: 14, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>{sub}</p>
    <button onClick={action} style={{ padding: '11px 28px', background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A', border: 'none', borderRadius: 3, fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: 'pointer' }}>
      {actionLabel}
    </button>
  </div>
);

export default ProfilePage;