import { useState } from "react";
import api from "../services/api";
import "../index.css";

function QRPay() {
  const [qrCode, setQrCode] = useState("");
  const [amount, setAmount] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/qr/pay",
        { code: qrCode, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Payment successful");
      setQrCode("");
      setAmount("");
    } catch {
      alert("Payment failed");
    }
  };

  return (
    <div className="center-col">
      <div
        className="auth-card"
        style={{ padding: "28px", width: "400px", textAlign: "center" }}
      >
        <h2 className="h-title">QR Payment</h2>
        <p className="h-sub">Scan or enter QR code to pay securely</p>

        <form onSubmit={handlePay} style={{ marginTop: "20px" }}>
          <div className="form-row">
            <input
              className="input"
              type="text"
              placeholder="QR Code Value"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              className="input"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button className="primary-action" type="submit">
            Pay
          </button>
        </form>
      </div>
    </div>
  );
}

export default QRPay;
