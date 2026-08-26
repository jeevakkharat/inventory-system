import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Boxes,
  ShoppingCart,
  ArrowLeftRight,
  ClipboardCheck,
  UserCircle2,
  Settings,
  FolderTree,
  X,
} from 'lucide-react';
import { NAV_ITEMS } from '../../utils/rbac';

const icons = {
  '/dashboard': LayoutDashboard,
  '/users': Users,
  '/roles': ShieldCheck,
  '/categories': FolderTree,
  '/items': Boxes,
  '/purchases': ShoppingCart,
  '/transfers': ArrowLeftRight,
  '/assignments': ClipboardCheck,
  '/audit-logs': ClipboardCheck,
  '/profile': UserCircle2,
  '/settings': Settings,
};

export default function Sidebar({ user, collapsed, onToggle, mobileOpen, onClose }) {
  const location = useLocation();
  const visibleItems = useMemo(() => {
    const role = user?.role || 'Employee';
    return NAV_ITEMS.filter((item) => item.roles.includes(role));
  }, [user]);

  const drawerContent = (
    <Box
      sx={{
        width: collapsed ? 88 : 260,
        transition: 'width 0.25s ease',
        p: 2,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1, py: 0.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: 2, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #2563EB, #14B8A6)', color: 'white', fontWeight: 800 }}>IA</Box>
        {!collapsed && (
          <Typography variant="subtitle2" color="text.secondary" letterSpacing={1.4} fontWeight={700}>ASSETFLOW</Typography>
        )}
        <IconButton size="small" onClick={onClose} sx={{ display: { xs: 'inline-flex', lg: 'none' } }}>
          <X size={16} />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 1.5 }} />
      <List sx={{ mt: 1, flexGrow: 1 }}>
        {visibleItems.map((item) => {
          const Icon = icons[item.path] || LayoutDashboard;
          const selected = location.pathname === item.path || (item.path === '/dashboard' && location.pathname.startsWith('/dashboard'));
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={selected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                minHeight: 48,
                px: 1.25,
                transition: 'all 0.2s ease',
                background: selected ? 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(20,184,166,0.10))' : 'transparent',
                border: selected ? '1px solid rgba(37,99,235,0.14)' : '1px solid transparent',
                '&:hover': { transform: 'translateX(2px)', background: selected ? 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(20,184,166,0.12))' : 'rgba(148,163,184,0.06)' },
              }}
              onClick={onClose}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={18} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: selected ? 700 : 500 }} />}
            </ListItemButton>
          );
        })}
      </List>

      {!collapsed && (
        <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(20,184,166,0.08))', border: '1px solid rgba(148,163,184,0.14)' }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>Current role</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>{user?.role || 'Employee'}</Typography>
            <Chip label="Live" size="small" color="success" />
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(148, 163, 184, 0.18)',
          backgroundColor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          width: collapsed ? 88 : 260,
          transition: 'width 0.25s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
