// src/pages/organizer/ParticipantesPage.jsx
import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiSave,
  FiAlertCircle
} from 'react-icons/fi';
import OrganizerLayout from './OrganizerLayout';
import { useAttendanceDashboard } from '@/features/attendance/hooks/useAttendanceDashboard';

// ============================================
// UTILIDADES
// ============================================
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

const formatDateRange = (inicio, fin) => {
  if (!inicio) return '-';
  const startDate = new Date(inicio);
  const endDate = fin ? new Date(fin) : null;
  
  const startDay = startDate.getDate();
  const startMonth = startDate.toLocaleDateString('es-PE', { month: 'short' });
  
  if (endDate) {
    const endDay = endDate.getDate();
    const endMonth = endDate.toLocaleDateString('es-PE', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }
  
  return `${startDay} ${startMonth}`;
};

const getModalidadBadge = (modalidad) => {
  const modalidades = {
    PRESENCIAL: { color: '#10b981', bg: '#ecfdf5', label: 'Presencial' },
    VIRTUAL: { color: '#6366f1', bg: '#eef2ff', label: 'Virtual' },
    HIBRIDO: { color: '#f59e0b', bg: '#fffbeb', label: 'Híbrido' },
  };
  return modalidades[modalidad] || modalidades.PRESENCIAL;
};

const formatLastUpdate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'hace un momento';
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hoy ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return 'ayer';
  return formatDate(dateString);
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const ParticipantesPage = () => {
  const { 
    actividades, 
    loading, 
    error, 
    saving,
    refetch, 
    guardarAsistencia 
  } = useAttendanceDashboard();

  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [localParticipantes, setLocalParticipantes] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Actividad seleccionada
  const selectedActivity = useMemo(() => {
    return actividades.find(a => a.id === selectedActivityId) || null;
  }, [actividades, selectedActivityId]);

  // Participantes con estado local para edición
  const participantes = useMemo(() => {
    if (!selectedActivity) return [];
    
    const localState = localParticipantes[selectedActivityId] || {};
    
    return selectedActivity.participantes.map(p => ({
      ...p,
      presente: localState[p.inscripcionId] !== undefined 
        ? localState[p.inscripcionId] 
        : p.presente,
    }));
  }, [selectedActivity, localParticipantes, selectedActivityId]);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    if (!participantes.length) {
      return {
        totalInscritos: selectedActivity?.totalInscritos || 0,
        asistentes: selectedActivity?.asistentes || 0,
        tasaAsistencia: selectedActivity?.tasaAsistencia || 0,
      };
    }

    const presentes = participantes.filter(p => p.presente).length;
    const total = participantes.length;
    const tasa = total > 0 ? Math.round((presentes / total) * 100) : 0;

    return {
      totalInscritos: total,
      asistentes: presentes,
      tasaAsistencia: tasa,
    };
  }, [participantes, selectedActivity]);

  // Participantes filtrados
  const filteredParticipants = useMemo(() => {
    return participantes.filter(p => {
      const matchesSearch = 
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'Todos' ||
        (filterStatus === 'Presentes' && p.presente) ||
        (filterStatus === 'Ausentes' && !p.presente);
      
      return matchesSearch && matchesFilter;
    });
  }, [participantes, searchTerm, filterStatus]);

  // Toggle asistencia individual
  const toggleAsistencia = useCallback((inscripcionId) => {
    setLocalParticipantes(prev => {
      const activityState = prev[selectedActivityId] || {};
      const currentParticipant = participantes.find(p => p.inscripcionId === inscripcionId);
      const currentValue = activityState[inscripcionId] !== undefined 
        ? activityState[inscripcionId] 
        : currentParticipant?.presente || false;
      
      return {
        ...prev,
        [selectedActivityId]: {
          ...activityState,
          [inscripcionId]: !currentValue,
        },
      };
    });
    setHasChanges(true);
    setSuccessMessage('');
  }, [selectedActivityId, participantes]);

  // Marcar todos presentes/ausentes
  const toggleAll = useCallback((presente) => {
    if (!selectedActivityId || !participantes.length) return;
    
    const newState = {};
    participantes.forEach(p => {
      newState[p.inscripcionId] = presente;
    });
    
    setLocalParticipantes(prev => ({
      ...prev,
      [selectedActivityId]: newState,
    }));
    setHasChanges(true);
    setSuccessMessage('');
  }, [selectedActivityId, participantes]);

  // Guardar asistencia
  const handleGuardarAsistencia = useCallback(async () => {
    if (!selectedActivityId || !hasChanges) return;
    
    const result = await guardarAsistencia(selectedActivityId, participantes);
    
    if (result.success) {
      setSuccessMessage('✅ Asistencia guardada correctamente');
      setHasChanges(false);
      setLocalParticipantes(prev => ({
        ...prev,
        [selectedActivityId]: {},
      }));
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert(`Error: ${result.error}`);
    }
  }, [selectedActivityId, hasChanges, participantes, guardarAsistencia]);

  // Cambiar actividad seleccionada
  const handleActivityChange = useCallback((e) => {
    const newId = e.target.value;
    setSelectedActivityId(newId);
    setSearchTerm('');
    setFilterStatus('Todos');
    setSuccessMessage('');
  }, []);

  // Exportar lista
  const handleExportarLista = useCallback(() => {
    if (!selectedActivity || !filteredParticipants.length) return;
    
    const csvContent = [
      ['Nombre', 'Email', 'Fecha Inscripción', 'Asistencia'].join(','),
      ...filteredParticipants.map(p => [
        `"${p.nombre}"`,
        p.email,
        formatDate(p.fechaInscripcion),
        p.presente ? 'Presente' : 'Ausente',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participantes_${selectedActivity.titulo.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [selectedActivity, filteredParticipants]);

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <OrganizerLayout>
        <LoadingContainer>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <FiRefreshCw size={32} />
          </LoadingSpinner>
          <LoadingText>Cargando participantes...</LoadingText>
        </LoadingContainer>
      </OrganizerLayout>
    );
  }

  if (error) {
    return (
      <OrganizerLayout>
        <ErrorContainer>
          <FiAlertCircle size={48} color="#ef4444" />
          <ErrorTitle>Error al cargar datos</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={refetch}>
            <FiRefreshCw size={18} />
            Reintentar
          </RetryButton>
        </ErrorContainer>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <Container>
        {/* Header */}
        <Header>
          <HeaderContent>
            <Title>Participantes y Asistencia</Title>
            <Subtitle>Gestiona inscritos y registro de asistencia por actividad</Subtitle>
            <Breadcrumb>Inicio / Participantes y asistencia</Breadcrumb>
          </HeaderContent>
          <RefreshButton onClick={refetch} title="Actualizar datos">
            <FiRefreshCw size={20} />
          </RefreshButton>
        </Header>

        {/* Selector de Actividad */}
        <ActivitySelector
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SelectorLabel>Selecciona una Actividad</SelectorLabel>
          <ActivitySelect
            value={selectedActivityId}
            onChange={handleActivityChange}
          >
            <option value="">— Seleccionar actividad —</option>
            {actividades.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.titulo}
              </option>
            ))}
          </ActivitySelect>

          {selectedActivity && (
            <ActivityInfo>
              <InfoChip>
                <FiCalendar size={14} />
                {formatDateRange(selectedActivity.fechaInicio, selectedActivity.fechaFin)}
              </InfoChip>
              <ModalidadChip $modalidad={getModalidadBadge(selectedActivity.modalidad)}>
                <FiMapPin size={14} />
                {getModalidadBadge(selectedActivity.modalidad).label}
              </ModalidadChip>
              <InfoChip $muted>
                <FiClock size={14} />
                Actualizado: {formatLastUpdate(selectedActivity.ultimaActualizacion)}
              </InfoChip>
            </ActivityInfo>
          )}
        </ActivitySelector>

        {/* Contenido principal - Solo si hay actividad seleccionada */}
        <AnimatePresence mode="wait">
          {selectedActivity ? (
            <motion.div
              key={selectedActivityId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <StatsGrid>
                <StatCard>
                  <StatIcon $color="#E3F2FD">
                    <FiUsers size={24} color="#4f7cff" />
                  </StatIcon>
                  <StatContent>
                    <StatValue>{stats.totalInscritos}</StatValue>
                    <StatLabel>Total inscritos</StatLabel>
                  </StatContent>
                </StatCard>

                <StatCard>
                  <StatIcon $color="#E8F5E9">
                    <FiCheckCircle size={24} color="#10b981" />
                  </StatIcon>
                  <StatContent>
                    <StatValue>{stats.asistentes}</StatValue>
                    <StatLabel>Presentes</StatLabel>
                  </StatContent>
                </StatCard>

                <StatCard>
                  <StatIcon $color="#FFF3E0">
                    <FiClock size={24} color="#f59e0b" />
                  </StatIcon>
                  <StatContent>
                    <StatValue>{stats.tasaAsistencia}%</StatValue>
                    <StatLabel>Tasa de asistencia</StatLabel>
                    <ProgressBar>
                      <ProgressFill 
                        $width={stats.tasaAsistencia}
                        as={motion.div}
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.tasaAsistencia}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </ProgressBar>
                  </StatContent>
                </StatCard>
              </StatsGrid>

              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <SuccessAlert
                    as={motion.div}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {successMessage}
                  </SuccessAlert>
                )}
              </AnimatePresence>

              {/* Filtros y Búsqueda */}
              <FiltersBar>
                <SearchBar>
                  <FiSearch size={20} color="#6b7280" />
                  <SearchInput
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchBar>

                <FilterGroup>
                  {['Todos', 'Presentes', 'Ausentes'].map(filter => (
                    <FilterButton
                      key={filter}
                      $active={filterStatus === filter}
                      onClick={() => setFilterStatus(filter)}
                    >
                      {filter}
                      {filter === 'Presentes' && ` (${stats.asistentes})`}
                      {filter === 'Ausentes' && ` (${stats.totalInscritos - stats.asistentes})`}
                    </FilterButton>
                  ))}
                </FilterGroup>

                <ActionButtons>
                  <ActionButton 
                    onClick={handleGuardarAsistencia}
                    disabled={!hasChanges || saving}
                    $primary
                  >
                    {saving ? (
                      <>
                        <SpinnerSmall />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FiSave size={18} />
                        Guardar asistencia
                      </>
                    )}
                  </ActionButton>
                </ActionButtons>
              </FiltersBar>

              {/* Checkbox para marcar todos */}
              <SelectAllRow>
                <QuickActions>
                  <QuickActionBtn onClick={() => toggleAll(true)}>
                    Marcar todos presentes
                  </QuickActionBtn>
                  <QuickActionBtn onClick={() => toggleAll(false)}>
                    Marcar todos ausentes
                  </QuickActionBtn>
                </QuickActions>
                {hasChanges && (
                  <UnsavedBadge>
                    <FiAlertCircle size={14} />
                    Cambios sin guardar
                  </UnsavedBadge>
                )}
              </SelectAllRow>

              {/* Tabla de Participantes */}
              <TableCard>
                {filteredParticipants.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <Th $width="60px">Asist.</Th>
                        <Th>Participante</Th>
                        <Th $width="140px">Inscripción</Th>
                        <Th $width="100px" $center>Estado</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((participant) => (
                        <Tr 
                          key={participant.inscripcionId}
                          $presente={participant.presente}
                        >
                          <Td>
                            <CheckboxWrapper>
                              <HiddenCheckbox
                                type="checkbox"
                                checked={participant.presente}
                                onChange={() => toggleAsistencia(participant.inscripcionId)}
                              />
                              <StyledCheckbox 
                                $checked={participant.presente}
                                onClick={() => toggleAsistencia(participant.inscripcionId)}
                              >
                                {participant.presente && <FiCheckCircle size={16} />}
                              </StyledCheckbox>
                            </CheckboxWrapper>
                          </Td>
                          <Td>
                            <ParticipantInfo>
                              <ParticipantName>{participant.nombre || 'Sin nombre'}</ParticipantName>
                              <ParticipantEmail>{participant.email || '-'}</ParticipantEmail>
                            </ParticipantInfo>
                          </Td>
                          <Td>
                            <DateText>{formatDate(participant.fechaInscripcion)}</DateText>
                          </Td>
                          <Td $center>
                            <StatusBadge $presente={participant.presente}>
                              {participant.presente ? 'Presente' : 'Ausente'}
                            </StatusBadge>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <EmptyState>
                    <EmptyIcon>📭</EmptyIcon>
                    <EmptyText>
                      {participantes.length === 0 
                        ? 'No hay participantes inscritos en esta actividad'
                        : 'No se encontraron participantes con los filtros aplicados'
                      }
                    </EmptyText>
                  </EmptyState>
                )}
              </TableCard>

              {/* Botón Exportar */}
              {filteredParticipants.length > 0 && (
                <ExportSection>
                  <ExportButton onClick={handleExportarLista}>
                    <FiDownload size={18} />
                    Exportar lista ({filteredParticipants.length})
                  </ExportButton>
                </ExportSection>
              )}
            </motion.div>
          ) : (
            <EmptyActivityState
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <EmptyActivityIcon>📋</EmptyActivityIcon>
              <EmptyActivityTitle>Selecciona una actividad</EmptyActivityTitle>
              <EmptyActivityText>
                Elige una actividad del selector para ver y gestionar sus participantes
              </EmptyActivityText>
            </EmptyActivityState>
          )}
        </AnimatePresence>
      </Container>
    </OrganizerLayout>
  );
};

// ============================================
// STYLED COMPONENTS
// ============================================
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const RefreshButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: #4f7cff;
    border-color: #4f7cff;
  }
`;

const ActivitySelector = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
`;

const SelectorLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
`;

const ActivitySelect = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #1a1a1a;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f7cff;
    box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const ActivityInfo = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const InfoChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.$muted ? '#f9fafb' : '#f0f4ff'};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.$muted ? '#6b7280' : '#4f7cff'};
  font-weight: 500;
`;

const ModalidadChip = styled(InfoChip)`
  background: ${props => props.$modalidad?.bg || '#f9fafb'};
  color: ${props => props.$modalidad?.color || '#6b7280'};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4f7cff, #3b63e0);
  border-radius: 4px;
`;

const SuccessAlert = styled.div`
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 14px 20px;
  color: #059669;
  font-weight: 500;
  margin-bottom: 20px;
`;

const FiltersBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  flex: 1;
  max-width: 400px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #4f7cff;
    box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.1);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: #1a1a1a;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 10px 18px;
  background: ${props => props.$active ? '#4f7cff' : 'white'};
  border: 1px solid ${props => props.$active ? '#4f7cff' : '#e5e7eb'};
  border-radius: 10px;
  color: ${props => props.$active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#3b63e0' : '#f9fafb'};
    border-color: ${props => props.$active ? '#3b63e0' : '#d1d5db'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.$primary ? '#4f7cff' : 'white'};
  border: 1px solid ${props => props.$primary ? '#4f7cff' : '#e5e7eb'};
  border-radius: 12px;
  color: ${props => props.$primary ? 'white' : '#6b7280'};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${props => props.$primary ? '#3b63e0' : '#f9fafb'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SpinnerSmall = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
`;

const QuickActionBtn = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4f7cff;
    color: #4f7cff;
    background: #f0f4ff;
  }
`;

const UnsavedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  color: #92400e;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 16px 20px;
  text-align: ${props => props.$center ? 'center' : 'left'};
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  width: ${props => props.$width || 'auto'};
`;

const Tr = styled.tr`
  background: ${props => props.$presente ? 'rgba(16, 185, 129, 0.04)' : 'white'};
  transition: background 0.15s;

  &:hover {
    background: ${props => props.$presente ? 'rgba(16, 185, 129, 0.08)' : '#f9fafb'};
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  text-align: ${props => props.$center ? 'center' : 'left'};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.$checked ? '#10b981' : '#d1d5db'};
  border-radius: 8px;
  background: ${props => props.$checked ? '#10b981' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: white;

  &:hover {
    border-color: ${props => props.$checked ? '#059669' : '#4f7cff'};
    transform: scale(1.05);
  }
`;

const ParticipantInfo = styled.div``;

const ParticipantName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const ParticipantEmail = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const DateText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$presente ? '#ecfdf5' : '#f9fafb'};
  color: ${props => props.$presente ? '#059669' : '#6b7280'};
  border: 1px solid ${props => props.$presente ? '#a7f3d0' : '#e5e7eb'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const ExportSection = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const ExportButton = styled.button`
  padding: 12px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #4f7cff;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f4ff;
    border-color: #4f7cff;
    transform: translateY(-1px);
  }
`;

const EmptyActivityState = styled.div`
  background: white;
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  border: 2px dashed #e5e7eb;
`;

const EmptyActivityIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 20px;
`;

const EmptyActivityTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const EmptyActivityText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
`;

// Loading States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
`;

const LoadingSpinner = styled(motion.div)`
  color: #4f7cff;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

// Error States
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  text-align: center;
`;

const ErrorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  background: #4f7cff;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3b63e0;
    transform: translateY(-1px);
  }
`;

export default ParticipantesPage;