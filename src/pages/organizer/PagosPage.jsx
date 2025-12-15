// src/pages/organizer/PagosPage.jsx
// Gestión de pagos para organizador: lista pagos y permite crear pagos Yape.

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';
import OrganizerSidebar from './OrganizerSidebar';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { paymentsApi } from '../../features/participant/api/paymentsApi';
import OrganizerPaymentModal from './OrganizerPaymentModal';
import { AlertError, AlertSuccess } from '@/shared/ui/components/Alert';

const PagosPage = () => {
  const { user } = useAuth();

  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');

  const [estadosPago, setEstadosPago] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [listaPagos, listaEstados, listaMetodos] = await Promise.all([
        paymentsApi.listarPagos(),
        paymentsApi.listarEstadosPago().catch(() => []),
        paymentsApi.listarMetodosPago().catch(() => []),
      ]);

      setPagos(listaPagos || []);
      setEstadosPago(listaEstados || []);
      setMetodosPago(listaMetodos || []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error cargando pagos:', e);
      setErrorModal({
        open: true,
        message:
          e?.response?.data?.message ||
          e?.message ||
          'No se pudieron cargar los pagos. Inténtalo nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estadosMap = useMemo(
    () =>
      Object.fromEntries((estadosPago || []).map((e) => [String(e.id), e])),
    [estadosPago],
  );

  const metodosMap = useMemo(
    () =>
      Object.fromEntries((metodosPago || []).map((m) => [String(m.id), m])),
    [metodosPago],
  );

  const getEstadoInfo = (estadoId) => {
    if (!estadoId) return null;
    return estadosMap[String(estadoId)] || null;
  };

  const getMetodoInfo = (metodoId) => {
    if (!metodoId) return null;
    return metodosMap[String(metodoId)] || null;
  };

  const getEstadoConfig = (estadoId) => {
    const estado = getEstadoInfo(estadoId);
    const codigo = String(estado?.codigo || '').toUpperCase();
    const label = estado?.etiqueta || estado?.codigo || '-';

    if (codigo.includes('PEND')) {
      return { color: '#92400e', bg: '#fef3c7', label: label || 'Pendiente' };
    }
    if (codigo.includes('APROB')) {
      return { color: '#065f46', bg: '#d1fae5', label: label || 'Aprobado' };
    }
    if (codigo.includes('RECHAZ')) {
      return { color: '#991b1b', bg: '#fee2e2', label: label || 'Rechazado' };
    }
    return { color: '#4b5563', bg: '#e5e7eb', label: label || '-' };
  };

  const getMetodoConfig = (metodoId) => {
    const metodo = getMetodoInfo(metodoId);
    const codigo = String(metodo?.codigo || '').toUpperCase();
    const label = metodo?.etiqueta || metodo?.codigo || '-';

    if (codigo.includes('YAPE')) {
      return { color: '#7c3aed', bg: '#ede9fe', label: label || 'Yape' };
    }
    if (codigo.includes('PLIN')) {
      return { color: '#06b6d4', bg: '#cffafe', label: label || 'Plin' };
    }
    if (codigo.includes('TRANS')) {
      return {
        color: '#2563eb',
        bg: '#dbeafe',
        label: label || 'Transferencia',
      };
    }
    if (codigo.includes('EFECT')) {
      return { color: '#16a34a', bg: '#dcfce7', label: label || 'Efectivo' };
    }
    return { color: '#4b5563', bg: '#e5e7eb', label: label || '-' };
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (pagos || []).filter((pago) => {
      const estadoInfo = getEstadoInfo(pago.estadoId);
      const codigoEstado = String(estadoInfo?.codigo || '').toUpperCase();

      if (estadoFilter !== 'todos') {
        if (String(pago.estadoId || '') !== estadoFilter) return false;
      }

      if (!q) return true;

      return (
        String(pago.usuarioDni || '').toLowerCase().includes(q) ||
        String(pago.inscripcionId || '').toLowerCase().includes(q) ||
        String(pago.actividadId || '').toLowerCase().includes(q) ||
        String(pago.referenciaExt || '').toLowerCase().includes(q) ||
        codigoEstado.toLowerCase().includes(q)
      );
    });
  }, [pagos, search, estadoFilter, estadosMap]);

  const stats = useMemo(() => {
    const total = pagos.length;
    let pendientes = 0;
    let aprobados = 0;
    let montoTotal = 0;

    (pagos || []).forEach((pago) => {
      const estadoInfo = getEstadoInfo(pago.estadoId);
      const codigo = String(estadoInfo?.codigo || '').toUpperCase();

      if (codigo.includes('PEND')) pendientes += 1;
      if (codigo.includes('APROB')) {
        aprobados += 1;
        montoTotal += pago.monto || 0;
      }
    });

    return { total, pendientes, aprobados, montoTotal };
  }, [pagos, estadosMap]);

  const formatMonto = (monto, moneda) =>
    `${moneda || 'PEN'} ${(monto || 0).toFixed(2)}`;

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  const handleExport = () => {
    setSuccessModal({
      open: true,
      message: 'Exportar aún no está implementado (pendiente).',
    });
  };

  const handleCreateSuccess = (message) => {
    setSuccessModal({
      open: true,
      message: message || 'Pago creado correctamente.',
    });
    setCreateModalOpen(false);
    loadData();
  };

  const handleCreateError = (message) => {
    setErrorModal({
      open: true,
      message: message || 'No se pudo crear el pago.',
    });
  };

  return (
    <>
      <OrganizerSidebar />

      <Page>
        <Inner>
          <Header>
            <div>
              <Title>Gestión de Pagos</Title>
              <Subtitle>
                Administra y verifica los pagos de tus actividades
              </Subtitle>
              <Breadcrumb>
                Inicio / <strong>Pagos</strong>
              </Breadcrumb>
            </div>

            <HeaderActions>
              <IconButton onClick={loadData} disabled={loading} title="Actualizar">
                <FiRefreshCw />
              </IconButton>
              <PrimaryButton onClick={handleExport}>
                <FiDownload />
                Exportar
              </PrimaryButton>
              <PrimaryButton $primary onClick={() => setCreateModalOpen(true)}>
                <FiDollarSign />
                Nuevo pago
              </PrimaryButton>
            </HeaderActions>
          </Header>

          <StatsRow>
            <StatCard>
              <StatLabel>Total pagos</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Pendientes</StatLabel>
              <StatValue>{stats.pendientes}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Aprobados</StatLabel>
              <StatValue>{stats.aprobados}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Recaudado</StatLabel>
              <StatValue>{formatMonto(stats.montoTotal, 'PEN')}</StatValue>
            </StatCard>
          </StatsRow>

          <FiltersRow>
            <SearchBox>
              <FiSearch />
              <input
                placeholder="Buscar por DNI, inscripción, actividad o referencia"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchBox>

            <Select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              {estadosPago.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.etiqueta || estado.codigo}
                </option>
              ))}
            </Select>
          </FiltersRow>

          <TableCard>
            {loading ? (
              <Empty>
                <p>Cargando pagos...</p>
              </Empty>
            ) : filtered.length === 0 ? (
              <Empty>
                <p>No hay pagos para mostrar.</p>
              </Empty>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Participante</Th>
                    <Th>Actividad</Th>
                    <Th>Inscripción</Th>
                    <Th>Monto</Th>
                    <Th>Método</Th>
                    <Th>Fecha</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pago) => {
                    const estadoCfg = getEstadoConfig(pago.estadoId);
                    const metodoCfg = getMetodoConfig(pago.metodoId);

                    return (
                      <tr key={pago.idPago}>
                        <Td>
                          <PrimaryText>
                            {pago.usuarioDni
                              ? `DNI ${pago.usuarioDni}`
                              : pago.usuarioId || '-'}
                          </PrimaryText>
                        </Td>
                        <Td>
                          <SecondaryText>
                            {pago.actividadId
                              ? String(pago.actividadId).slice(0, 12)
                              : '-'}
                          </SecondaryText>
                        </Td>
                        <Td>
                          <SecondaryText>
                            {pago.inscripcionId
                              ? String(pago.inscripcionId).slice(0, 16)
                              : '-'}
                          </SecondaryText>
                        </Td>
                        <Td>
                          <PrimaryText>
                            {formatMonto(pago.monto, pago.moneda)}
                          </PrimaryText>
                        </Td>
                        <Td>
                          <Badge $bg={metodoCfg.bg} $color={metodoCfg.color}>
                            {metodoCfg.label}
                          </Badge>
                        </Td>
                        <Td>
                          <SecondaryText>{formatFecha(pago.fechaPago)}</SecondaryText>
                        </Td>
                        <Td>
                          <Badge $bg={estadoCfg.bg} $color={estadoCfg.color}>
                            {estadoCfg.label}
                          </Badge>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </TableCard>
        </Inner>
      </Page>

      <OrganizerPaymentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />

      <AlertSuccess
        open={successModal.open}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: '' })}
      />

      <AlertError
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: '' })}
      />
    </>
  );
};

export default PagosPage;

// Styles

const Page = styled.div`
  margin-left: 260px;
  min-height: 100vh;
  padding: 40px;
  background: #f8fafc;

  @media (max-width: 968px) {
    margin-left: 0;
    padding-top: 110px;
    padding-inline: 20px;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 0 0 6px 0;
  color: #6b7280;
`;

const Breadcrumb = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;

  strong {
    color: #4b5563;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: #4f46e5;
    color: #4f46e5;
    background: #f9fafb;
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$primary ? '#4f46e5' : '#e5e7eb')};
  background: ${(p) => (p.$primary ? '#4f46e5' : '#ffffff')};
  color: ${(p) => (p.$primary ? '#ffffff' : '#111827')};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$primary ? '#4338ca' : '#f9fafb')};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: #111827;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;

  svg {
    color: #9ca3af;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.95rem;
  }
`;

const Select = styled.select`
  min-width: 200px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  font-size: 0.9rem;
  background: #ffffff;
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 14px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
`;

const PrimaryText = styled.div`
  font-weight: 600;
  color: #111827;
`;

const SecondaryText = styled.div`
  color: #6b7280;
  font-size: 0.85rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const Empty = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: #6b7280;
`;

