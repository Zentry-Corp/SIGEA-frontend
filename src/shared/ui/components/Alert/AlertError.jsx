import React from "react";

export const AlertError = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)", // 🔵 más suave
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#ffffff", // 🤍 fondo blanco para más contraste
          width: "420px",
          padding: "26px",
          borderRadius: "12px",
          border: "1px solid #d9d9d9",
          color: "#1a1a1a", // texto más oscuro y legible
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.08)", // ✨ sombra moderna
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: "12px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#E53935", // 🔴 título rojo para indicar error
          }}
        >
          ❌ Error
        </h3>

        <p
          style={{
            opacity: 0.9,
            marginBottom: "22px",
            lineHeight: "1.5",
            fontSize: "15px",
          }}
        >
          {message || "Ha ocurrido un error inesperado."}
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            background: "#E53935",
            borderRadius: "8px",
            border: "none",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "15px",
            transition: "0.2s",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
