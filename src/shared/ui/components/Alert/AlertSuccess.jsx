import React from "react";

export const AlertSuccess = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          width: "420px",
          padding: "28px",
          borderRadius: "12px",
          border: "1px solid #d1fae5",
          color: "#065f46",
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: "10px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#047857",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
           Éxito
        </h3>

        <p style={{ opacity: 0.95, marginBottom: "20px", fontSize: "1rem" }}>
          {message || "Operación realizada correctamente."}
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            background: "#10b981",
            borderRadius: "8px",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
