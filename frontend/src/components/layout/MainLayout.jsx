import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ user, onLogout, children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#2563EB' },
      secondary: { main: '#14B8A6' },
      warning: { main: '#F59E0B' },
      success: { main: '#10B981' },
      background: {
        default: darkMode ? '#020817' : '#F8FAFC',
        paper: darkMode ? '#0F172A' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#E2E8F0' : '#0F172A',
        secondary: darkMode ? '#94A3B8' : '#475569',
      },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiAppBar: { defaultProps: { elevation: 0 } },
      MuiDrawer: { styleOverrides: { paper: { border: 'none' } } },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: darkMode ? 'background.default' : '#f4f7fb',
          backgroundImage: darkMode
            ? 'radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(20,184,166,0.14), transparent 25%)'
            : 'radial-gradient(circle at top left, rgba(37,99,235,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(20,184,166,0.08), transparent 25%)',
        }}
      >
        <Sidebar user={user} collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Topbar
            user={user}
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
            onMobileToggle={() => setMobileOpen((prev) => !prev)}
            darkMode={darkMode}
            onThemeToggle={() => setDarkMode((prev) => !prev)}
            onLogout={onLogout}
          />
          <Box
            component="main"
            sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              background: darkMode ? '#020817' : 'transparent',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
