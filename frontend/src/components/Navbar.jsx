import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSearchResults, setQuery, clearSearch } from '../store/slices/searchSlice';
import { logoutUser } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim().length > 0) {
        dispatch(setQuery(input));
        dispatch(fetchSearchResults(input));
        navigate('/search');
      } else {
        dispatch(clearSearch());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav style={{
      ...styles.nav,
      backgroundColor: scrolled ? 'rgba(15, 15, 26, 0.98)' : 'rgba(15, 15, 26, 0.7)',
      backdropFilter: 'blur(10px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.5)' : 'none',
    }}>
      {/* Logo */}
      <h1 style={styles.logo} onClick={() => navigate('/')}>
        🎬 <span style={styles.logoText}>MovieApp</span>
      </h1>

      {/* Search */}
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search movies, shows, people..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Auth */}
      <div style={styles.authButtons}>
        {user ? (
          <>
            <span style={styles.navLink} onClick={() => navigate('/favorites')}>
              ❤️ Favorites
            </span>
            <span style={styles.navLink} onClick={() => navigate('/history')}>
              🕐 History
            </span>
            <div style={styles.userMenu}>
              <span style={styles.userName}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={styles.loginBtn}>
              Login
            </button>
            <button onClick={() => navigate('/signup')} style={styles.signupBtn}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 30px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'all 0.3s ease',
    flexWrap: 'wrap',
    gap: '10px',
  },
  logo: {
    color: 'white',
    cursor: 'pointer',
    margin: 0,
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    background: 'linear-gradient(90deg, #e50914, #ff6b6b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '14px',
  },
  input: {
    padding: '10px 20px 10px 36px',
    borderRadius: '25px',
    border: '1px solid #2a2a3e',
    outline: 'none',
    width: '320px',
    fontSize: '14px',
    backgroundColor: 'rgba(42, 42, 62, 0.8)',
    color: 'white',
    transition: 'border 0.3s',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  navLink: {
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  loginBtn: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  signupBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(90deg, #e50914, #ff4444)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '7px 16px',
    backgroundColor: '#2a2a3e',
    color: '#ccc',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default Navbar;