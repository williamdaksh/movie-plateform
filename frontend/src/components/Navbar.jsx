import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSearchResults, setQuery, clearSearch } from '../store/slices/searchSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  // Debouncing — 300ms baad API call hogi
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

    return () => clearTimeout(timer); // cleanup
  }, [input]);

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo} onClick={() => navigate('/')}>
        🎬 MovieApp
      </h1>
      <input
        type="text"
        placeholder="Search movies, shows, people..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={styles.input}
      />
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 30px',
    backgroundColor: '#1a1a2e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: 'white',
    cursor: 'pointer',
    margin: 0,
    fontSize: '22px',
  },
  input: {
    padding: '10px 20px',
    borderRadius: '25px',
    border: 'none',
    outline: 'none',
    width: '350px',
    fontSize: '15px',
    backgroundColor: '#2a2a3e',
    color: 'white',
  },
};

export default Navbar;