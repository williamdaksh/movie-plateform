import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser, clearError } from '../store/slices/authSlice';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { if (user) navigate('/'); }, [user]);
  useEffect(() => () => dispatch(clearError()), []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return;
    dispatch(signupUser(form));
  };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-input::placeholder { color: #3A3530; }

        .auth-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #111108 inset !important;
          -webkit-text-fill-color: #F5F0E8 !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-form { animation: fadeIn 0.5s ease forwards; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .auth-panel { display: none !important; }
          .auth-right { padding: 40px 24px !important; }
        }
      `}</style>

      {/* Left branding panel */}
      <div className="auth-panel" style={styles.panel}>
        {[400, 280, 160].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: s, height: s,
            borderRadius: '50%',
            border: `1px solid rgba(201,168,76,${0.04 + i * 0.03})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
          }} />
        ))}

        <div style={{ position: 'absolute', top: 32, left: 32, width: 28, height: 28, borderTop: '1.5px solid rgba(201,168,76,0.3)', borderLeft: '1.5px solid rgba(201,168,76,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 32, right: 32, width: 28, height: 28, borderBottom: '1.5px solid rgba(201,168,76,0.3)', borderRight: '1.5px solid rgba(201,168,76,0.3)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64,
            border: '2px solid #C9A84C',
            transform: 'rotate(45deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <span style={{ transform: 'rotate(-45deg)', fontSize: '22px', color: '#C9A84C' }}>▶</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '38px', letterSpacing: '10px', color: '#F5F0E8', marginBottom: '16px' }}>
            CINEVERSE
          </div>
          <div style={{ width: 40, height: '1.5px', background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto 16px' }} />
          <p style={{ color: '#7A6E5F', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
            Premium Cinema Experience
          </p>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {['🎬 Unlimited Movies & Series', '⭐ Personalized Watchlist', '🔒 Secure & Ad-Free'].map((f, i) => (
              <div key={i} style={{
                padding: '8px 18px',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '20px',
                color: '#9A8E7F',
                fontSize: '12px',
                fontFamily: "'DM Sans', sans-serif",
              }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right" style={styles.right}>
        <div className="auth-form" style={styles.formWrapper}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ height: '1px', width: 28, backgroundColor: '#C9A84C' }} />
              <span style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
                New Account
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: '#F5F0E8', lineHeight: 1.1, marginBottom: 10 }}>
              Create Account
            </h1>
            <p style={{ color: '#8A7E6F', fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Join the ultimate cinema experience
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {/* Full Name */}
            <div>
              <label style={{ ...styles.label, color: focused === 'name' ? '#C9A84C' : '#8A7E6F' }}>Full Name</label>
              <input
                className="auth-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                onKeyDown={handleKeyDown}
                placeholder="John Doe"
                style={{
                  ...styles.input,
                  borderColor: focused === 'name' ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)',
                  boxShadow: focused === 'name' ? '0 0 0 3px rgba(201,168,76,0.07)' : 'none',
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ ...styles.label, color: focused === 'email' ? '#C9A84C' : '#8A7E6F' }}>Email Address</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                style={{
                  ...styles.input,
                  borderColor: focused === 'email' ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)',
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(201,168,76,0.07)' : 'none',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ ...styles.label, color: focused === 'password' ? '#C9A84C' : '#8A7E6F' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKeyDown}
                  placeholder="Min. 6 characters"
                  style={{
                    ...styles.input,
                    paddingRight: 44,
                    borderColor: focused === 'password' ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)',
                    boxShadow: focused === 'password' ? '0 0 0 3px rgba(201,168,76,0.07)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background: loading ? 'rgba(201,168,76,0.25)' : 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={styles.spinner} />
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#504840', fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#7A6E5F', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>

          {/* Browse without account */}
          <p style={{ textAlign: 'center', marginTop: 14 }}>
            <Link
              to="/"
              style={{ color: '#504840', fontSize: 13, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#8A7E6F'}
              onMouseLeave={e => e.currentTarget.style.color = '#504840'}
            >
              ← Browse without signing in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#080810',
    fontFamily: "'DM Sans', sans-serif",
  },
  panel: {
    width: '44%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, #0C0C0E 0%, #0A0A0C 100%)',
    borderRight: '1px solid rgba(201,168,76,0.1)',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 64px',
    background: '#080810',
    overflow: 'hidden',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 380,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontSize: 11,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  input: {
    width: '100%',
    padding: '11px 16px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    color: '#F5F0E8',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'all 0.2s ease',
    display: 'block',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    color: '#0A0A0A',
    fontSize: 11,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    borderRadius: 3,
    border: 'none',
    transition: 'all 0.2s ease',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    padding: '12px 14px',
    backgroundColor: 'rgba(193,18,31,0.08)',
    border: '1px solid rgba(193,18,31,0.2)',
    borderLeft: '3px solid #C1121F',
    borderRadius: 3,
    color: '#FF6B6B',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(10,10,10,0.3)',
    borderTopColor: '#0A0A0A',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};

export default SignupPage;