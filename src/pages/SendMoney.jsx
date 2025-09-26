import { useState, useEffect } from "react";
import api from "../services/api";
import "../index.css";

function SendMoney() {
  const [wallet, setWallet] = useState(null);
  const [form, setForm] = useState({ recipient: "", amount: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWallet(res.data);
      } catch {
        alert("Failed to load wallet");
      }
    };
    fetchWallet();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipient.trim() || !form.amount) {
      alert("Please enter recipient and amount");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post(
        "/transactions/send",
        {
          to: form.recipient,
          amount: parseFloat(form.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Transfer successful");
      setForm({ recipient: "", amount: "" });
    } catch {
      alert("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-col">
      <div className="auth-card fade-in">
        <h2 className="h-title">Send Money</h2>
        <p className="h-sub">Transfer funds instantly from your wallet</p>

        {wallet && (
          <div className="card" style={{ marginBottom: 20 }}>
            <p><strong>Balance:</strong> {wallet.balance} {wallet.currency}</p>
            <p><strong>Account Number:</strong> {wallet.accountNumber}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              className="input"
              type="text"
              name="recipient"
              placeholder="Recipient Name / Phone / Email"
              value={form.recipient}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              className="input"
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <button className="primary-action" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendMoney;
