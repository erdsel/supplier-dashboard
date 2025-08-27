import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('vendor');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  loginByName: async (name: string) => {
    const response = await api.post('/auth/login-by-name', { name });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const analyticsService = {
  getMonthlySales: async (vendorId?: string) => {
    const url = vendorId ? `/analytics/monthly-sales/${vendorId}` : '/analytics/monthly-sales';
    const response = await api.get(url);
    return response.data;
  },
  
  getProductSales: async (vendorId?: string) => {
    const url = vendorId ? `/analytics/product-sales/${vendorId}` : '/analytics/product-sales';
    const response = await api.get(url);
    return response.data;
  },
  
  getVendorStats: async (vendorId?: string) => {
    const url = vendorId ? `/analytics/vendor-stats/${vendorId}` : '/analytics/vendor-stats';
    const response = await api.get(url);
    return response.data;
  },
};

export default api;