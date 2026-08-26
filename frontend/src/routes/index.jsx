import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import UsersPage from '../pages/Users';
import RolesPage from '../pages/Roles';
import CategoriesPage from '../pages/Categories';
import InventoryPage from '../pages/Inventory';
import PurchasesPage from '../pages/Purchases';
import TransfersPage from '../pages/Transfers';
import AssignmentsPage from '../pages/Assignments';
import AuditLogsPage from '../pages/AuditLogs';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'items', element: <InventoryPage /> },
      { path: 'purchases', element: <PurchasesPage /> },
      { path: 'transfers', element: <TransfersPage /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
