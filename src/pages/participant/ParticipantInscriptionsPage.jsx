// src/pages/participant/ParticipantInscriptionsPage.jsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiExternalLink, FiTrash2, FiAward, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useMyInscriptions } from '../../features/participant/hooks/useMyInscriptions';
import { inscriptionsApi } from '../../features/participant/api/inscriptionsApi';
import ParticipantLayout from './ParticipantLayout';

// 👇 Usa el mismo modal que ya tienes en Explorar eventos
import ActivityDetailModal from '../../features/activities/ui/ActivityDetailModal';

/* ================== STYLES ================== */
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 6px;
  color: #111827;
`;

const Subtitle = styled.div`
  color: #6b7280;
  font-size: 0.95rem;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  min-width: 280px;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.95rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0 18px;
`;

const Tab = styled.button`
  border: 1px solid ${(p) => (p.$active ? '#4f7cff' : '#e5e7eb')};
  background: ${(p) => (p.$active ? 'rgba(79,124,255,0.10)' : 'white')};
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  color: #111827;

  &:hover {
    border-color: rgba(79,124,255,0.55);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: 0.2s ease;

  &:hover{
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0,0,0,0.10);
    border-color: rgba(79,124,255,0.55);
  }
`;

const Banner = styled.div`
  height: 150px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  overflow: hidden;

  background: ${(p) => {
    if (p.$img) {
      return `linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.55)), url("${p.$img}")`;
    }
    return 'linear-gradient(135deg, rgba(79, 124, 255, 0.20), rgba(0, 0, 0, 0.02))';
  }};
  background-size: cover;
  background-position: center;
`;

const BannerTitle = styled.div`
  font-weight: 900;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: 8px 10px;
  color: #111827;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Body = styled.div`
  padding: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.92rem;
  color: #111827;
  gap: 10px;

  b{
    color: #111827;
  }
`;

const Badge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.78rem;
  border: 1px solid ${(p) => p.$border || '#e5e7eb'};
  background: ${(p) => p.$bg || '#f9fafb'};
  color: ${(p) => p.$color || '#111827'};
  white-space: nowrap;
`;

const Muted = styled.div`
  margin-top: 10px;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.35;
`;

const Actions = styled.div`
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$danger ? 'rgba(239,68,68,0.25)' : '#e5e7eb')};
  background: ${(p) => (p.$primary ? '#4f7cff' : 'white')};
  color: ${(p) => (p.$primary ? 'white' : p.$danger ? '#ef4444' : '#111827')};
  font-weight: 800;
  cursor: pointer;

  &:disabled{
    opacity: .6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled){
    background: ${(p) => (p.$primary ? '#3b63e0' : '#f9fafb')};
  }
`;

const Empty = styled.div`
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 22px;
  color: #475569;

  strong{
    color: #111827;
  }
`;

/* ================== HELPERS ================== */
const statusInfo = (insc) => {
  const codigoRaw = String(insc?.estado?.codigo || '');
  const codigo = codigoRaw.toUpperCase();

  if (codigo.includes('CONF')) {
    return {
      label: insc?.estado?.etiqueta || 'Confirmada',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.25)',
      color: '#065f46',
    };
  }

  if (codigo.includes('PEND')) {
    return {
      label: insc?.estado?.etiqueta || 'Pendiente',
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.25)',
      color: '#92400e',
    };
  }

  if (codigo.includes('CANC')) {
    return {
      label: insc?.estado?.etiqueta || 'Cancelada',
      bg: 'rgba(239,68,68,0.10)',
      border: 'rgba(239,68,68,0.25)',
      color: '#991b1b',
    };
  }

  return {
    label: insc?.estado?.etiqueta || (codigoRaw || '—'),
    bg: '#f9fafb',
    border: '#e5e7eb',
    color: '#111827',
  };
};

const safeText = (v) => (v === null || v === undefined ? '' : String(v));
const short = (v, n = 120) => {
  const s = safeText(v);
  if (!s) return '';
  if (s.length <= n) return s;
  return `${s.slice(0, n)}…`;
};

/* ================== COMPONENT ================== */
export const ParticipantInscriptionsPage = () => {
  const { user } = useAuth();

  const usuarioId = useMemo(() => {
    return String(user?.usuarioId || user?.id_usuario || user?.id || '').trim();
  }, [user]);

  const { items, loading, error, reload } = useMyInscriptions(usuarioId);

  const [q, setQ] = useState('');
  const [tab, setTab] = useState('TODAS');
  const [busyId, setBusyId] = useState(null);

  // 👇 Modal de detalle (mismo flujo que Explorar)
  const [selectedActivity, setSelectedActivity] = useState(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (items || []).filter((i) => {
      if (tab === 'PENDIENTES' && !i?.pendiente) return false;
      if (tab === 'CONFIRMADAS' && !i?.confirmada) return false;
      if (tab === 'CANCELADAS' && !i?.cancelada) return false;

      if (!query) return true;

      const titulo = safeText(i?.actividad?.titulo).toLowerCase();
      const estado = safeText(i?.estado?.codigo || i?.estado?.etiqueta).toLowerCase();

      return titulo.includes(query) || estado.includes(query);
    });
  }, [items, q, tab]);

  const handleRetirar = async (id) => {
    const ok = window.confirm('¿Retirar inscripción?');
    if (!ok) return;

    try {
      setBusyId(id);
      await inscriptionsApi.eliminar(id);
      await reload();
      alert('✅ Inscripción retirada.');
    } catch (e) {
      alert(`❌ No se pudo retirar: ${e?.message || 'Error'}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleCertificado = async (id) => {
    try {
      setBusyId(id);
      const cert = await inscriptionsApi.obtenerCertificadoPorInscripcion(id);
      if (cert?.urlPdf) {
        window.open(cert.urlPdf, '_blank', 'noopener,noreferrer');
        return;
      }
      alert('✅ Certificado encontrado, pero no hay urlPdf.');
      console.log('CertificadoResponse:', cert);
    } catch (e) {
      alert('Aún no hay certificado para esta inscripción (o no está disponible).');
    } finally {
      setBusyId(null);
    }
  };

  const handlePagar = (insc) => {
    // ✅ botón placeholder sin funcionalidad real (por ahora)
    alert('💳 Próximamente podrás pagar desde aquí. (Botón sin funcionalidad)');
    console.log('Pagar inscripción (placeholder):', insc);
  };

  return (
    <ParticipantLayout>
      <Container>
        <Header>
          <div>
            <Title>Mis inscripciones</Title>
            <Subtitle>Consulta el estado y progreso de tus eventos</Subtitle>
          </div>

          <Toolbar>
            <Search>
              <FiSearch />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar…"
              />
            </Search>
          </Toolbar>
        </Header>

        <Tabs>
          <Tab $active={tab === 'TODAS'} onClick={() => setTab('TODAS')}>TODAS</Tab>
          <Tab $active={tab === 'PENDIENTES'} onClick={() => setTab('PENDIENTES')}>PENDIENTES</Tab>
          <Tab $active={tab === 'CONFIRMADAS'} onClick={() => setTab('CONFIRMADAS')}>CONFIRMADAS</Tab>
          <Tab $active={tab === 'CANCELADAS'} onClick={() => setTab('CANCELADAS')}>CANCELADAS</Tab>
        </Tabs>

        {loading && <p>Cargando…</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <Empty>
            <strong>No hay inscripciones para mostrar.</strong>
            <div style={{ marginTop: 6 }}>
              Tip: entra a <b>Explorar eventos</b> y regístrate en uno.
            </div>
          </Empty>
        )}

        {!loading && !error && filtered.length > 0 && (
          <Grid>
            {filtered.map((insc) => {
              const st = statusInfo(insc);

              const tituloActividad = insc?.actividad?.titulo
                ? String(insc.actividad.titulo)
                : `Actividad ${String(insc?.actividadId || '')}`;

              const bannerUrl = insc?.actividad?.bannerUrl ? String(insc.actividad.bannerUrl) : '';
              const descripcion = insc?.actividad?.descripcion ? String(insc.actividad.descripcion) : '';

              return (
                <Card key={insc.id}>
                  <Banner $img={bannerUrl}>
                    <BannerTitle title={tituloActividad}>
                      {tituloActividad}
                    </BannerTitle>
                  </Banner>

                  <Body>
                    <Row>
                      <b>Estado</b>
                      <Badge $bg={st.bg} $border={st.border} $color={st.color}>
                        {st.label}
                      </Badge>
                    </Row>

                    <Row>
                      <b>Fecha</b>
                      <span>{insc?.fechaInscripcion || '—'}</span>
                    </Row>

                    {insc?.actividad?.fechaInicio && insc?.actividad?.fechaFin && (
                      <Row>
                        <b>Fechas</b>
                        <span>{insc.actividad.fechaInicio} → {insc.actividad.fechaFin}</span>
                      </Row>
                    )}

                    {insc?.actividad?.ubicacion && (
                      <Row>
                        <b>Ubicación</b>
                        <span>{insc.actividad.ubicacion}</span>
                      </Row>
                    )}

                    {descripcion && <Muted>{short(descripcion, 120)}</Muted>}

                    {!insc?.actividad && (
                      <Muted style={{ color: '#ef4444', fontWeight: 800 }}>
                        No se pudo cargar el detalle de la actividad (título/imagen). Revisa el endpoint de obtener actividad o permisos del backend.
                      </Muted>
                    )}
                  </Body>

                  <Actions>
                    {/* ✅ YA NO navega a una ruta (eso te mandaba al landing) */}
                    <Btn
                      onClick={() => setSelectedActivity(insc?.actividad || null)}
                      disabled={!insc?.actividad}
                      title={!insc?.actividad ? 'No se pudo cargar la actividad' : ''}
                    >
                      <FiExternalLink /> Ver evento
                    </Btn>

                    {/* ✅ Botón Pagar (placeholder) */}
                    <Btn
                      onClick={() => handlePagar(insc)}
                      disabled={!insc?.pendiente} // solo para pendientes (opcional)
                      title={!insc?.pendiente ? 'Disponible para inscripciones pendientes' : ''}
                    >
                      <FiCreditCard /> Pagar
                    </Btn>

                    <Btn
                      onClick={() => handleCertificado(insc.id)}
                      disabled={!insc.confirmada || busyId === insc.id}
                      title={!insc.confirmada ? 'Disponible cuando la inscripción esté confirmada' : ''}
                    >
                      <FiAward /> Certificado
                    </Btn>

                    <Btn
                      $danger
                      onClick={() => handleRetirar(insc.id)}
                      disabled={busyId === insc.id}
                    >
                      <FiTrash2 /> Retirar
                    </Btn>
                  </Actions>
                </Card>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* ✅ Modal de detalle para “Ver evento” */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </ParticipantLayout>
  );
};

export default ParticipantInscriptionsPage;
