import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/dashboard" className="brand">
        <div className="logo">DW</div>
        <div>DigitalWallet</div>
      </Link>

      <div className="nav-actions">
        {token ? (
          <>
            <button className="nav-btn btn-outline" onClick={() => navigate("/transactions")}>Transactions</button>
            <button className="nav-btn btn-primary" onClick={() => navigate("/send")}>Send Money</button>
            <button className="nav-btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-btn btn-outline" onClick={() => navigate("/register")}>Register</button>
            <button className="nav-btn btn-primary" onClick={() => navigate("/")}>Sign In</button>
          </>
        )}
      </div>
    </div>
  );
}
