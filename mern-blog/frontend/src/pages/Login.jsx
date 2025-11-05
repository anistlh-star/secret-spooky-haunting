//workspaces/codespaces-blank/mern-blog/frontend/src/pages/Login.jsx
import { useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      console.log("user logged in !", response.data);
      alert("User logged in!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Oops! Couldn't login");
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
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;