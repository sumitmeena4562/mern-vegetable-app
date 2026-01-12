import axios from 'axios';

// Environment variable se URL lega, nahi to localhost use karega
const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Token attach karne ke liye
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error handling ke liye
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar Token expire ho gaya (401), to user ko logout kar sakte hain
    if (error.response?.status === 401) {
      console.error("Session expired or unauthorized");
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;