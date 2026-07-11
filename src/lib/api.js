import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const TOKEN_KEY = 'vn_token';
export const USER_KEY  = 'vn_user';

const axiosApi = axios.create({ baseURL: API_BASE });

// Attach auth token to every request automatically
axiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response?.data?.message || err.message || 'An error occurred';
      throw new Error(message);
    });
}

export const api = {
  get:    (endpoint)       => unwrap(axiosApi.get(endpoint)),
  post:   (endpoint, body) => unwrap(axiosApi.post(endpoint, body)),
  put:    (endpoint, body) => unwrap(axiosApi.put(endpoint, body)),
  patch:  (endpoint, body) => unwrap(axiosApi.patch(endpoint, body)),
  delete: (endpoint)       => unwrap(axiosApi.delete(endpoint)),
};

export const getMaintenanceStatus = () =>
  unwrap(axiosApi.get('/api/admin/public/maintenance'));