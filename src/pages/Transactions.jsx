import { useEffect, useState } from "react";
import api from "../services/api";
import "../index.css";

function Transactions() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTxns(res.data);
      } catch {
        alert("Failed to load transactions");
      }
    };
    fetchTxns();
  }, []);

  return (
    <div className="center-col">
      <div
        className="auth-card"
        style={{ padding: "28px", width: "700px", textAlign: "center" }}
      >
        <h2 className="h-title">Transaction History</h2>
        <p className="h-sub">View your recent wallet activity</p>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Type</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {txns.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              txns.map((t) => (
                <tr key={t.id}>
                  <td style={{ border: "1px solid #eee", padding: "10px" }}>
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #eee", padding: "10px" }}>
                    {t.type}
                  </td>
                  <td style={{ border: "1px solid #eee", padding: "10px" }}>
                    {t.amount} {t.currency}
                  </td>
                  <td style={{ border: "1px solid #eee", padding: "10px" }}>
                    {t.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
