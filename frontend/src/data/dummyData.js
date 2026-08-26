export const roles = [
  { id: '1', name: 'Admin', description: 'Full system access' },
  { id: '2', name: 'Manager', description: 'Operational management access' },
  { id: '3', name: 'Inventory Manager', description: 'Inventory and stock operations' },
  { id: '4', name: 'Employee', description: 'Assigned asset access' },
  { id: '5', name: 'Auditor', description: 'Audit and compliance access' },
];

export const permissionMatrix = {
  Admin: ['Users', 'Roles', 'Inventory', 'Purchases', 'Transfers', 'Assignments', 'Audit Logs', 'Settings'],
  Manager: ['Inventory', 'Purchases', 'Transfers', 'Assignments', 'Audit Logs'],
  'Inventory Manager': ['Inventory', 'Purchases', 'Transfers'],
  Employee: ['Assignments', 'Profile'],
  Auditor: ['Inventory', 'Purchases', 'Transfers', 'Assignments', 'Audit Logs'],
};

export const users = [
  { id: 'u1', name: 'Ava Thompson', email: 'admin@example.com', role: 'Admin', status: 'Active', lastLogin: '2026-08-21T10:15:00Z' },
  { id: 'u2', name: 'Lucas Wong', email: 'manager@example.com', role: 'Manager', status: 'Active', lastLogin: '2026-08-25T08:25:00Z' },
  { id: 'u3', name: 'Priya Sharma', email: 'inventory@example.com', role: 'Inventory Manager', status: 'Active', lastLogin: '2026-08-24T09:12:00Z' },
  { id: 'u4', name: 'Daniel Kim', email: 'auditor@example.com', role: 'Auditor', status: 'Active', lastLogin: '2026-08-22T14:42:00Z' },
  { id: 'u5', name: 'Emma Clark', email: 'employee@example.com', role: 'Employee', status: 'Active', lastLogin: '2026-08-25T15:04:00Z' },
  { id: 'u6', name: 'Noah Lewis', email: 'ops@example.com', role: 'Employee', status: 'Inactive', lastLogin: '2026-08-10T11:08:00Z' },
];

export const categories = [
  { id: 'c1', name: 'Computers', description: 'Laptop and desktop hardware', status: 'Active' },
  { id: 'c2', name: 'Networking', description: 'Routers, switches, access points', status: 'Active' },
  { id: 'c3', name: 'Furniture', description: 'Office furniture inventory', status: 'Active' },
  { id: 'c4', name: 'Mobile Devices', description: 'Phones and tablets', status: 'Inactive' },
];

export const inventoryItems = [
  { id: 'i1', name: 'Dell Latitude 7440', sku: 'DL-7440', category: 'Computers', location: 'HQ - Floor 2', quantity: 24, status: 'In Stock', unitPrice: 1299, lowStock: 8 },
  { id: 'i2', name: 'Cisco Catalyst 9300', sku: 'CX-9300', category: 'Networking', location: 'Warehouse A', quantity: 6, status: 'Low Stock', unitPrice: 2900, lowStock: 4 },
  { id: 'i3', name: 'ErgoOffice Chair', sku: 'ER-CHAIR', category: 'Furniture', location: 'Office West', quantity: 18, status: 'In Stock', unitPrice: 420, lowStock: 6 },
  { id: 'i4', name: 'iPhone 15 Pro', sku: 'IP-15P', category: 'Mobile Devices', location: 'Central Store', quantity: 3, status: 'Low Stock', unitPrice: 999, lowStock: 5 },
  { id: 'i5', name: 'HP LaserJet Pro', sku: 'HP-LJ', category: 'Computers', location: 'Warehouse B', quantity: 10, status: 'In Stock', unitPrice: 745, lowStock: 4 },
];

export const purchases = [
  { id: 'p1', supplier: 'TechSource Inc.', date: '2026-08-15', item: 'Dell Latitude 7440', quantity: 12, price: 15588, status: 'Completed' },
  { id: 'p2', supplier: 'NetGenome', date: '2026-08-11', item: 'Cisco Catalyst 9300', quantity: 3, price: 8700, status: 'Pending' },
  { id: 'p3', supplier: 'OfficeNest', date: '2026-08-08', item: 'ErgoOffice Chair', quantity: 20, price: 8400, status: 'Completed' },
  { id: 'p4', supplier: 'MobileHub', date: '2026-08-04', item: 'iPhone 15 Pro', quantity: 8, price: 7992, status: 'Cancelled' },
];

export const transfers = [
  { id: 't1', item: 'Dell Latitude 7440', from: 'Warehouse A', to: 'HQ - Floor 2', qty: 10, status: 'Approved', date: '2026-08-23' },
  { id: 't2', item: 'Cisco Catalyst 9300', from: 'HQ - Floor 2', to: 'Warehouse A', qty: 2, status: 'Pending', date: '2026-08-24' },
  { id: 't3', item: 'ErgoOffice Chair', from: 'Office West', to: 'Warehouse B', qty: 4, status: 'Rejected', date: '2026-08-21' },
];

export const assignments = [
  { id: 'a1', asset: 'Dell Latitude 7440', assignee: 'Emma Clark', department: 'Operations', status: 'Assigned', date: '2026-08-01', returnDate: '2026-12-31' },
  { id: 'a2', asset: 'iPhone 15 Pro', assignee: 'Daniel Kim', department: 'Engineering', status: 'Returned', date: '2026-07-15', returnDate: '2026-08-13' },
  { id: 'a3', asset: 'HP LaserJet Pro', assignee: 'Lucas Wong', department: 'Management', status: 'Assigned', date: '2026-08-17', returnDate: '2026-11-30' },
];

export const auditLogs = [
  { id: 'log1', user: 'Ava Thompson', action: 'Created Item', oldValue: '—', newValue: 'Dell Latitude 7440', date: '2026-08-25T12:00:00Z', ipAddress: '192.168.10.22' },
  { id: 'log2', user: 'Priya Sharma', action: 'Updated Inventory', oldValue: '12', newValue: '24', date: '2026-08-24T09:20:00Z', ipAddress: '192.168.10.18' },
  { id: 'log3', user: 'Daniel Kim', action: 'Approved Transfer', oldValue: 'Pending', newValue: 'Approved', date: '2026-08-22T16:44:00Z', ipAddress: '192.168.10.31' },
];

export const recentActivities = [
  'New purchase order created for 12 Dell laptops',
  'Transfer approved from Headquarters to Warehouse A',
  'Asset assigned to Emma Clark',
  'Low stock warning triggered for Cisco Catalyst 9300',
];

export const dashboardStats = {
  totalUsers: 126,
  totalInventory: 1840,
  totalPurchases: 328,
  totalAssignments: 94,
  totalTransfers: 41,
};

export const monthlyPurchases = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      label: 'Purchases',
      data: [2100, 2400, 2800, 2300, 3300, 2900, 3400, 3800],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.18)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export const categorySpend = {
  labels: ['Computers', 'Networking', 'Furniture', 'Mobile'],
  datasets: [
    {
      label: 'Inventory by Category',
      data: [42, 19, 17, 12],
      backgroundColor: ['#2563EB', '#14B8A6', '#F59E0B', '#A78BFA'],
      borderWidth: 0,
    },
  ],
};

export const lowStockItems = inventoryItems.filter((item) => item.quantity <= item.lowStock);

export const profile = {
  name: 'Ava Thompson',
  email: 'admin@example.com',
  role: 'Admin',
  department: 'Operations',
  location: 'New York HQ',
  phone: '+1 (415) 555-0123',
};
