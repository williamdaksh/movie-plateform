import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../store/slices/toastSlice';

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const COLORS = {
  success: { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  icon: '#22c55e', bar: '#22c55e' },
  error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: '#ef4444', bar: '#ef4444' },
  warning: { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.3)',  icon: '#eab308', bar: '#eab308' },
  info:    { bg: 'rgba(201,168,76,0.10)', border: 'rgba(201,168,76,0.3)', icon: '#C9A84C', bar: '#C9A84C' },
};

const Toast = ({ toast }) => {
  const dispatch = useDispatch();
  const c = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), toast.duration);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 16px',
      background: 'rgba(12,12,18,0.97)',
      border: `1px solid ${c.border}`,
      borderLeft: `3px solid ${c.icon}`,
      borderRadius: 6,
      minWidth: 280, maxWidth: 380,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(16px)',
      animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
      overflow: 'hidden',
    }}>
      {/* Icon */}
      <div style={{ color: c.icon, flexShrink: 0, marginTop: 1 }}>{ICONS[toast.type]}</div>

      {/* Message */}
      <p style={{ color: '#E0D8CC', fontSize: 13, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, margin: 0, flex: 1 }}>
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        style={{ background: 'none', border: 'none', color: '#5A5045', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = '#9A8E7F'}
        onMouseLeave={e => e.currentTarget.style.color = '#5A5045'}
      >✕</button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 2, background: c.bar, opacity: 0.5,
        animation: `toastProgress ${toast.duration}ms linear forwards`,
      }} />
    </div>
  );
};

const ToastManager = () => {
  const { toasts } = useSelector(s => s.toast);

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast toast={t} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastManager;