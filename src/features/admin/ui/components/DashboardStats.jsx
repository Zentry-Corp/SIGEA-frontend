import React from "react";
import { FiUsers, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";
import { StatsGrid, StatCard } from "../adminLayout.styles"; // Reusamos tus estilos existentes
import { STAT_TONES } from "../../constants/dashboard.constants"; // [cite: 426]

export const DashboardStats = ({ stats, loading }) => {
  // Helper para mostrar "..." si está cargando
  const val = (value) => (loading ? "..." : value);

  return (
    <StatsGrid>
      <StatCard $tone={STAT_TONES.BLUE}>
        <div className="icon"><FiUsers /></div>
        <div className="label">Usuarios totales</div>
        <div className="value">{val(stats.total)}</div>
        <div className="hint">En el sistema</div>
      </StatCard>

      <StatCard $tone={STAT_TONES.PURPLE}>
        <div className="icon"><FiUser /></div>
        <div className="label">Organizadores</div>
        <div className="value">{val(stats.organizadores)}</div>
        <div className="hint">Editores de eventos</div>
      </StatCard>
    </StatsGrid>
  );
};