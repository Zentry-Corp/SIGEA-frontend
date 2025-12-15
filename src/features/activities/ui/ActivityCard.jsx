// src/features/activities/ui/ActivityCard.jsx
import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useSessionsByActivity } from "@/features/sessions/hooks/useSessionsByActivity";

const ActivityCard = ({ activity, onViewDetail, onEdit, onDelete, onAddSession }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  // ✅ Lee el hook de forma tolerante
  const sessionsResult =
    (typeof useSessionsByActivity === "function" && activity?.id
      ? useSessionsByActivity(activity.id)
      : null) || {};

  // Intenta obtener sesiones desde varios shapes posibles
  const raw =
    sessionsResult?.sesiones ??
    sessionsResult?.sessions ??
    sessionsResult?.data ??
    sessionsResult?.response?.data ??
    sessionsResult;

  const sesiones = Array.isArray(raw) ? raw : Array.isArray(raw?.extraData) ? raw.extraData : [];
  const loadingSesiones = Boolean(sessionsResult?.loading ?? sessionsResult?.isLoading ?? false);

  const getEstadoConfig = (codigo) => {
    const configs = {
      EN_CURSO: { color: "#059669", bg: "#ECFDF5", borderColor: "#A7F3D0", label: "En curso" },
      PENDIENTE: { color: "#D97706", bg: "#FEF3C7", borderColor: "#FDE68A", label: "Pendiente" },
      FINALIZADO: { color: "#6366F1", bg: "#EEF2FF", borderColor: "#C7D2FE", label: "Finalizado" },
      CANCELADO: { color: "#DC2626", bg: "#FEF2F2", borderColor: "#FECACA", label: "Cancelado" },
      SUSPENDIDO: { color: "#6B7280", bg: "#F9FAFB", borderColor: "#E5E7EB", label: "Suspendido" },
      PUBLICADO: { color: "#2563EB", bg: "#EFF6FF", borderColor: "#BFDBFE", label: "Publicado" },

      PRESENCIAL: { color: "#4F7CFF", bg: "#F0F4FF", borderColor: "#C7D7FE", label: "Presencial" },
      VIRTUAL: { color: "#10b981", bg: "#F0FDF9", borderColor: "#A7F3D0", label: "Virtual" },
      HIBRIDA: { color: "#f59e0b", bg: "#FFF8F0", borderColor: "#FDE68A", label: "Híbrido" },
      HIBRIDO: { color: "#f59e0b", bg: "#FFF8F0", borderColor: "#FDE68A", label: "Híbrido" },
    };

    return (
      configs[codigo] || {
        color: "#64748b",
        bg: "#F8FAFC",
        borderColor: "#E2E8F0",
        label: codigo || "Sin estado",
      }
    );
  };

  const tipoNombre = activity?.tipoActividad?.nombreActividad || "Actividad";
  const estadoCodigo = activity?.estado?.codigo || "";
  const estadoConfig = getEstadoConfig(estadoCodigo);
  const estadoEtiqueta = activity?.estado?.etiqueta || estadoConfig.label;

  return (
    <Card $accentColor={estadoConfig.color}>
      <CardHeader>
        <HeaderLeft>
          <IconContainer $bgColor={estadoConfig.bg}>
            <TypeIcon $color={estadoConfig.color}>{tipoNombre.charAt(0)}</TypeIcon>
          </IconContainer>
          <HeaderInfo>
            <TypeLabel>{tipoNombre}</TypeLabel>
            <DateRange>Inicio: {formatDate(activity?.fechaInicio)}</DateRange>
          </HeaderInfo>
        </HeaderLeft>
        <EstadoBadge $config={estadoConfig}>{estadoEtiqueta}</EstadoBadge>
      </CardHeader>

      <TitleSection>
        <Title>{activity?.titulo}</Title>
        {activity?.descripcion && (
          <Description>
            {activity.descripcion.length > 120
              ? `${activity.descripcion.substring(0, 120)}...`
              : activity.descripcion}
          </Description>
        )}
      </TitleSection>

      <InfoSection>
        <SectionDivider />

        <InfoGrid>
          <InfoItem>
            <InfoLabel>Duración</InfoLabel>
            <InfoValue>
              {formatDate(activity?.fechaInicio)} - {formatDate(activity?.fechaFin)}
            </InfoValue>
          </InfoItem>

          {activity?.horaInicio && (
            <InfoItem>
              <InfoLabel>Hora de Inicio</InfoLabel>
              <InfoValue>{activity.horaInicio}</InfoValue>
            </InfoItem>
          )}

          <InfoItem>
            <InfoLabel>Sesiones</InfoLabel>
            <InfoValue
              style={{
                color: sesiones.length === 0 ? "#94a3b8" : "#0f172a",
                fontWeight: sesiones.length === 0 ? 500 : 600,
              }}
            >
              {loadingSesiones ? "Cargando..." : sesiones.length === 0 ? "Aún sin sesiones" : sesiones.length}
            </InfoValue>
          </InfoItem>

          {activity?.ubicacion && (
            <InfoItem>
              <InfoLabel>Ubicación</InfoLabel>
              <InfoValue>{activity.ubicacion}</InfoValue>
            </InfoItem>
          )}
        </InfoGrid>
      </InfoSection>

      <CardFooter>
        <ActionButton
          onClick={() => onViewDetail(activity)}
          $variant="primary"
          $accentColor={estadoConfig.color}
        >
          Ver detalles <ArrowIcon>→</ArrowIcon>
        </ActionButton>

        {onAddSession && (
          <ActionButton
            onClick={() => onAddSession(activity)}
            $variant="secondary"
            $accentColor={estadoConfig.color}
          >
            Sesiones
          </ActionButton>
        )}

        {(onEdit || onDelete) && (
          <ActionButtons>
            {onEdit && (
              <IconButton onClick={() => onEdit(activity)} $variant="edit" title="Editar actividad">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </IconButton>
            )}

            {onDelete && (
              <IconButton onClick={() => onDelete(activity)} $variant="delete" title="Eliminar actividad">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </IconButton>
            )}
          </ActionButtons>
        )}
      </CardFooter>
    </Card>
  );
};

// ==== styles (sin cambios funcionales) ====
const Card = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 520px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: ${(props) => props.$accentColor || "#5B7FFF"};
    border-radius: 16px 0 0 16px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  }

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: #e2e8f0;

    &::before {
      width: 4px;
      opacity: 1;
    }
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 12px;`;
const IconContainer = styled.div`
  width: 48px; height: 48px; border-radius: 12px;
  background: ${(props) => props.$bgColor};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`;
const TypeIcon = styled.div`font-size: 1.25rem; font-weight: 700; color: ${(props) => props.$color};`;
const HeaderInfo = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const TypeLabel = styled.div`font-size: 0.875rem; font-weight: 600; color: #0f172a; line-height: 1.2;`;
const DateRange = styled.div`font-size: 0.8125rem; color: #64748b; font-weight: 500;`;
const EstadoBadge = styled.div`
  padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600;
  color: ${(props) => props.$config.color};
  background: ${(props) => props.$config.bg};
  white-space: nowrap; transition: all 0.2s ease;
  &:hover { transform: scale(1.05); }
`;
const TitleSection = styled.div`margin-bottom: 24px;`;
const Title = styled.h3`
  font-size: 1.4rem; font-weight: 600; color: #0f172a;
  margin: 0 0 8px 0; line-height: 1.35;
`;
const Description = styled.p`
  font-size: 0.875rem; color: #94a3b8; line-height: 1.5;
  max-width: 90%; margin: 0;
`;
const InfoSection = styled.div`margin-bottom: 20px;`;
const SectionDivider = styled.div`height: 1px; background: #f1f5f9; margin-bottom: 20px;`;
const InfoGrid = styled.div`display: flex; flex-direction: column; gap: 16px;`;
const InfoItem = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px; border-radius: 8px; transition: all 0.2s ease;
  &:hover { background: #f8fafc; }
`;
const InfoLabel = styled.div`font-size: 0.875rem; color: #64748b; font-weight: 500;`;
const InfoValue = styled.div`font-size: 0.875rem; color: #0f172a; font-weight: 600; text-align: right;`;
const CardFooter = styled.div`
  padding-top: 16px; border-top: 1px solid #f1f5f9;
  display: flex; gap: 12px; align-items: center;
`;
const ActionButtons = styled.div`display: flex; gap: 8px; margin-left: auto;`;
const ActionButton = styled.button`
  padding: 10px 16px; border-radius: 8px; font-size: 0.875rem;
  font-weight: 600; cursor: pointer;

  background: ${(props) => (props.$variant === "primary" ? props.$accentColor || "#5B7FFF" : "transparent")};
  border: ${(props) => (props.$variant === "primary" ? "none" : `1px solid ${props.$accentColor || "#5B7FFF"}`)};
  color: ${(props) => (props.$variant === "primary" ? "#ffffff" : props.$accentColor || "#5B7FFF")};

  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${(props) => (props.$variant === "primary" ? (props.$accentColor ? `${props.$accentColor}DD` : "#4A6FEE") : props.$accentColor || "#5B7FFF")};
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${(props) => (props.$accentColor ? `${props.$accentColor}40` : "rgba(91, 127, 255, 0.3)")};
  }

  &:active { transform: translateY(0); }
`;
const IconButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 10px;
  border: none; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  background: ${(props) => (props.$variant === "edit" ? "#F0F9FF" : props.$variant === "delete" ? "#FEF2F2" : "#F8FAFC")};
  color: ${(props) => (props.$variant === "edit" ? "#0EA5E9" : props.$variant === "delete" ? "#EF4444" : "#64748B")};

  &:hover {
    background: ${(props) => (props.$variant === "edit" ? "#0EA5E9" : props.$variant === "delete" ? "#EF4444" : "#E2E8F0")};
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$variant === "edit"
        ? "0 4px 12px rgba(14, 165, 233, 0.3)"
        : props.$variant === "delete"
        ? "0 4px 12px rgba(239, 68, 68, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  }

  &:active { transform: translateY(0); }
  svg { transition: transform 0.2s ease; }
  &:hover svg { transform: scale(1.1); }
`;
const ArrowIcon = styled.span`
  font-size: 1.125rem;
  transition: transform 0.3s ease;
  ${ActionButton}:hover & { transform: translateX(4px); }
`;

export default ActivityCard;
