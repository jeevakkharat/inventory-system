import { AppBar, Avatar, Badge, Box, Button, IconButton, Menu as MuiMenu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { Bell, ChevronDown, Menu as MenuIcon, Moon, Search, Sparkles, SunMedium } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Topbar({ user, collapsed, onToggle, onMobileToggle, darkMode, onThemeToggle, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [operationsAnchor, setOperationsAnchor] = useState(null);
  const open = Boolean(anchorEl);
  const operationsOpen = Boolean(operationsAnchor);
  const currentSearch = new URLSearchParams(location.search).get('q') || '';

  const handleSearch = (event) => {
    const value = event.target.value;
    const params = new URLSearchParams(location.search);

    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(148,163,184,0.2)',
        backdropFilter: 'blur(14px)',
        background: darkMode
          ? 'linear-gradient(180deg, rgba(2,8,23,0.82), rgba(15,23,42,0.72))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(248,250,252,0.72))',
        boxShadow: '0 8px 18px rgba(15,23,42,0.04)',
      }}
    >
      <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
          <IconButton
            onClick={() => onMobileToggle?.()}
            sx={{
              border: '1px solid rgba(148,163,184,0.28)',
              background: darkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.7)',
              color: darkMode ? '#e2e8f0' : '#0f172a',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 22px rgba(37,99,235,0.12)' },
            }}
          >
            <MenuIcon size={18} />
          </IconButton>

          <Box
            component="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.9,
              borderRadius: 2.5,
              border: '1px solid rgba(148,163,184,0.22)',
              background: darkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.72)',
              minWidth: { xs: 180, md: 340 },
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: 'rgba(37,99,235,0.35)', boxShadow: '0 8px 18px rgba(37,99,235,0.08)' },
            }}
          >
            <Search size={16} color="#64748B" />
            <input
              value={currentSearch}
              onChange={handleSearch}
              placeholder="Search assets, users..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                color: darkMode ? '#e2e8f0' : '#0f172a',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.3}>
          <Button
            onClick={(event) => setOperationsAnchor(event.currentTarget)}
            endIcon={<ChevronDown size={16} />}
            startIcon={<Sparkles size={16} />}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderRadius: 999,
              px: 1.5,
              py: 0.85,
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(20,184,166,0.10))',
              color: 'primary.main',
              border: '1px solid rgba(37,99,235,0.14)',
              boxShadow: '0 10px 22px rgba(37,99,235,0.10)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(20,184,166,0.14))',
                boxShadow: '0 12px 26px rgba(37,99,235,0.14)',
              },
            }}
          >
            Operations
          </Button>

          <IconButton
            onClick={onThemeToggle}
            sx={{
              border: '1px solid rgba(148,163,184,0.22)',
              background: darkMode ? 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.75))' : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.8))',
              color: darkMode ? '#f8fafc' : '#0f172a',
              boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 12px 24px rgba(37,99,235,0.12)' },
            }}
          >
            {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
          </IconButton>

          <IconButton
            sx={{
              border: '1px solid rgba(148,163,184,0.22)',
              background: darkMode ? 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.75))' : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.8))',
              color: darkMode ? '#f8fafc' : '#0f172a',
              boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 12px 24px rgba(37,99,235,0.12)' },
            }}
          >
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 } }}>
              <Bell size={18} />
            </Badge>
          </IconButton>

          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1,
              py: 0.55,
              borderRadius: 2.5,
              cursor: 'pointer',
              background: darkMode ? 'rgba(15,23,42,0.78)' : 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(148,163,184,0.18)',
              transition: 'all 0.2s ease',
              '&:hover': { boxShadow: '0 12px 26px rgba(15,23,42,0.08)', transform: 'translateY(-1px)' },
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                color: 'white',
                fontWeight: 800,
                boxShadow: '0 10px 18px rgba(37,99,235,0.22)',
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" fontWeight={700}>{user?.name || 'Admin'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role || 'Admin'}</Typography>
            </Box>
            <ChevronDown size={16} color="#64748B" style={{ marginRight: 4 }} />
          </Box>
        </Stack>

        <MuiMenu anchorEl={operationsAnchor} open={operationsOpen} onClose={() => setOperationsAnchor(null)}>
          <MenuItem onClick={() => { setOperationsAnchor(null); navigate('/dashboard'); }}>Dashboard</MenuItem>
          <MenuItem onClick={() => { setOperationsAnchor(null); navigate('/items'); }}>Inventory</MenuItem>
          <MenuItem onClick={() => { setOperationsAnchor(null); navigate('/purchases'); }}>Purchases</MenuItem>
          <MenuItem onClick={() => { setOperationsAnchor(null); navigate('/transfers'); }}>Transfers</MenuItem>
          <MenuItem onClick={() => { setOperationsAnchor(null); navigate('/assignments'); }}>Assignments</MenuItem>
        </MuiMenu>

        <MuiMenu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>Settings</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); onLogout(); }}>Logout</MenuItem>
        </MuiMenu>
      </Toolbar>
    </AppBar>
  );
}
