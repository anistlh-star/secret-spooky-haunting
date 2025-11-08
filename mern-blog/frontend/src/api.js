// frontend/src/api.js
import axios from "axios";


// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://secret-spooky-haunting-2.onrender.com/api";

// Use environment variable with fallback
const API_BASE_URL =
  "https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev/api" ||
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
