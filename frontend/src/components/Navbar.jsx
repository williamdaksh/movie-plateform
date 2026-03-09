import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSearchResults, setQuery, clearSearch } from '../store/slices/searchSlice';
import { logoutUser } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [input, setInput] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const menuRef = useRef(null);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/search') setInput('');
  }, [location.pathname]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (input.trim()) {
        dispatch(setQuery(input));
        dispatch(fetchSearchResults(input));
        navigate('/search');
      } else {
        dispatch(clearSearch());
        if (location.pathname === '/search') navigate('/');
      }
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';

  const handleClear = () => { setInput(''); dispatch(clearSearch()); setMobileSearchOpen(false); navigate('/'); };

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const navBg = scrolled ? 'rgba(6,6,6,0.96)' : 'linear-gradient(180deg, rgba(6,6,6,0.85) 0%, transparent 100%)';
  const navBorder = scrolled ? '1px solid rgba(201,168,76,0.10)' : '1px solid transparent';
  const inputBg = focused ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.07)';
  const inputBorder = focused ? '1px solid rgba(201,168,76,0.65)' : '1px solid rgba(255,255,255,0.22)';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : isTablet ? '0 24px' : '0 48px',
        background: navBg,
        borderBottom: navBorder,
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        transition: 'all 0.35s ease',
        overflow: 'visible',
        boxSizing: 'border-box',
      }}>

        {/* Logo */}
        <div onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}>
          <div style={{ width: '22px', height: '22px', border: '1.5px solid #C9A84C', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ transform: 'rotate(-45deg)', color: '#C9A84C', fontSize: '8px' }}>▶</span>
          </div>
          {!isMobile && (
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: isTablet ? '17px' : '20px', letterSpacing: '5px', color: '#F0EAD6' }}>
              CINEVERSE
            </span>
          )}
        </div>

        {/* Desktop & Tablet Search */}
        {!isMobile && (
          <div style={{ position: 'relative', flex: isTablet ? '1' : 'unset', maxWidth: isTablet ? '300px' : 'unset', margin: isTablet ? '0 16px' : '0' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={focused ? '#C9A84C' : '#A89880'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search titles, people..."
              style={{
                width: isTablet ? '100%' : (focused ? '260px' : '200px'),
                padding: '8px 32px 8px 34px',
                background: inputBg,
                border: inputBorder,
                borderRadius: '3px', color: '#F0EAD6', fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif', outline: 'none',
                transition: 'all 0.3s ease', backdropFilter: 'blur(8px)',
              }}
            />
            {input && (
              <button onClick={handleClear} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6A5F52', fontSize: '13px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = '#6A5F52'}
              >✕</button>
            )}
          </div>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', flexShrink: 0 }}>

          {/* Mobile search icon */}
          {isMobile && (
            <button onClick={() => setMobileSearchOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={mobileSearchOpen ? '#C9A84C' : '#A89880'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          )}

          {user ? (
            <>
              {!isMobile && !isTablet && (
                <>
                  <NavBtn onClick={() => navigate('/favorites')} label="♡  Favorites" />
                  <NavBtn onClick={() => navigate('/history')} label="◷  History" />
                  <div style={{ width: '1px', height: '16px', background: 'rgba(201,168,76,0.15)' }} />
                </>
              )}

              <div ref={menuRef} style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(o => !o)} title={user.name}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color: '#080808',
                    fontFamily: 'DM Sans, sans-serif',
                    border: menuOpen ? '2px solid #C9A84C' : '2px solid transparent',
                    transition: 'border 0.2s',
                  }}>{initials}</div>
                  {!isMobile && <span style={{ color: menuOpen ? '#C9A84C' : '#9A8E7F', fontSize: '11px', transition: 'color 0.2s' }}>▾</span>}
                </button>

                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'rgba(14,12,10,0.97)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '4px', minWidth: '180px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    overflow: 'hidden', animation: 'fadeDown 0.18s ease',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                      <div style={{ color: '#F0EAD6', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{user.name}</div>
                      {user.email && <div style={{ color: '#5A5045', fontSize: '11px', marginTop: '2px', fontFamily: 'DM Sans, sans-serif' }}>{user.email}</div>}
                    </div>

                    {(isMobile || isTablet) && (
                      <>
                        <DropdownItem label="♡  Favorites" onClick={() => { navigate('/favorites'); setMenuOpen(false); }} />
                        <DropdownItem label="◷  History" onClick={() => { navigate('/history'); setMenuOpen(false); }} />
                        <div style={{ height: '1px', background: 'rgba(201,168,76,0.08)', margin: '4px 0' }} />
                      </>
                    )}
                    <DropdownItem label="My Profile" onClick={() => { navigate('/profile'); setMenuOpen(false); }} />
                    <div style={{ height: '1px', background: 'rgba(201,168,76,0.08)', margin: '4px 0' }} />
                    <DropdownItem label="Sign Out" danger onClick={() => { dispatch(logoutUser()); handleClear(); setMenuOpen(false); }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              padding: isMobile ? '7px 14px' : '8px 22px',
              background: 'transparent',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '3px', color: '#C9A84C',
              fontSize: '11px', letterSpacing: isMobile ? '1px' : '2px',
              textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {isMobile ? 'Login' : 'Sign In'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Search Dropdown */}
      {isMobile && mobileSearchOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 998,
          padding: '10px 16px',
          background: 'rgba(6,6,6,0.97)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          backdropFilter: 'blur(18px)',
          animation: 'slideDown 0.2s ease',
        }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#A89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input autoFocus value={input} onChange={e => setInput(e.target.value)}
              placeholder="Search titles, people..."
              style={{ width: '100%', padding: '10px 36px 10px 36px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '3px', color: '#F0EAD6', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
            />
            {input && (
              <button onClick={handleClear} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6A5F52', fontSize: '14px', cursor: 'pointer' }}>✕</button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeDown  { from { opacity: 0; transform: translateY(-6px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

const NavBtn = ({ onClick, label }) => {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'transparent', border: 'none', padding: '0', color: h ? '#C9A84C' : '#D4C9B0', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'color 0.2s', textShadow: '0 1px 6px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}
    >{label}</button>
  );
};

const DropdownItem = ({ label, onClick, danger }) => {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: h ? 'rgba(201,168,76,0.07)' : 'transparent', border: 'none', cursor: 'pointer', color: danger ? (h ? '#E05555' : '#8A4040') : (h ? '#C9A84C' : '#7A6E5F'), fontSize: '12px', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}
    >{label}</button>
  );
};

export default Navbar;