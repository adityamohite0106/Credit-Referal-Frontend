import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
// Fix 1: Use only base URL (no /api here)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

// Fix 2: Better token handling
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.warn('Failed to parse auth storage');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      dashboard: null,

      // Fix 3: Add /api/ to all routes
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/api/auth/login', { email, password });
          set({ user: data, token: data.token, loading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
          const msg = error.response?.data?.message || 'Login failed';
          set({ error: msg, loading: false });
          throw error;
        }
      },

      register: async (email, password, refCode) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/api/auth/register', { email, password, refCode });
          set({ user: data, token: data.token, loading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
          const msg = error.response?.data?.message || 'Registration failed';
          set({ error: msg, loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, dashboard: null });
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('auth-storage');
      },

      fetchDashboard: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.get('/api/user/dashboard');
          set({ dashboard: data, loading: false });
        } catch (error) {
          const msg = error.response?.data?.message || 'Failed to fetch dashboard';
          set({ error: msg, loading: false });
          if (error.response?.status === 401) get().logout();
          throw error;
        }
      },

      makePurchase: async () => {
        set({ loading: true, error: null });
        try {
          await api.post('/api/user/purchase');
          await get().fetchDashboard();
          set({ loading: false });
        } catch (error) {
          const msg = error.response?.data?.message || 'Purchase failed';
          set({ error: msg, loading: false });
          throw error;
        }
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);