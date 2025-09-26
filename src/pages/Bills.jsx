// src/pages/Bills.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../index.css";

export default function Bills() {
  const [currentBill, setCurrentBill] = useState(null);
  const [billerName, setBillerName] = useState("");
  const [accountRef, setAccountRef] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  // format number to 2-decimal currency string
  const fmt = (v) =>
    typeof v === "number" ? v.toFixed(2) : (parseFloat(v) || 0).toFixed(2);

  useEffect(() => {
    let mounted = true;

    const fetchCurrentBill = async () => {
      try {
        setLoading(true);
        // Attempt to fetch a "current" bill from backend.
        // If your API path differs, adjust '/bills/current' accordingly.
        const res = await api.get("/bills/current").catch(() => ({ data: null }));
        if (!mounted) return;

        const bill = res?.data ?? null;
        setCurrentBill(bill);

        // If a current bill exists, prefill the form fields
        if (bill) {
          setBillerName(bill.billerName || "");
          setAccountRef(bill.accountRef || "");
          setAmount(bill.amount != null ? fmt(bill.amount) : "");
        } else {
          // if no current bill, clear form
          setBillerName("");
          setAccountRef("");
          setAmount("");
        }
      } catch (err) {
        console.error("Failed to load current bill", err);
        alert("Unable to load current bill. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCurrentBill();
    return () => {
      mounted = false;
    };
  }, []);

  const validate = () => {
    if (!billerName.trim()) {
      alert("Please enter biller name.");
      return false;
    }
    if (!accountRef.trim()) {
      alert("Please enter account/reference number.");
      return false;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return false;
    }
    return true;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setPaying(true);
      // Call backend pay endpoint. Adjust if your backend expects different route/payload.
      const payload = {
        billerName: billerName.trim(),
        accountRef: accountRef.trim(),
        amount: parseFloat(amount),
        source: "wallet",
      };

      const res = await api.post("/bills/pay", payload);
      // Assuming success returns the transaction or confirmation
      alert("Payment successful. Thank you!");
      // navigate to transactions to show new payment (optional)
      navigate("/transactions");
    } catch (err) {
      console.error("Payment failed", err);
      const msg = err?.response?.data?.message || "Payment failed. Try again.";
      alert(msg);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <div className="auth-card auth-card-wide" style={{ maxWidth: 520 }}>
          <h2 style={{ textAlign: "center", margin: 0 }}>Pay Bills</h2>
          <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 6 }}>
            {currentBill ? "Settle your current bill" : "Settle your utility and service bills"}
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
              Loading...
            </div>
          ) : (
            <form onSubmit={handlePay} style={{ marginTop: 14 }}>
              <div className="form-row">
                <input
                  className="input"
                  value={billerName}
                  onChange={(e) => setBillerName(e.target.value)}
                  placeholder="Biller Name"
                  aria-label="Biller Name"
                />
              </div>

              <div className="form-row">
                <input
                  className="input"
                  value={accountRef}
                  onChange={(e) => setAccountRef(e.target.value)}
                  placeholder="Account/Ref Number"
                  aria-label="Account Reference"
                />
              </div>

              <div className="form-row">
                <input
                  className="input"
                  value={amount}
                  onChange={(e) => {
                    // allow only numbers and dot
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v) || v === "") setAmount(v);
                  }}
                  placeholder="Amount"
                  aria-label="Amount"
                />
              </div>

              {/* If there's a current bill, show bill summary above the button */}
              {currentBill && (
                <div style={{ marginBottom: 12, color: "var(--muted)", fontSize: 13 }}>
                  <div>
                    <strong>Due date:</strong>{" "}
                    {currentBill.dueDate ? new Date(currentBill.dueDate).toLocaleDateString() : "—"}
                  </div>
                  <div>
                    <strong>Original amount:</strong> {fmt(currentBill.amount)}{" "}
                    {currentBill.currency ?? "INR"}
                  </div>
                  {currentBill.description && (
                    <div style={{ marginTop: 6 }}>{currentBill.description}</div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  className="primary-action"
                  disabled={paying}
                  style={{ flex: 1 }}
                >
                  {paying ? "Processing..." : currentBill ? "Pay Current Bill" : "Pay Bill"}
                </button>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => {
                    // Reset form fields if user wants to clear
                    setBillerName("");
                    setAccountRef("");
                    setAmount("");
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* helpful note */}
      <div style={{ maxWidth: 1100, margin: "20px auto", padding: "0 20px", color: "var(--muted)" }}>
        <small>
          Tip: If your biller supports it, we prefill the current outstanding bill. If nothing shows,
          enter biller details manually.
        </small>
      </div>
    </div>
  );
}
