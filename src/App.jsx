// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import SendMoney from "./pages/SendMoney";
import QRPay from "./pages/QRPay";
import Bills from "./pages/Bills";
import Transactions from "./pages/Transactions";
import "./index.css";

function App() {
  return (
    <div className="app-shell">
      <Router>
        <Navbar />
        {/* container provides layout spacing; use .card-like when you want the white card background */}
        <div className="container page">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/qr" element={<QRPay />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
