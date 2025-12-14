import React from "react";

export const AlertConfirmDelete = ({ open, message, onCancel, onConfirm }) => {
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
          background: "#ffffff",
          width: "420px",
          padding: "26px",
          borderRadius: "12px",
          border: "1px solid #d9d9d9",
          color: "#1a1a1a",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.08)",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: "12px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#F59E0B", // 🟠 color advertencia
          }}
        >
          ⚠️ ¿Estás seguro?
        </h3>

        <p
          style={{
            opacity: 0.9,
            marginBottom: "22px",
            lineHeight: "1.5",
            fontSize: "15px",
          }}
        >
          {message || "Esta acción no se puede deshacer. ¿Deseas continuar?"}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              background: "#E5E7EB",
              borderRadius: "8px",
              border: "none",
              color: "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.2s",
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              background: "#DC2626",
              borderRadius: "8px",
              border: "none",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.2s",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
