// src/api/axiosInstance.js
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Ini adalah "Interceptor"
// Kode ini akan berjalan SEBELUM setiap request dikirim
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil state token dari Zustand
    const token = useAuthStore.getState().token;
    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
