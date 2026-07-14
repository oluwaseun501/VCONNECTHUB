import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const adminApi = axios.create({ baseURL: API_BASE });

// Attach admin token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────
export const loginAdmin = (email, password) =>
  adminApi.post('/api/users/login', { email, password });

// ── Admin: Stats ──────────────────────────────────────────────────
export const getAdminStats = () =>
  adminApi.get('/api/admin/stats');

// ── Admin: Users ──────────────────────────────────────────────────
export const getAdminUsers = (params) =>
  adminApi.get('/api/admin/users', { params });

export const getAdminUser = (id) =>
  adminApi.get(`/api/admin/users/${id}`);

export const updateAdminUser = (id, data) =>
  adminApi.put(`/api/admin/users/${id}`, data);

export const deleteAdminUser = (id) =>
  adminApi.delete(`/api/admin/users/${id}`);

export const fundUserWallet = (id, amount) =>
  adminApi.post(`/api/admin/users/${id}/fund`, { amount });

export const debitUserWallet = (id, amount) =>
  adminApi.post(`/api/admin/users/${id}/debit`, { amount });

// ── Admin: Transactions ───────────────────────────────────────────
export const getAdminTransactions = (params) =>
  adminApi.get('/api/admin/transactions', { params });

// ── Admin: Orders ─────────────────────────────────────────────────
export const getAdminOrders = (params) =>
  adminApi.get('/api/admin/orders', { params });

// ── Profile / Password ────────────────────────────────────────────
export const updatePassword = (currentPassword, newPassword) =>
  adminApi.put('/api/users/password', { currentPassword, newPassword });

// Trigger a password reset email for a user (no admin-specific endpoint)
export const sendPasswordReset = (email) =>
  adminApi.post('/api/users/forgot-password', { email });

export const getAdminSettings = () =>
  adminApi.get('/api/admin/settings');

export const updateAdminSettings = (data) =>
  adminApi.put('/api/admin/settings', data);

export const getMaintenanceStatus = () =>
  adminApi.get('/api/admin/public/maintenance');

// ── Admin: Providers ──────────────────────────────────────────────
export const getProviders = () =>
  adminApi.get('/api/admin/providers');

export const addProvider = (data) =>
  adminApi.post('/api/admin/providers', data);

export const updateProvider = (id, data) =>
  adminApi.put(`/api/admin/providers/${id}`, data);

export const activateProvider = (id) =>
  adminApi.patch(`/api/admin/providers/${id}/activate`);

export const deleteProvider = (id) =>
  adminApi.delete(`/api/admin/providers/${id}`);

export const getPriceOverrides   = ()       => adminApi.get('/api/admin/price-overrides');
export const upsertPriceOverride = (data)   => adminApi.post('/api/admin/price-overrides', data);
export const deletePriceOverride = (id)     => adminApi.delete(`/api/admin/price-overrides/${id}`);

// SMM Providers
export const getSMMProviders = () => axios.get("/api/admin/smm-providers");
export const addSMMProvider = (data) => axios.post("/api/admin/smm-providers", data);
export const updateSMMProvider = (id, data) => axios.put(`/api/admin/smm-providers/${id}`, data);
export const activateSMMProvider = (id) => axios.patch(`/api/admin/smm-providers/${id}/activate`);
export const deleteSMMProvider = (id) => axios.delete(`/api/admin/smm-providers/${id}`);

// SMM Services
export const syncSMMServices = () => axios.post("/api/admin/smm-providers/services/sync");
export const getSMMServices = () => axios.get("/api/admin/smm-providers/services");
export const updateSMMService = (id, data) => axios.patch(`/api/admin/smm-providers/services/${id}`, data);

// Boost Orders
export const getAdminBoostOrders = () => axios.get("/api/admin/boost-orders");
export const getAllBoostOrders = (params) =>
  api.get("/admin/boost-orders", { params });


export default adminApi;
