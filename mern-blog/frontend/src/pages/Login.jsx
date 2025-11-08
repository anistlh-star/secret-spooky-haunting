//workspaces/codespaces-blank/mern-blog/frontend/src/pages/Login.jsx
import { useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ← ADD THIS LINE
import "../styles/Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  
  // 🎯 ADD THIS LINE - Get login function from AuthContext
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      
      // Store user data separately
      if (response.data.user) {
        console.log("✅ Login response user data:", response.data.user);
        console.log("✅ isAdmin value:", response.data.user.isAdmin);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        
        // 🎯 ADD THIS LINE - Update AuthContext
        login(response.data.user, response.data.token);
      } else {
        console.log("❌ No user data in login response");
      }
      
      console.log("✅ Full login response:", response.data);
      alert("User logged in!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("❌ Oops! Couldn't login", error.response?.data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          name="email"
          placeholder="Enter email ..."
          type="email"
          onChange={handleChange}
          value={form.email}
        />
        <input
          className="login-input"
          name="password"
          placeholder="Enter password ..."
          type="password"
          onChange={handleChange}
          value={form.password}
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;