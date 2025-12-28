import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3001/api",
//   withCredentials: true,
//   timeout: 10000,
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

//token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
