import styled from "styled-components";
import { FiClock, FiUser, FiMapPin } from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CAMBIOS VISUALES REALIZADOS (UI/UX):
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * 1. JERARQUÍA VISUAL CLARA:
 *    - Horario: Badge prominente con fondo índigo, icono de reloj integrado
 *    - Título: Mayor peso tipográfico (font-weight: 700, tamaño destacado)
 *    - Metadatos: Texto secundario más sutil en gris
 * 
 * 2. LAYOUT DE SESIÓN REORGANIZADO:
 *    - Header con horario (izquierda) + badge modalidad (derecha) usando flexbox
 *    - Contenido principal centrado con título y metadatos
 * 
 * 3. METADATOS EN LÍNEA ÚNICA:
 *    - Ponente y lugar en la misma línea
 *    - Separados por punto medio (·) cuando ambos existen
 *    - Iconos sutiles para identificar cada dato
 * 
 * 4. BADGE DE MODALIDAD:
 *    - Alineado a la derecha del header
 *    - Colores diferenciados: Verde (PRESENCIAL) / Azul (VIRTUAL)
 *    - Tamaño compacto y discreto
 * 
 * 5. MEJORAS RESPONSIVAS:
 *    - En móvil: header se convierte en columna
 *    - Metadatos se apilan verticalmente en pantallas pequeñas
 *    - Espaciados y fuentes adaptados
 * 
 * 6. ESTADOS MEJORADOS:
 *    - Loading: Skeleton con animación shimmer
 *    - Empty: Estado vacío amigable con icono
 * ══════════════════════════════════════════════════════════════════════════════
 */

const pad2 = (n) => String(n).padStart(2, "0");

const formatHora = (hora) => {
  if (!hora) return "--:--";
  if (typeof hora === "string") return hora.slice(0, 5);

  const h = hora.hour ?? hora.hora ?? hora.h;
  const m = hora.minute ?? hora.minuto ?? hora.m;

  if (h === undefined || m === undefined) return "--:--";
  return `${pad2(h)}:${pad2(m)}`;
};

const getModalidadConfig = (modalidad) => {
  const normalized = modalidad?.toUpperCase() || "";
  
  if (normalized.includes("VIRTUAL")) {
    return {
      label: "VIRTUAL",
      bgColor: "#dbeafe",
      color: "#2563eb",
      borderColor: "#93c5fd"
    };
  }
  
  return {
    label: "PRESENCIAL",
    bgColor: "#d1fae5",
    color: "#059669",
    borderColor: "#6ee7b7"
  };
};

const SessionList = ({ sessions = [], loading }) => {
  if (loading) {
    return (
      <LoadingContainer>
        {[1, 2, 3].map((i) => (
          <SkeletonItem key={i}>
            <SkeletonHeader>
              <SkeletonBadge />
              <SkeletonModalidad />
            </SkeletonHeader>
            <SkeletonTitle />
            <SkeletonMeta />
          </SkeletonItem>
        ))}
      </LoadingContainer>
    );
  }

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📭</EmptyIcon>
        <EmptyText>Aún no hay sesiones registradas</EmptyText>
      </EmptyState>
    );
  }

  return (
    <List>
      {sessions.map((session) => {
        const modalidadConfig = getModalidadConfig(session.modalidad);
        const hasPonente = Boolean(session.ponente);
        const hasLugar = Boolean(session.lugarSesion);
        const hasMetadata = hasPonente || hasLugar;
        
        return (
          <SessionItem key={session.id}>
            {/* ═══ HEADER: Horario a la izquierda + Modalidad a la derecha ═══ */}
            <SessionHeader>
              <TimeBadge>
                <FiClock />
                <span>
                  {formatHora(session.horaInicio)} – {formatHora(session.horaFin)}
                </span>
              </TimeBadge>
              
              {session.modalidad && (
                <ModalidadBadge {...modalidadConfig}>
                  <HiOutlineStatusOnline />
                  <span>{modalidadConfig.label}</span>
                </ModalidadBadge>
              )}
            </SessionHeader>

            {/* ═══ TÍTULO (mayor peso visual) ═══ */}
            <Title>{session.titulo || "Sesión sin título"}</Title>

            {/* ═══ METADATOS: Ponente · Lugar (en línea única) ═══ */}
            {hasMetadata && (
              <MetaLine>
                {hasPonente && (
                  <MetaItem>
                    <FiUser />
                    <span>{session.ponente}</span>
                  </MetaItem>
                )}
                
                {hasPonente && hasLugar && <MetaSeparator>·</MetaSeparator>}
                
                {hasLugar && (
                  <MetaItem className="location">
                    <FiMapPin />
                    <span>{session.lugarSesion}</span>
                  </MetaItem>
                )}
              </MetaLine>
            )}
          </SessionItem>
        );
      })}
    </List>
  );
};

export default SessionList;

/* ═══════════════════════════════════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const SessionItem = styled.article`
  background: #ffffff;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Header: Horario (izquierda) + Modalidad (derecha)
───────────────────────────────────────────────────────────────────────────── */
const SessionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Badge de Horario - Prominente, con gradiente índigo
───────────────────────────────────────────────────────────────────────────── */
const TimeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  white-space: nowrap;

  svg {
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Badge de Modalidad - Compacto, alineado a la derecha
───────────────────────────────────────────────────────────────────────────── */
const ModalidadBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  background: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  border: 1px solid ${({ borderColor }) => borderColor};
  white-space: nowrap;

  svg {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 3px 8px;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Título - Mayor peso visual
───────────────────────────────────────────────────────────────────────────── */
const Title = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Línea de Metadatos - Ponente · Lugar
───────────────────────────────────────────────────────────────────────────── */
const MetaLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  color: #64748b;
  font-size: 0.85rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    gap: 4px;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;

  svg {
    font-size: 0.85rem;
    color: #94a3b8;
    flex-shrink: 0;
  }

  &.location svg {
    color: #f87171;
  }

  @media (max-width: 480px) {
    svg {
      font-size: 0.8rem;
    }
  }
`;

const MetaSeparator = styled.span`
  color: #cbd5e1;
  font-weight: 700;
  margin: 0 2px;
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   ESTADOS: LOADING & EMPTY
═══════════════════════════════════════════════════════════════════════════════ */

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonItem = styled.div`
  background: #f8fafc;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const SkeletonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonBadge = styled(SkeletonBase)`
  width: 130px;
  height: 30px;
  border-radius: 20px;
`;

const SkeletonModalidad = styled(SkeletonBase)`
  width: 80px;
  height: 24px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  width: 65%;
  height: 22px;
  margin-bottom: 10px;
`;

const SkeletonMeta = styled(SkeletonBase)`
  width: 45%;
  height: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
  text-align: center;
`;