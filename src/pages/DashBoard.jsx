import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../index.css";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ⭐ added: helper to format account number
  const formatAccountNumber = (acc) => {
    if (!acc) return "—";
    // keep only digits, then trim to 12 characters
    const digitsOnly = acc.replace(/[^0-9]/g, "");
    return digitsOnly.slice(0, 12) || acc.slice(0, 12);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const walletPromise = api.get("/wallet");
        const txnsPromise = api
          .get("/transactions?limit=5")
          .catch(() => ({ data: [] }));

        const [walletRes, txnsRes] = await Promise.all([
          walletPromise,
          txnsPromise,
        ]);

        if (!mounted) return;
        setWallet(walletRes.data);
        setTxns(Array.isArray(txnsRes.data) ? txnsRes.data : []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          alert("Session expired. Please sign in again.");
          navigate("/login");
          return;
        }

        const msg = err?.response?.data?.message || "Failed to load data";
        alert(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div>
      <div style={{ marginBottom: 24 }} className="card">
        <div className="wallet-header">
          <div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Wallet Balance
            </div>
            <div className="balance">
              {wallet?.balance ?? "0.00"}{" "}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                {wallet?.currency ?? "INR"}
              </span>
            </div>
            <div
              style={{ color: "var(--muted)", marginTop: 6, fontSize: 13 }}
            >
              {/* ⭐ use formatted account number */}
              Account: {formatAccountNumber(wallet?.accountNumber)}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="nav-btn btn-outline"
              onClick={() => navigate("/transactions")}
            >
              View All
            </button>
            <button
              className="nav-btn btn-primary"
              onClick={() => navigate("/send")}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>Recent Transactions</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            {loading ? "Loading..." : `${txns.length} shown`}
          </div>
        </div>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && txns.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 14, color: "var(--muted)" }}>
                  No recent transactions.
                </td>
              </tr>
            )}

            {txns.map((t) => (
              <tr key={t.id}>
                <td style={{ width: 180 }}>
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td>{t.type ?? "-"}</td>
                <td>
                  {t.amount ?? "-"} {t.currency ?? ""}
                </td>
                <td>{t.status ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button
            className="nav-btn btn-outline"
            onClick={() => navigate("/qr")}
          >
            Receive (QR)
          </button>
          <button
            className="nav-btn btn-outline"
            onClick={() => navigate("/bills")}
          >
            Pay Bill
          </button>
          <button
            className="nav-btn btn-primary"
            onClick={() => navigate("/send")}
          >
            New Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
