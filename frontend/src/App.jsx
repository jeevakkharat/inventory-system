import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/layout/MainLayout';
import { authApi } from './services/api';
import { logout, setUser } from './store/slices/authSlice';
import { canAccess } from './utils/rbac';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';
import RolesPage from './pages/Roles';
import CategoriesPage from './pages/Categories';
import InventoryPage from './pages/Inventory';
import PurchasesPage from './pages/Purchases';
import TransfersPage from './pages/Transfers';
import AssignmentsPage from './pages/Assignments';
import AuditLogsPage from './pages/AuditLogs';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563EB' },
    secondary: { main: '#14B8A6' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 12 },
});

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RootRedirect() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isDemo = useSelector((state) => state.auth.isDemo);

  useEffect(() => {
    if (!token || isDemo) return;

    authApi
      .me()
      .then((response) => {
        const payload = response?.data?.data || response?.data || null;
        if (payload) dispatch(setUser(payload));
      })
      .catch(() => {
        dispatch(logout());
        navigate('/login');
      });
  }, [dispatch, navigate, token, isDemo]);

  const role = user?.role || 'Employee';
  const path = location.pathname;
  const isAllowed = path === '/dashboard' || path === '/' || canAccess(role, path);

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="items" element={<InventoryPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="transfers" element={<TransfersPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </ThemeProvider>
  );
}
