import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#14B8A6',
      light: '#5EEAD4',
      dark: '#0F766E',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#3B82F6',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.06)',
    '0px 4px 12px rgba(15, 23, 42, 0.08)',
    '0px 8px 20px rgba(15, 23, 42, 0.10)',
    '0px 12px 24px rgba(15, 23, 42, 0.12)',
    '0px 16px 32px rgba(15, 23, 42, 0.12)',
    '0px 20px 40px rgba(15, 23, 42, 0.14)',
    '0px 24px 48px rgba(15, 23, 42, 0.14)',
    '0px 26px 52px rgba(15, 23, 42, 0.16)',
    '0px 28px 56px rgba(15, 23, 42, 0.16)',
    '0px 30px 60px rgba(15, 23, 42, 0.18)',
    '0px 32px 64px rgba(15, 23, 42, 0.18)',
    '0px 34px 68px rgba(15, 23, 42, 0.18)',
    '0px 36px 72px rgba(15, 23, 42, 0.18)',
    '0px 38px 76px rgba(15, 23, 42, 0.18)',
    '0px 40px 80px rgba(15, 23, 42, 0.18)',
    '0px 42px 84px rgba(15, 23, 42, 0.18)',
    '0px 44px 88px rgba(15, 23, 42, 0.18)',
    '0px 46px 92px rgba(15, 23, 42, 0.18)',
    '0px 48px 96px rgba(15, 23, 42, 0.20)',
    '0px 50px 100px rgba(15, 23, 42, 0.20)',
    '0px 52px 104px rgba(15, 23, 42, 0.20)',
    '0px 54px 108px rgba(15, 23, 42, 0.20)',
    '0px 56px 112px rgba(15, 23, 42, 0.20)',
  ],
  typography: {
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.04em' },
    h2: { fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.08)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, paddingTop: 10, paddingBottom: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0px 6px 18px rgba(15, 23, 42, 0.06)' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: '#334155', backgroundColor: '#F8FAFC' },
      },
    },
  },
});

export default theme;
