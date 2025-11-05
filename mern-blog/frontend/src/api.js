//workspaces/codespaces-blank/mern-blog/frontend/src/api.js
import axios from "axios";

 const API = axios.create({
  baseURL: "https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5000.app.github.dev/api",
});
// it will send every token on every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
export default API;