// src/pages/organizer/PagosPage.jsx
// VERSION MOCK - Solo datos de prueba, sin llamadas a API

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDollarSign,
  FiSearch,
  FiDownload,
  FiEye,
  FiCheck,
  FiX,
  FiUser,
  FiClock,
  FiRefreshCw,
  FiFileText
} from 'react-icons/fi';
import OrganizerSidebar from './OrganizerSidebar';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { AlertSuccess, AlertConfirmDelete } from "@/shared/ui/components/Alert";

const PagosPage = () => {
  const { user } = useAuth();
  
  // Estados
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [filters, setFilters] = useState({
    busqueda: '',
    actividad: 'todas',
    estado: 'todos'
  });
  
  // Modales
  const [selectedPago, setSelectedPago] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, pago: null, action: null });
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });

  // Datos mock
  const datosMock = [
    {
      id: 1,
      participante: { nombres: 'Juan Carlos', apellidos: 'Rodríguez Pérez', dni: '73456789', correo: 'juan@email.com' },
      actividad: { id: 1, titulo: 'Curso de React Avanzado' },
      monto: 150.00,
      metodoPago: 'YAPE',
      numeroOperacion: 'YP123456789',
      fechaPago: '2024-12-10T14:30:00',
      estado: 'PENDIENTE',
      comprobante: 'https://picsum.photos/400/300'
    },
    {
      id: 2,
      participante: { nombres: 'María Elena', apellidos: 'García López', dni: '74567890', correo: 'maria@email.com' },
      actividad: { id: 1, titulo: 'Curso de React Avanzado' },
      monto: 150.00,
      metodoPago: 'TRANSFERENCIA',
      numeroOperacion: 'TRF987654321',
      fechaPago: '2024-12-09T10:15:00',
      estado: 'APROBADO',
      comprobante: null
    },
    {
      id: 3,
      participante: { nombres: 'Pedro', apellidos: 'Sánchez Díaz', dni: '75678901', correo: 'pedro@email.com' },
      actividad: { id: 2, titulo: 'Taller de Node.js' },
      monto: 80.00,
      metodoPago: 'YAPE',
      numeroOperacion: 'YP456789123',
      fechaPago: '2024-12-08T16:45:00',
      estado: 'RECHAZADO',
      comprobante: 'https://picsum.photos/400/301'
    },
    {
      id: 4,
      participante: { nombres: 'Ana Lucía', apellidos: 'Torres Mendoza', dni: '76789012', correo: 'ana@email.com' },
      actividad: { id: 2, titulo: 'Taller de Node.js' },
      monto: 80.00,
      metodoPago: 'PLIN',
      numeroOperacion: 'PL789456123',
      fechaPago: '2024-12-11T09:00:00',
      estado: 'PENDIENTE',
      comprobante: 'https://picsum.photos/400/302'
    },
    {
      id: 5,
      participante: { nombres: 'Carlos Alberto', apellidos: 'Mendez Quispe', dni: '77890123', correo: 'carlos@email.com' },
      actividad: { id: 1, titulo: 'Curso de React Avanzado' },
      monto: 150.00,
      metodoPago: 'EFECTIVO',
      numeroOperacion: 'EF001234',
      fechaPago: '2024-12-12T11:30:00',
      estado: 'APROBADO',
      comprobante: null
    }
  ];

  // Actividades mock para el filtro
  const actividadesMock = [
    { id: 1, titulo: 'Curso de React Avanzado' },
    { id: 2, titulo: 'Taller de Node.js' }
  ];

  // Cargar datos mock
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagos(datosMock);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setPagos(datosMock);
      setLoading(false);
    }, 500);
  };

  // Filtrar pagos
  const pagosFiltrados = pagos.filter(pago => {
    const matchBusqueda = filters.busqueda === '' || 
      pago.participante?.nombres?.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      pago.participante?.apellidos?.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      pago.participante?.dni?.includes(filters.busqueda) ||
      pago.numeroOperacion?.toLowerCase().includes(filters.busqueda.toLowerCase());
    
    const matchActividad = filters.actividad === 'todas' || 
      pago.actividad?.id?.toString() === filters.actividad;
    
    const matchEstado = filters.estado === 'todos' || 
      pago.estado === filters.estado;
    
    return matchBusqueda && matchActividad && matchEstado;
  });

  // Estadísticas
  const estadisticas = {
    total: pagos.length,
    pendientes: pagos.filter(p => p.estado === 'PENDIENTE').length,
    aprobados: pagos.filter(p => p.estado === 'APROBADO').length,
    rechazados: pagos.filter(p => p.estado === 'RECHAZADO').length,
    montoTotal: pagos.filter(p => p.estado === 'APROBADO').reduce((acc, p) => acc + (p.monto || 0), 0)
  };

  // Handlers
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      busqueda: '',
      actividad: 'todas',
      estado: 'todos'
    });
  };

  const handleViewDetail = (pago) => {
    setSelectedPago(pago);
    setIsDetailModalOpen(true);
  };

  const handleAprobar = (pago) => {
    setConfirmModal({ open: true, pago, action: 'aprobar' });
  };

  const handleRechazar = (pago) => {
    setConfirmModal({ open: true, pago, action: 'rechazar' });
  };

  const confirmAction = () => {
    if (!confirmModal.pago) return;
    
    // Actualizar estado local (mock)
    setPagos(prev => prev.map(p => 
      p.id === confirmModal.pago.id 
        ? { ...p, estado: confirmModal.action === 'aprobar' ? 'APROBADO' : 'RECHAZADO' }
        : p
    ));
    
    setSuccessModal({
      open: true,
      message: `Pago ${confirmModal.action === 'aprobar' ? 'aprobado' : 'rechazado'} correctamente`
    });
    
    setConfirmModal({ open: false, pago: null, action: null });
  };

  const handleExportar = () => {
    setSuccessModal({ open: true, message: 'Lista de pagos exportada correctamente (mock)' });
  };

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatMonto = (monto) => `S/ ${(monto || 0).toFixed(2)}`;

  const getEstadoConfig = (estado) => {
    const configs = {
      PENDIENTE: { color: '#f59e0b', bg: '#fef3c7', label: 'Pendiente' },
      APROBADO: { color: '#10b981', bg: '#d1fae5', label: 'Aprobado' },
      RECHAZADO: { color: '#ef4444', bg: '#fee2e2', label: 'Rechazado' }
    };
    return configs[estado] || { color: '#6b7280', bg: '#f3f4f6', label: estado };
  };

  const getMetodoPagoConfig = (metodo) => {
    const configs = {
      YAPE: { color: '#7c3aed', bg: '#ede9fe', label: 'Yape' },
      PLIN: { color: '#06b6d4', bg: '#cffafe', label: 'Plin' },
      TRANSFERENCIA: { color: '#3b82f6', bg: '#dbeafe', label: 'Transferencia' },
      EFECTIVO: { color: '#22c55e', bg: '#dcfce7', label: 'Efectivo' }
    };
    return configs[metodo] || { color: '#6b7280', bg: '#f3f4f6', label: metodo };
  };

  return (
    <>
      <OrganizerSidebar />

      <PageContainer>
        <Container>
          {/* Header */}
          <Header>
            <HeaderContent>
              <Title>Gestión de Pagos</Title>
              <Subtitle>Administra y verifica los pagos de tus actividades</Subtitle>
              <Breadcrumb>Inicio / <strong>Pagos</strong></Breadcrumb>
            </HeaderContent>

            <HeaderActions>
              <RefreshButton onClick={handleRefresh} disabled={loading}>
                <FiRefreshCw size={18} />
              </RefreshButton>
              <ExportButton onClick={handleExportar}>
                <FiDownload size={18} />
                Exportar
              </ExportButton>
            </HeaderActions>
          </Header>

          {/* Estadísticas */}
          <StatsGrid>
            <StatCard $color="#4f7cff">
              <StatIcon><FiDollarSign /></StatIcon>
              <StatInfo>
                <StatValue>{estadisticas.total}</StatValue>
                <StatLabel>Total Pagos</StatLabel>
              </StatInfo>
            </StatCard>

            <StatCard $color="#f59e0b">
              <StatIcon><FiClock /></StatIcon>
              <StatInfo>
                <StatValue>{estadisticas.pendientes}</StatValue>
                <StatLabel>Pendientes</StatLabel>
              </StatInfo>
            </StatCard>

            <StatCard $color="#10b981">
              <StatIcon><FiCheck /></StatIcon>
              <StatInfo>
                <StatValue>{estadisticas.aprobados}</StatValue>
                <StatLabel>Aprobados</StatLabel>
              </StatInfo>
            </StatCard>

            <StatCard $color="#10b981">
              <StatIcon><FiDollarSign /></StatIcon>
              <StatInfo>
                <StatValue>{formatMonto(estadisticas.montoTotal)}</StatValue>
                <StatLabel>Recaudado</StatLabel>
              </StatInfo>
            </StatCard>
          </StatsGrid>

          {/* Filtros */}
          <FiltersCard>
            <FiltersRow>
              <SearchInput>
                <FiSearch />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI u operación..."
                  value={filters.busqueda}
                  onChange={(e) => handleFilterChange('busqueda', e.target.value)}
                />
              </SearchInput>

              <FilterSelect
                value={filters.actividad}
                onChange={(e) => handleFilterChange('actividad', e.target.value)}
              >
                <option value="todas">Todas las actividades</option>
                {actividadesMock.map(act => (
                  <option key={act.id} value={act.id}>{act.titulo}</option>
                ))}
              </FilterSelect>

              <FilterSelect
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
              </FilterSelect>

              <ClearFiltersButton onClick={clearFilters}>
                <FiX size={16} />
                Limpiar
              </ClearFiltersButton>
            </FiltersRow>
          </FiltersCard>

          {/* Loading */}
          {loading && (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Cargando pagos...</LoadingText>
            </LoadingContainer>
          )}

          {/* Tabla de pagos */}
          {!loading && (
            <>
              <ResultsHeader>
                <ResultsTitle>Lista de pagos</ResultsTitle>
                <ResultsCount>
                  Mostrando <strong>{pagosFiltrados.length}</strong> de {pagos.length} pagos
                </ResultsCount>
              </ResultsHeader>

              {pagosFiltrados.length > 0 ? (
                <TableCard>
                  <Table>
                    <thead>
                      <Tr>
                        <Th>Participante</Th>
                        <Th>Actividad</Th>
                        <Th>Monto</Th>
                        <Th>Método</Th>
                        <Th>Fecha</Th>
                        <Th>Estado</Th>
                        <Th width="140px">Acciones</Th>
                      </Tr>
                    </thead>
                    <tbody>
                      {pagosFiltrados.map((pago, index) => {
                        const estadoConfig = getEstadoConfig(pago.estado);
                        const metodoConfig = getMetodoPagoConfig(pago.metodoPago);
                        
                        return (
                          <Tr
                            as={motion.tr}
                            key={pago.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Td>
                              <ParticipantInfo>
                                <ParticipantName>
                                  {pago.participante?.nombres} {pago.participante?.apellidos}
                                </ParticipantName>
                                <ParticipantDNI>DNI: {pago.participante?.dni}</ParticipantDNI>
                              </ParticipantInfo>
                            </Td>
                            <Td>
                              <ActividadName>{pago.actividad?.titulo}</ActividadName>
                            </Td>
                            <Td>
                              <Monto>{formatMonto(pago.monto)}</Monto>
                            </Td>
                            <Td>
                              <MetodoBadge $config={metodoConfig}>
                                {metodoConfig.label}
                              </MetodoBadge>
                            </Td>
                            <Td>
                              <FechaText>{formatDate(pago.fechaPago)}</FechaText>
                            </Td>
                            <Td>
                              <EstadoBadge $config={estadoConfig}>
                                {estadoConfig.label}
                              </EstadoBadge>
                            </Td>
                            <Td>
                              <ActionsCell>
                                <ActionButton
                                  onClick={() => handleViewDetail(pago)}
                                  title="Ver detalles"
                                  $variant="view"
                                >
                                  <FiEye size={16} />
                                </ActionButton>
                                
                                {pago.estado === 'PENDIENTE' && (
                                  <>
                                    <ActionButton
                                      onClick={() => handleAprobar(pago)}
                                      title="Aprobar pago"
                                      $variant="approve"
                                    >
                                      <FiCheck size={16} />
                                    </ActionButton>
                                    <ActionButton
                                      onClick={() => handleRechazar(pago)}
                                      title="Rechazar pago"
                                      $variant="reject"
                                    >
                                      <FiX size={16} />
                                    </ActionButton>
                                  </>
                                )}
                              </ActionsCell>
                            </Td>
                          </Tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </TableCard>
              ) : (
                <EmptyState>
                  <EmptyIcon>💰</EmptyIcon>
                  <EmptyTitle>No hay pagos</EmptyTitle>
                  <EmptyText>
                    {filters.busqueda || filters.actividad !== 'todas' || filters.estado !== 'todos'
                      ? 'No se encontraron pagos con los filtros aplicados'
                      : 'Aún no hay pagos registrados'}
                  </EmptyText>
                </EmptyState>
              )}
            </>
          )}
        </Container>
      </PageContainer>

      {/* Modal de Detalle */}
      <AnimatePresence>
        {isDetailModalOpen && selectedPago && (
          <ModalOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailModalOpen(false)}
          >
            <ModalContent
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Detalle del Pago</ModalTitle>
                <CloseButton onClick={() => setIsDetailModalOpen(false)}>
                  <FiX size={20} />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <DetailSection>
                  <DetailSectionTitle>
                    <FiUser /> Participante
                  </DetailSectionTitle>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>Nombre completo</DetailLabel>
                      <DetailValue>
                        {selectedPago.participante?.nombres} {selectedPago.participante?.apellidos}
                      </DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>DNI</DetailLabel>
                      <DetailValue>{selectedPago.participante?.dni}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Correo</DetailLabel>
                      <DetailValue>{selectedPago.participante?.correo}</DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailSection>

                <DetailSection>
                  <DetailSectionTitle>
                    <FiDollarSign /> Información del Pago
                  </DetailSectionTitle>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>Actividad</DetailLabel>
                      <DetailValue>{selectedPago.actividad?.titulo}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Monto</DetailLabel>
                      <DetailValue $highlight>{formatMonto(selectedPago.monto)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Método de pago</DetailLabel>
                      <MetodoBadge $config={getMetodoPagoConfig(selectedPago.metodoPago)}>
                        {getMetodoPagoConfig(selectedPago.metodoPago).label}
                      </MetodoBadge>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>N° Operación</DetailLabel>
                      <DetailValue>{selectedPago.numeroOperacion || '-'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Fecha de pago</DetailLabel>
                      <DetailValue>{formatDate(selectedPago.fechaPago)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Estado</DetailLabel>
                      <EstadoBadge $config={getEstadoConfig(selectedPago.estado)}>
                        {getEstadoConfig(selectedPago.estado).label}
                      </EstadoBadge>
                    </DetailItem>
                  </DetailGrid>
                </DetailSection>

                {selectedPago.comprobante && (
                  <DetailSection>
                    <DetailSectionTitle>
                      <FiFileText /> Comprobante
                    </DetailSectionTitle>
                    <ComprobantePreview>
                      <img src={selectedPago.comprobante} alt="Comprobante de pago" />
                    </ComprobantePreview>
                  </DetailSection>
                )}
              </ModalBody>

              {selectedPago.estado === 'PENDIENTE' && (
                <ModalFooter>
                  <RejectButton onClick={() => {
                    setIsDetailModalOpen(false);
                    handleRechazar(selectedPago);
                  }}>
                    <FiX size={18} />
                    Rechazar
                  </RejectButton>
                  <ApproveButton onClick={() => {
                    setIsDetailModalOpen(false);
                    handleAprobar(selectedPago);
                  }}>
                    <FiCheck size={18} />
                    Aprobar Pago
                  </ApproveButton>
                </ModalFooter>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Modal de confirmación */}
      <AlertConfirmDelete
        open={confirmModal.open}
        message={
          confirmModal.action === 'aprobar'
            ? `¿Confirmas aprobar el pago de ${confirmModal.pago?.participante?.nombres}?`
            : `¿Confirmas rechazar el pago de ${confirmModal.pago?.participante?.nombres}?`
        }
        onCancel={() => setConfirmModal({ open: false, pago: null, action: null })}
        onConfirm={confirmAction}
      />

      <AlertSuccess
        open={successModal.open}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: '' })}
      />
    </>
  );
};

export default PagosPage;

/* ============================================
   🎨 STYLED COMPONENTS
============================================ */

const PageContainer = styled.div`
  margin-left: 260px;
  min-height: 100vh;
  padding: 40px;
  background: #f8fafc;

  @media (max-width: 968px) {
    margin-left: 0;
    padding-top: 110px;
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;

  @media (max-width: 968px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;

  @media (max-width: 968px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: #64748b;
  margin: 0 0 8px 0;
`;

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;

  strong {
    color: #475569;
    font-weight: 600;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const RefreshButton = styled.button`
  width: 44px;
  height: 44px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    color: #4f7cff;
    border-color: #4f7cff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #4f7cff;
    color: #4f7cff;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => props.$color};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f7cff;
  font-size: 1.25rem;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #4f7cff;
    background: white;
  }

  svg {
    color: #94a3b8;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.95rem;
    color: #1a1a1a;
    outline: none;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #374151;
  cursor: pointer;
  min-width: 180px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f7cff;
    background: white;
  }
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: transparent;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #ef4444;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top-color: #4f7cff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #64748b;
`;

const ResultsHeader = styled.div`
  margin-bottom: 16px;
`;

const ResultsTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px 0;
`;

const ResultsCount = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;

  strong {
    color: #4f7cff;
    font-weight: 700;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: ${props => props.width || 'auto'};
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

const ParticipantInfo = styled.div``;

const ParticipantName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
`;

const ParticipantDNI = styled.div`
  font-size: 0.8rem;
  color: #64748b;
`;

const ActividadName = styled.div`
  font-size: 0.9rem;
  color: #374151;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Monto = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #10b981;
`;

const MetodoBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.$config.color};
  background: ${props => props.$config.bg};
`;

const FechaText = styled.div`
  font-size: 0.85rem;
  color: #64748b;
`;

const EstadoBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.$config.color};
  background: ${props => props.$config.bg};
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  background: ${props => {
    if (props.$variant === 'view') return '#f0f9ff';
    if (props.$variant === 'approve') return '#ecfdf5';
    if (props.$variant === 'reject') return '#fef2f2';
    return '#f8fafc';
  }};

  color: ${props => {
    if (props.$variant === 'view') return '#0ea5e9';
    if (props.$variant === 'approve') return '#10b981';
    if (props.$variant === 'reject') return '#ef4444';
    return '#64748b';
  }};

  &:hover {
    background: ${props => {
      if (props.$variant === 'view') return '#0ea5e9';
      if (props.$variant === 'approve') return '#10b981';
      if (props.$variant === 'reject') return '#ef4444';
      return '#e2e8f0';
    }};
    color: white;
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px;
  text-align: center;
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

/* Modal Styles */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailSectionTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div``;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 0.95rem;
  font-weight: ${props => props.$highlight ? '700' : '600'};
  color: ${props => props.$highlight ? '#10b981' : '#1a1a2e'};
`;

const ComprobantePreview = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  
  img {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
`;

const RejectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #fecaca;
  border-radius: 10px;
  color: #ef4444;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }
`;

const ApproveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #10b981;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;