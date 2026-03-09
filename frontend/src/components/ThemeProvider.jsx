import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const THEMES = {
  dark: {
    '--bg-primary':       '#080810',
    '--bg-secondary':     '#0f0f1a',
    '--bg-card':          '#111118',
    '--bg-navbar':        'rgba(6,6,6,0.96)',
    '--bg-input':         'rgba(255,255,255,0.07)',
    '--bg-section':       '#080810',
    '--text-primary':     '#F0EAD6',
    '--text-secondary':   '#A09880',
    '--text-muted':       '#6A5F52',
    '--border':           'rgba(255,255,255,0.08)',
    '--border-gold':      'rgba(201,168,76,0.3)',
    '--gold':             '#C9A84C',
    '--gold-light':       '#E8C97A',
    '--card-bg':          '#111118',
    '--card-border':      'rgba(255,255,255,0.06)',
    '--card-hover':       'rgba(255,255,255,0.04)',
    '--section-heading':  '#F0EAD6',
    '--badge-bg':         'rgba(0,0,0,0.7)',
    '--badge-text':       '#F0EAD6',
    '--btn-secondary-bg': 'rgba(255,255,255,0.08)',
    '--btn-secondary-border': 'rgba(255,255,255,0.18)',
    '--btn-secondary-text': '#F0EAD6',
    '--scrollbar-thumb':  '#3a3a5e',
    '--section-label':    '#C9A84C',
    '--divider':          'rgba(255,255,255,0.07)',
    '--input-placeholder': '#6A5F52',
    '--skeleton-bg':      'rgba(255,255,255,0.06)',
  },
  light: {
    '--bg-primary':       '#F0F0F5',
    '--bg-secondary':     '#E4E4EC',
    '--bg-card':          '#FFFFFF',
    '--bg-navbar':        'rgba(248,248,252,0.97)',
    '--bg-input':         'rgba(0,0,0,0.05)',
    '--bg-section':       '#F0F0F5',
    '--text-primary':     '#0E0E18',
    '--text-secondary':   '#3C3C50',
    '--text-muted':       '#80808A',
    '--border':           'rgba(0,0,0,0.08)',
    '--border-gold':      'rgba(140,95,10,0.25)',
    '--gold':             '#8C5F0A',
    '--gold-light':       '#B8860B',
    '--card-bg':          '#FFFFFF',
    '--card-border':      'rgba(0,0,0,0.07)',
    '--card-hover':       'rgba(0,0,0,0.03)',
    '--section-heading':  '#0E0E18',
    '--badge-bg':         'rgba(0,0,0,0.65)',
    '--badge-text':       '#FFFFFF',
    '--btn-secondary-bg': 'rgba(0,0,0,0.06)',
    '--btn-secondary-border': 'rgba(0,0,0,0.15)',
    '--btn-secondary-text': '#0E0E18',
    '--scrollbar-thumb':  '#C0C0CC',
    '--section-label':    '#8C5F0A',
    '--divider':          'rgba(0,0,0,0.07)',
    '--input-placeholder': '#9090A0',
    '--skeleton-bg':      'rgba(0,0,0,0.06)',
  },
};

const ThemeProvider = ({ children }) => {
  const { mode } = useSelector(s => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(THEMES[mode]).forEach(([k, v]) => root.style.setProperty(k, v));
    document.body.style.backgroundColor = THEMES[mode]['--bg-primary'];
    document.body.style.color = THEMES[mode]['--text-primary'];
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  return children;
};

export default ThemeProvider;
export { THEMES };