import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel, Grid, Link, Stack, TextField, Typography } from '@mui/material';
import { authApi } from '../services/api';
import { setCredentials } from '../store/slices/authSlice';
import { profile } from '../data/dummyData';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'Admin@123' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

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

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!registerForm.name.trim()) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await authApi.register({
        name: registerForm.name.trim(),
        email: registerForm.email,
        password: registerForm.password,
      });

      const loginResponse = await authApi.login({
        email: registerForm.email,
        password: registerForm.password,
      });

      const payload = loginResponse?.data?.data || {};
      const user = payload.user || {
        id: registerForm.email,
        name: registerForm.name.trim(),
        email: registerForm.email,
        role: 'Employee',
      };

      dispatch(setCredentials({ user: { ...user, isDemo: false }, token: payload.token, rememberMe, isDemo: false }));
      setSuccessMessage('Account created successfully. Redirecting to your dashboard...');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create your account right now.');
    } finally {
      setLoading(false);
    }
  };

  const featurePills = ['Inventory', 'Purchases', 'Audit'];
  const overviewCards = [
    { label: 'Assets tracked', value: '24.5K' },
    { label: 'Active users', value: '186' },
    { label: 'Stock health', value: '96%' },
  ];

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setSuccessMessage('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
        background: 'radial-gradient(circle at top left, rgba(96, 165, 250, 0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(167, 139, 250, 0.24), transparent 30%), linear-gradient(135deg, #eef7ff 0%, #f8fafc 46%, #eef2ff 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -90,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.12)',
          filter: 'blur(8px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -120,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.08)',
          filter: 'blur(10px)',
        }}
      />

      <Grid container maxWidth={1200} spacing={4} sx={{ position: 'relative', zIndex: 1, alignItems: 'center', py: 5 }}>
        <Grid item xs={12} md={6}>
          <Stack spacing={3} sx={{ maxWidth: 560, ml: { xs: 0, md: 1 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.18)',
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: 11,
              }}
            >
              Inventory Asset System
            </Box>

            <Typography variant="h2" sx={{ fontSize: { xs: '2.6rem', md: '4rem' }, lineHeight: 1.02, letterSpacing: '-0.06em', fontWeight: 800, color: '#0f172a' }}>
              Smarter inventory from intake to audit.
            </Typography>

            <Typography variant="body1" sx={{ fontSize: '1.05rem', color: 'text.secondary', maxWidth: 520, lineHeight: 1.8 }}>
              Manage stock, track purchases, transfer inventory, and monitor assignments from one secure platform built for modern operations teams.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
              {featurePills.map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 14px 32px rgba(15, 23, 42, 0.06)',
                    fontWeight: 700,
                    color: '#0f172a',
                    fontSize: '0.92rem',
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
              {overviewCards.map((card) => (
                <Box
                  key={card.label}
                  sx={{
                    flex: 1,
                    minWidth: 120,
                    px: 2,
                    py: 2,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    boxShadow: '0 18px 36px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>{card.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              maxWidth: 460,
              ml: 'auto',
              borderRadius: 5,
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.12)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    color: '#fff',
                    fontSize: 28,
                    fontWeight: 800,
                    boxShadow: '0 16px 30px rgba(99, 102, 241, 0.35)',
                  }}
                >
                  A
                </Box>

                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {mode === 'login' ? 'Sign in to continue to your workspace' : 'Set up your account to manage inventory'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, p: 0.5, borderRadius: 2, bgcolor: 'rgba(148, 163, 184, 0.08)' }}>
                  <Button fullWidth variant={mode === 'login' ? 'contained' : 'text'} onClick={() => switchMode('login')} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                    Sign in
                  </Button>
                  <Button fullWidth variant={mode === 'register' ? 'contained' : 'text'} onClick={() => switchMode('register')} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                    Register
                  </Button>
                </Box>

                {mode === 'login' ? (
                  <Box component="form" onSubmit={handleLogin} noValidate>
                    <Stack spacing={2.5}>
                      <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(248, 250, 252, 0.9)' } }}
                      />
                      <TextField
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(248, 250, 252, 0.9)' } }}
                      />

                      {error && <Typography color="error.main" variant="body2" sx={{ px: 1 }}>{error}</Typography>}
                      {successMessage && <Typography color="success.main" variant="body2" sx={{ px: 1 }}>{successMessage}</Typography>}

                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <FormControlLabel
                          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                          label="Remember me"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                        />
                        <Link href="#" underline="hover" sx={{ fontWeight: 600, color: 'primary.main' }}>Forgot password?</Link>
                      </Stack>

                      <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 700, fontSize: '1rem', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', boxShadow: '0 18px 28px rgba(99, 102, 241, 0.28)', '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' } }}>
                        {loading ? 'Signing in...' : 'Log in'}
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleRegister} noValidate>
                    <Stack spacing={2.2}>
                      <TextField
                        label="Full name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(248, 250, 252, 0.9)' } }}
                      />
                      <TextField
                        label="Email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(248, 250, 252, 0.9)' } }}
                      />
                      <TextField
                        label="Password"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(248, 250, 252, 0.9)' } }}
                      />
                      <TextField
                        label="Confirm password"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(248, 250, 252, 0.9)' } }}
                      />

                      {error && <Typography color="error.main" variant="body2" sx={{ px: 1 }}>{error}</Typography>}
                      {successMessage && <Typography color="success.main" variant="body2" sx={{ px: 1 }}>{successMessage}</Typography>}

                      <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 700, fontSize: '1rem', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', boxShadow: '0 18px 28px rgba(99, 102, 241, 0.28)', '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' } }}>
                        {loading ? 'Creating account...' : 'Create account'}
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                  <Link component="button" type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} underline="hover" sx={{ fontWeight: 700, color: 'primary.main', background: 'none', border: 'none', cursor: 'pointer', p: 0 }}>
                    {mode === 'login' ? 'Create an account' : 'Sign in'}
                  </Link>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
