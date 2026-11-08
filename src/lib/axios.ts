import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada jaringan';
    return Promise.reject(new Error(message));
  }
);
