import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('auth_token');
    const isDemoToken = token === 'demo-jwt-token';

    if (error.response?.status === 401 && !isDemoToken) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('remember_me');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getUsers: () => api.get('/users'),
  createUser: (payload) => api.post('/users', payload),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const inventoryApi = {
  getItems: (params = {}) => api.get('/items', { params }),
  createItem: (payload) => api.post('/items', payload),
  updateItem: (id, payload) => api.put(`/items/${id}`, payload),
  deleteItem: (id) => api.delete(`/items/${id}`),
};

export const purchaseApi = {
  getPurchases: () => api.get('/purchases'),
  createPurchase: (payload) => api.post('/purchases', payload),
};

export const transferApi = {
  getTransfers: () => api.get('/transfers'),
  createTransfer: (payload) => api.post('/transfers', payload),
  updateTransfer: (id, payload) => api.put(`/transfers/${id}/status`, payload),
};

export const assignmentApi = {
  getAssignments: () => api.get('/assignments'),
  createAssignment: (payload) => api.post('/assignments', payload),
  updateAssignment: (id, payload) => api.put(`/assignments/${id}/return`, payload),
};

export const auditApi = {
  getAuditLogs: () => api.get('/audit-logs'),
};

export default api;
