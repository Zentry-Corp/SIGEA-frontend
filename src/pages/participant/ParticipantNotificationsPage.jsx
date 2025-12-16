import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import ParticipantLayout from './ParticipantLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useMyNotifications } from '../../features/participant/hooks/useMyNotifications';
import { FiCheck, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;

  @media (max-width: 768px){
    flex-direction: column;
  }
`;

const Title = styled.h1`
  margin: 0 0 6px 0;
  font-size: 1.8rem;
  font-weight: 900;
  color: #111827;
`;

const Subtitle = styled.div`
  color: #6b7280;
  font-size: 0.95rem;
`;

const Toolbar = styled.div`
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  display:inline-flex;
  align-items:center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  font-weight: 900;
  cursor: pointer;

  &:hover{ background:#f9fafb; }

  &:disabled{
    opacity: .6;
    cursor:not-allowed;
  }
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
`;

const CardTop = styled.div`
  padding: 14px 16px;
  display:flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`;

const Msg = styled.div`
  min-width: 0;
  b{
    display:block;
    color:#111827;
    font-weight: 900;
    margin-bottom: 4px;
  }
  p{
    margin: 0;
    color:#475569;
    line-height: 1.45;
  }
`;

const Meta = styled.div`
  color:#6b7280;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
`;

const Badge = styled.span`
  display:inline-flex;
  align-items:center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.78rem;
  border: 1px solid ${p => p.$border};
  background: ${p => p.$bg};
  color: ${p => p.$color};
  margin-top: 8px;
`;

const Footer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
  display:flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Empty = styled.div`
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 22px;
  color: #475569;
`;

const isUnread = (n) => {
  const codigo = n?.estadoNotificacion?.codigo || '';
  return !String(codigo).toUpperCase().includes('LEID');
};

const estadoBadge = (n) => {
  if (isUnread(n)) {
    return { label: 'No leída', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', color: '#92400e' };
  }
  return { label: 'Leída', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', color: '#065f46' };
};

export const ParticipantNotificationsPage = () => {
  const { user } = useAuth();
  const usuarioId = String(user?.usuarioId || user?.id_usuario || user?.id || '');

  const { items, loading, error, reload, unreadCount, marcarLeida, marcarTodasLeidas } =
    useMyNotifications(usuarioId);

  const [busyId, setBusyId] = useState(null);
  const hasItems = (items || []).length > 0;

  const title = useMemo(() => {
    if (unreadCount > 0) return `Mis notificaciones (${unreadCount} nuevas)`;
    return 'Mis notificaciones';
  }, [unreadCount]);

  const onMarkOne = async (id) => {
    try {
      setBusyId(id);
      await marcarLeida(id);
    } finally {
      setBusyId(null);
    }
  };

  const onMarkAll = async () => {
    if (!hasItems || unreadCount === 0) return;
    const ok = window.confirm('¿Marcar todas como leídas?');
    if (!ok) return;

    try {
      setBusyId('__ALL__');
      await marcarTodasLeidas();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ParticipantLayout>
      <Container>
        <Header>
          <div>
            <Title>{title}</Title>
            <Subtitle>Revisa avisos del sistema (inscripción, certificados, cambios, etc.).</Subtitle>
          </div>

          <Toolbar>
            <Btn onClick={reload} disabled={loading}>
              <FiRefreshCw /> Recargar
            </Btn>
            <Btn onClick={onMarkAll} disabled={loading || unreadCount === 0 || busyId === '__ALL__'}>
              <FiCheckCircle /> Marcar todas leídas
            </Btn>
          </Toolbar>
        </Header>

        {loading && <div style={{ color: '#6b7280', fontWeight: 800 }}>Cargando notificaciones…</div>}
        {error && <div style={{ color: '#ef4444', fontWeight: 900 }}>{error}</div>}

        {!loading && !error && !hasItems && (
          <Empty>
            <strong>No tienes notificaciones.</strong>
            <div style={{ marginTop: 6 }}>Cuando el sistema genere alertas, aparecerán aquí.</div>
          </Empty>
        )}

        {!loading && !error && hasItems && (
          <List>
            {items.map((n) => {
              const badge = estadoBadge(n);
              const unread = isUnread(n);

              return (
                <Card key={n.id}>
                  <CardTop>
                    <Msg>
                      <b>{n?.tipoNotificacion?.etiqueta || 'Notificación'}</b>
                      <p>{n?.mensaje || '—'}</p>

                      <Badge $bg={badge.bg} $border={badge.border} $color={badge.color}>
                        {badge.label}
                      </Badge>
                    </Msg>

                    <Meta>
                      <div>{n?.fechaEnvio || '—'}</div>
                      {n?.canal ? <div>Canal: {n.canal}</div> : null}
                    </Meta>
                  </CardTop>

                  <Footer>
                    <Btn
                      onClick={() => onMarkOne(n.id)}
                      disabled={!unread || busyId === n.id || loading}
                      title={unread ? 'Marcar como leída' : 'Ya está leída'}
                    >
                      <FiCheck /> Marcar leída
                    </Btn>
                  </Footer>
                </Card>
              );
            })}
          </List>
        )}
      </Container>
    </ParticipantLayout>
  );
};

export default ParticipantNotificationsPage;
