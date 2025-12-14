import React from "react";

export const AlertWarning = ({ open, message, onConfirm, onCancel, confirmText = "Sí, salir" }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#FFF8E1",
          width: "420px",
          padding: "24px",
          borderRadius: "14px",
          border: "1px solid #FFECB3",
          color: "#5D4037",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <h3 style={{ margin: 0, marginBottom: "10px", fontSize: "20px", color: "#BF360C" }}>
          Advertencia
        </h3>

        <p style={{ marginBottom: "20px" }}>
          {message || "¿Deseas continuar?"}
        </p>

        <div style={{ display: "flex", justifyContent: "end", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 16px",
              background: "#E0E0E0",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "10px 16px",
              background: "#FF7043",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
