import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Shared CSS

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage("❌ Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful! Redirecting...");
      setFormData({ email: "", password: "" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {message && <p className={message.includes("✅") ? "auth-message" : "auth-error"}>{message}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      <p className="auth-footer">
        Don’t have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/register")}>Register here</span>
      </p>
    </div>
  );
}

export default Login;
