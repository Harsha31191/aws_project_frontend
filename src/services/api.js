// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082/api/v1",  // backend base URL
  timeout: 10000, // 10s request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token on each request (existing code preserved)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // auto-logout on unauthorized
      localStorage.removeItem("token");
      window.location.href = "/"; // back to login
    }
    return Promise.reject(error);
  }
);

export default api;
