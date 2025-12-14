import styled from "styled-components";
import { FiClock, FiUser } from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const pad2 = (n) => String(n).padStart(2, "0");

const formatHora = (hora) => {
  if (!hora) return "--:--";

  // Caso 1: viene como string "09:00" o "09:00:00"
  if (typeof hora === "string") return hora.slice(0, 5);

  // Caso 2: viene como objeto { hour, minute }
  const h = hora.hour ?? hora.hora ?? hora.h; // por si cambia el nombre
  const m = hora.minute ?? hora.minuto ?? hora.m;

  if (h === undefined || m === undefined) return "--:--";

  return `${pad2(h)}:${pad2(m)}`;
};

const SessionList = ({ sessions = [], loading }) => {
  if (loading) {
    return <Empty>Cargando sesiones…</Empty>;
  }

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return <Empty>Aún no hay sesiones registradas</Empty>;
  }
  

  return (
    <List>
      {sessions.map((session) => (
        <SessionItem key={session.id}>
          <Header>
            <span>{session.titulo || "Sesión sin título"}</span>
            <span>
              {formatHora(session.horaInicio)} – {formatHora(session.horaFin)}
            </span>
          </Header>

          {session.ponente && (
            <Meta>
              <FiUser />
              {session.ponente}
            </Meta>
          )}

          {session.lugarSesion && <Meta>📍 {session.lugarSesion}</Meta>}
        </SessionItem>
      ))}
    </List>
  );
};

export default SessionList;

/* styles */
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionItem = styled.div`
  background: #f8fafc;
  padding: 14px;
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
`;

const Meta = styled.div`
  margin-top: 6px;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Empty = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
`;
