// frontend/src/api.js
import axios from "axios";

// Use environment variable with fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://secret-spooky-haunting-2.onrender.com/api";
const API = axios.create({
  baseURL: API_BASE_URL,
});

// It will send every token on every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
