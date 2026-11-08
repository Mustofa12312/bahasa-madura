import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if authenticated with Supabase
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Error Formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    let errorMessage = 'Terjadi kesalahan pada jaringan atau server.';

    if (error.response) {
      // Server responded with an error status
      errorMessage = error.response.data?.message || `HTTP Error ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'Tidak ada respon dari server. Periksa koneksi internet Anda.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);
