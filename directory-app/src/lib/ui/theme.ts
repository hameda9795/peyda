export const theme = {
  colors: {
    primary: {
      light: '#f8fafc',
      DEFAULT: '#0f172a', /* Deep slate/navy for primary text/buttons */
      dark: '#1e293b',
    },
    secondary: {
      DEFAULT: '#3b82f6', /* Blue accent */
      light: '#dbeafe',
      dark: '#1d4ed8',
    },
    accent: {
      DEFAULT: '#8b5cf6', /* Violet accent */
      light: '#ede9fe',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  typography: {
    fontFamily: {
      heading: 'var(--font-outfit), var(--font-inter), sans-serif',
      body: 'var(--font-inter), sans-serif',
    },
    fontSize: {
      h1: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      h2: ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      h3: ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      p: ['1rem', { lineHeight: '1.6' }],
      small: ['0.875rem', { lineHeight: '1.5' }],
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    premium: '0 30px 60px -12px rgba(15, 23, 42, 0.1), 0 18px 36px -18px rgba(15, 23, 42, 0.05)',
    glow: '0 0 40px -10px rgba(59, 130, 246, 0.4)',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  animations: {
    'subtle-hover': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
};
