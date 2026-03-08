import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser, clearError } from '../store/slices/authSlice';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

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
    dispatch(signupUser(form));
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.logo}>🎬 MovieApp</h1>
        <h2 style={styles.title}>Signup</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
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
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Loading...' : 'Signup'}
          </button>
        </div>

        <p style={styles.link}>
          Pehle se account hai?{' '}
          <Link to="/login" style={styles.linkText}>
            Login karo
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f0f1a',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#1a1a2e',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '28px',
    marginBottom: '10px',
  },
  title: {
    color: 'white',
    marginBottom: '25px',
    fontSize: '22px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #2a2a3e',
    backgroundColor: '#0f0f1a',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#e50914',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#aaa',
    marginTop: '20px',
    fontSize: '14px',
  },
  linkText: {
    color: '#e50914',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default SignupPage;