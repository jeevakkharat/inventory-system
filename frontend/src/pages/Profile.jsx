import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);

  const initials = (user?.name || 'User')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const detailItems = [
    { label: 'Email', value: user?.email || '—', icon: Mail },
    { label: 'Department', value: 'Operations', icon: BriefcaseBusiness },
    { label: 'Location', value: 'Main Warehouse', icon: MapPin },
    { label: 'Access Level', value: user?.role || 'Employee', icon: ShieldCheck },
  ];

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Personal and account details"
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Profile', path: '/profile' }]}
      />

      <Stack spacing={3}>
        <Card
          sx={{
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(20,184,166,0.18))',
            border: '1px solid rgba(148,163,184,0.16)',
          }}
        >
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 28,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
                  boxShadow: '0 14px 28px rgba(37, 99, 235, 0.25)',
                }}
              >
                {initials}
              </Avatar>

              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                  {user?.name || 'User'}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={<Sparkles size={14} />}
                    label={user?.role || 'Employee'}
                    size="small"
                    sx={{ bgcolor: 'rgba(37,99,235,0.12)', color: 'primary.main', fontWeight: 700 }}
                  />
                  <Chip
                    icon={<Building2 size={14} />}
                    label="Operations"
                    size="small"
                    sx={{ bgcolor: 'rgba(20,184,166,0.12)', color: 'success.main', fontWeight: 700 }}
                  />
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              sx={{
                borderRadius: 999,
                px: 2.75,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 12px 24px rgba(37,99,235,0.2)',
              }}
            >
              Edit profile
            </Button>
          </Box>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2.5, height: '100%', border: '1px solid rgba(148,163,184,0.18)' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Quick overview
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(37,99,235,0.05)' }}>
                  <Typography variant="caption" color="text.secondary">Assigned assets</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>24</Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(20,184,166,0.06)' }}>
                  <Typography variant="caption" color="text.secondary">Completed audits</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>13</Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(245,158,11,0.08)' }}>
                  <Typography variant="caption" color="text.secondary">Pending actions</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>03</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2.5, border: '1px solid rgba(148,163,184,0.18)' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Account details
              </Typography>

              <Stack spacing={2}>
                {detailItems.map(({ label, value, icon: Icon }) => (
                  <Box key={label}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 2,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'rgba(37, 99, 235, 0.08)',
                          color: 'primary.main',
                        }}
                      >
                        <Icon size={18} />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.2 }}>
                          {value}
                        </Typography>
                      </Box>
                    </Stack>
                    {label !== detailItems[detailItems.length - 1].label && <Divider sx={{ my: 1.5 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2.5, border: '1px solid rgba(148,163,184,0.18)' }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
            <UserRound size={18} color="#2563eb" />
            <Typography variant="h6" fontWeight={700}>Profile summary</Typography>
          </Stack>

          <Typography variant="body1" color="text.secondary">
            This account is configured for operational asset management with elevated visibility across the
            warehouse and assigned inventory workflow. Security access is active and the profile is aligned with
            current organizational permissions.
          </Typography>
        </Paper>
      </Stack>
    </>
  );
}
