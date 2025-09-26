// src/components/PageCard.jsx
import React from "react";

export default function PageCard({
  title,
  subtitle,
  children,
  actions,
  wide = false,
}) {
  return (
    <div className="center-col">
      <div
        className={`auth-card ${wide ? "auth-card-wide" : ""}`}
        style={{
          padding: "28px",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          width: wide ? "700px" : "400px",
          maxWidth: "90%",
          textAlign: "left",
        }}
      >
        {title && (
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: "#111",
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            style={{
              marginTop: "6px",
              fontSize: "14px",
              color: "var(--muted, #666)",
            }}
          >
            {subtitle}
          </p>
        )}

        <div style={{ marginTop: 20 }}>{children}</div>

        {actions && <div style={{ marginTop: 20 }}>{actions}</div>}
      </div>
    </div>
  );
}
