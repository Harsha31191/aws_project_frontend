import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);

      // 🔹 save token for authenticated requests
      localStorage.setItem("token", res.data.token);

      // 🔹 go to dashboard
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-col">
      <div className="auth-card">
        <h2 className="h-title">Sign In</h2>
        <p className="h-sub">Access your digital wallet securely</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="primary-action" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="sub-link">
          Don’t have an account?{" "}
          <span
            className="link-accent"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
