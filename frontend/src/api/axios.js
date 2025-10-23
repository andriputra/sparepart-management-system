import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor untuk otomatis kirim token (kalau sudah login)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;