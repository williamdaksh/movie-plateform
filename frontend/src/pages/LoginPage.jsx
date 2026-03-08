import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.logo}>🎬 MovieApp</h1>
        <h2 style={styles.title}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>

        <p style={styles.link}>
          Account nahi hai?{' '}
          <Link to="/signup" style={styles.linkText}>
            Signup karo
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
container: {
  background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
box: {
  backgroundColor: 'rgba(26, 26, 46, 0.9)',
  padding: '40px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
  border: '1px solid rgba(229, 9, 20, 0.2)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  backdropFilter: 'blur(10px)',
},
button: {
  padding: '12px',
  background: 'linear-gradient(90deg, #e50914, #ff4444)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'opacity 0.2s',
},
};

export default LoginPage;