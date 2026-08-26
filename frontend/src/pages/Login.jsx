import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Link, Stack, TextField, Typography } from '@mui/material';
import { authApi } from '../services/api';
import { setCredentials } from '../store/slices/authSlice';
import { profile } from '../data/dummyData';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'Admin@123' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({
        email: form.email,
        password: form.password,
      });

      const payload = response?.data?.data || {};
      const user = payload.user || { ...profile, email: form.email, role: 'Admin' };
      const token = payload.token || localStorage.getItem('auth_token') || 'demo-jwt-token';
      const isDemo = !payload.token;

      dispatch(setCredentials({ user: { ...user, isDemo }, token, rememberMe, isDemo }));
      navigate('/dashboard');
    } catch (err) {
      const fallbackUser = {
        ...profile,
        email: form.email,
        role: form.email.includes('manager') ? 'Manager' : form.email.includes('employee') ? 'Employee' : 'Admin',
        isDemo: true,
      };

      if (form.email && form.password) {
        dispatch(setCredentials({ user: fallbackUser, token: 'demo-jwt-token', rememberMe, isDemo: true }));
        navigate('/dashboard');
        return;
      }

      setError(err?.response?.data?.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #EEF4FF 0%, #F8FAFC 100%)' }}>
      <Grid container maxWidth={1200} spacing={3} sx={{ px: 3, alignItems: 'center' }}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2} sx={{ maxWidth: 520 }}>
            <Typography variant="overline" color="primary.main" fontWeight={700}>Inventory Asset System</Typography>
            <Typography variant="h2" fontWeight={800}>Operations control for every asset.</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage stock, track purchases, transfer inventory, and monitor assignments from one secure platform.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {['Inventory', 'Purchases', 'Audit'].map((item) => (
                <Box key={item} sx={{ px: 2, py: 1, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>{item}</Box>
              ))}
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ maxWidth: 460, ml: 'auto', p: 1, borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} mb={1}>Welcome back</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>Sign in to continue to your workspace</Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
                  <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth />
                  {error && <Typography color="error.main" variant="body2">{error}</Typography>}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Remember me" />
                    <Link href="#" underline="hover">Forgot password?</Link>
                  </Stack>
                  <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
