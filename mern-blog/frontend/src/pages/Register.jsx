///workspaces/codespaces-blank/mern-blog/frontend/src/pages/Register.jsx
import { useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/register", form);
      console.log("✅ User registered!", response.data);
      alert("User Registered!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.log("❌ Oops! Couldn't register");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>
        <input
          className="register-input"
          name="name"
          placeholder="Enter name ..."
          type="text"
          onChange={handleChange}
          value={form.name}
        />
        <input
          className="register-input"
          name="email"
          placeholder="Enter email ..."
          type="email"
          onChange={handleChange}
          value={form.email}
        />
        <input
          className="register-input"
          name="password"
          placeholder="Enter password ..."
          type="password"
          onChange={handleChange}
          value={form.password}
        />
        <button className="register-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;