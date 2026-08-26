export const ROLE_PERMISSIONS = {
  Admin: ['all'],
  Manager: ['dashboard', 'users', 'roles', 'inventory', 'purchases', 'transfers', 'assignments', 'audit'],
  'Inventory Manager': ['dashboard', 'inventory', 'categories', 'purchases', 'transfers'],
  Employee: ['dashboard', 'assignments', 'profile'],
  Auditor: ['dashboard', 'inventory', 'purchases', 'transfers', 'assignments', 'audit'],
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Manager', 'Inventory Manager', 'Employee', 'Auditor'] },
  { label: 'Users', path: '/users', roles: ['Admin', 'Manager'] },
  { label: 'Roles', path: '/roles', roles: ['Admin', 'Manager'] },
  { label: 'Categories', path: '/categories', roles: ['Admin', 'Manager', 'Inventory Manager'] },
  { label: 'Inventory', path: '/items', roles: ['Admin', 'Manager', 'Inventory Manager', 'Auditor'] },
  { label: 'Purchases', path: '/purchases', roles: ['Admin', 'Manager', 'Inventory Manager', 'Auditor'] },
  { label: 'Transfers', path: '/transfers', roles: ['Admin', 'Manager', 'Inventory Manager', 'Auditor'] },
  { label: 'Assignments', path: '/assignments', roles: ['Admin', 'Manager', 'Employee', 'Auditor'] },
  { label: 'Audit Logs', path: '/audit-logs', roles: ['Admin', 'Manager', 'Auditor'] },
  { label: 'Profile', path: '/profile', roles: ['Admin', 'Manager', 'Inventory Manager', 'Employee', 'Auditor'] },
  { label: 'Settings', path: '/settings', roles: ['Admin'] },
];

export const canAccess = (role, path) => {
  const item = NAV_ITEMS.find((entry) => entry.path === path);
  if (!item) return true;
  return item.roles.includes(role);
};

export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('all');
};
