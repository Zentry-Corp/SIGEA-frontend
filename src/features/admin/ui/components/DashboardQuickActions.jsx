import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Panel, SectionTitle, QuickRow, QuickAction } from "../AdminLayout.styles";
// Importamos la función generadora de tu servicio y los iconos necesarios
import { generateQuickActions } from "../../services/statsService"; // [cite: 451]
import { FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";

// Mapa de iconos para poder renderizarlos dinámicamente desde el servicio
const ICON_MAP = {
  FiUsers: <FiUsers />,
  FiCheckCircle: <FiCheckCircle />,
  FiClock: <FiClock />
};

export const DashboardQuickActions = () => {
  const navigate = useNavigate();
  // Generamos la lista de acciones usando tu servicio
  const actions = generateQuickActions(navigate);

  return (
    <Panel>
      <SectionTitle>Acciones rápidas</SectionTitle>
      <div style={{ height: 12 }} />
      <QuickRow>
        {actions.map((action) => (
          <QuickAction 
            key={action.id} 
            $tone={action.tone} 
            onClick={action.onClick}
          >
            <div className="icon">
              {ICON_MAP[action.icon] || <FiClock />}
            </div>
            <h4>{action.title}</h4>
            <p>{action.description}</p>
            <div className="link">
              Ir <FiArrowRight />
            </div>
          </QuickAction>
        ))}
      </QuickRow>
    </Panel>
  );
};