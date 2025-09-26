import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../index.css";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
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
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim()
    ) {
      alert("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone, // ⭐ include phone in request payload
        password: form.password,
      });

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-col">
      <div className="auth-card">
        <h2 className="h-title">Register</h2>
        <p className="h-sub">Create your DigitalWallet account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              className="input"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

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

          {/* ⭐ New phone number field */}
          <div className="form-row">
            <input
              className="input"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
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
              minLength={6}
            />
          </div>

          <button className="primary-action" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="sub-link">
          Already have an account?{" "}
          <span
            className="link-accent"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
