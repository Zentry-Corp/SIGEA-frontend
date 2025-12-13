import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import OrganizerLayout from './OrganizerLayout';

const ParticipantesPage = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Datos de ejemplo
  const activities = [
    { id: 1, nombre: 'Curso Avanzado de Sostenibilidad Ambiental' },
    { id: 2, nombre: 'Taller de Investigación Científica' },
    { id: 3, nombre: 'Seminario de Innovación Tecnológica' },
  ];

  const [stats, setStats] = useState({
    totalInscritos: 5,
    asistentes: 2,
    tasaAsistencia: 40
  });

  const [participants, setParticipants] = useState([
    {
      id: 1,
      nombre: 'María García López',
      email: 'maria.garcia@unas.edu.pe',
      registro: '02 Feb 2025',
      pago: 'Pagado',
      pagoColor: '#10b981',
      asistencia: false
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza Ruiz',
      email: 'carlos.mendoza@unas.edu.pe',
      registro: '03 Feb 2025',
      pago: 'Pendiente',
      pagoColor: '#f59e0b',
      asistencia: true
    },
    {
      id: 3,
      nombre: 'Ana Fernández Torres',
      email: 'ana.fernandez@unas.edu.pe',
      registro: '04 Feb 2025',
      pago: 'Pagado',
      pagoColor: '#10b981',
      asistencia: true
    },
    {
      id: 4,
      nombre: 'Roberto Sánchez Pérez',
      email: 'roberto.sanchez@unas.edu.pe',
      registro: '05 Feb 2025',
      pago: 'Exonerado',
      pagoColor: '#6b7280',
      asistencia: false
    },
    {
      id: 5,
      nombre: 'Julieta Morales Díaz',
      email: 'julieta.morales@unas.edu.pe',
      registro: '06 Feb 2025',
      pago: 'Pendiente',
      pagoColor: '#f59e0b',
      asistencia: false
    }
  ]);

  const toggleAsistencia = (id) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === id ? { ...p, asistencia: !p.asistencia } : p
      )
    );
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || 
                         (filterStatus === 'Pagados' && p.pago === 'Pagado') ||
                         (filterStatus === 'Pendientes' && p.pago === 'Pendiente') ||
                         (filterStatus === 'Ausentes' && !p.asistencia) ||
                         (filterStatus === 'Presentes' && p.asistencia);
    return matchesSearch && matchesFilter;
  });

  const handleGuardarAsistencia = () => {
    alert('✅ Asistencia guardada correctamente');
  };

  const handleVerificarPagos = () => {
    alert('💰 Redirigiendo a verificación de pagos...');
  };

  const handleExportarLista = () => {
    alert('📥 Exportando lista de participantes...');
  };

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Participantes y Asistencia</Title>
            <Subtitle>Gestiona inscritos, pagos y registro de asistencia</Subtitle>
            <Breadcrumb>Inicio / Participantes y asistencia</Breadcrumb>
          </HeaderContent>
        </Header>

        {/* Selector de Actividad */}
        <ActivitySelector>
          <SelectorLabel>Actividad</SelectorLabel>
          <ActivitySelect
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            <option value="">Seleccionar actividad</option>
            {activities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.nombre}
              </option>
            ))}
          </ActivitySelect>
          <ActivityInfo>
            <InfoItem>
              <strong>Fecha:</strong> 15-20 Mar
            </InfoItem>
            <InfoItem>
              <strong>Modalidad:</strong> Presencial
            </InfoItem>
            <InfoItem>
              <strong>Última actualización:</strong> hoy 10:34
            </InfoItem>
          </ActivityInfo>
        </ActivitySelector>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon $color="#E3F2FD">
              <FiUsers size={24} color="#4f7cff" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.totalInscritos}</StatValue>
              <StatLabel>Total inscritos</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon $color="#E8F5E9">
              <FiCheckCircle size={24} color="#10b981" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.asistentes}</StatValue>
              <StatLabel>Asistentes</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon $color="#FFF3E0">
              <FiClock size={24} color="#f59e0b" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.tasaAsistencia}%</StatValue>
              <StatLabel>Tasa de asistencia</StatLabel>
              <ProgressBar>
                <ProgressFill $width={stats.tasaAsistencia} />
              </ProgressBar>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Filtros y Búsqueda */}
        <FiltersBar>
          <SearchBar>
            <FiSearch size={20} color="#6b7280" />
            <SearchInput
              type="text"
              placeholder="Buscar por nombre, email o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>

          <FilterGroup>
            <FilterButton
              $active={filterStatus === 'Todos'}
              onClick={() => setFilterStatus('Todos')}
            >
              Todos
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'Pendientes'}
              onClick={() => setFilterStatus('Pendientes')}
            >
              Pendientes de pago
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'Pagados'}
              onClick={() => setFilterStatus('Pagados')}
            >
              Pagados
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'Ausentes'}
              onClick={() => setFilterStatus('Ausentes')}
            >
              Ausentes
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'Presentes'}
              onClick={() => setFilterStatus('Presentes')}
            >
              Presentes
            </FilterButton>
          </FilterGroup>

          <ActionButtons>
            <ActionButton onClick={handleVerificarPagos}>
              Verificar pagos
            </ActionButton>
            <ActionButton $primary onClick={handleGuardarAsistencia}>
              Guardar asistencia
            </ActionButton>
          </ActionButtons>
        </FiltersBar>

        {/* Checkbox para marcar todos */}
        <SelectAllRow>
          <Checkbox
            type="checkbox"
            id="selectAll"
            onChange={(e) => {
              // Implementar lógica para marcar/desmarcar todos
            }}
          />
          <CheckboxLabel htmlFor="selectAll">
            Marcar todos presentes
          </CheckboxLabel>
        </SelectAllRow>

        {/* Tabla de Participantes */}
        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th></Th>
                <Th>PARTICIPANTE</Th>
                <Th>REGISTRO</Th>
                <Th>PAGO</Th>
                <Th>ASISTENCIA</Th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <Tr key={participant.id}>
                  <Td>
                    <Checkbox
                      type="checkbox"
                      checked={participant.asistencia}
                      onChange={() => toggleAsistencia(participant.id)}
                    />
                  </Td>
                  <Td>
                    <ParticipantInfo>
                      <ParticipantName>{participant.nombre}</ParticipantName>
                      <ParticipantEmail>{participant.email}</ParticipantEmail>
                    </ParticipantInfo>
                  </Td>
                  <Td>{participant.registro}</Td>
                  <Td>
                    <Badge $color={participant.pagoColor}>
                      {participant.pago}
                    </Badge>
                  </Td>
                  <Td>
                    {participant.asistencia ? (
                      <StatusIcon $color="#10b981">
                        <FiCheckCircle size={20} />
                      </StatusIcon>
                    ) : (
                      <StatusIcon $color="#e5e7eb">
                        <FiCheckCircle size={20} />
                      </StatusIcon>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          {filteredParticipants.length === 0 && (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyText>No se encontraron participantes</EmptyText>
            </EmptyState>
          )}
        </TableCard>

        {/* Botón Exportar */}
        <ExportButton onClick={handleExportarLista}>
          <FiDownload size={20} />
          Exportar lista
        </ExportButton>
      </Container>
    </OrganizerLayout>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

const Breadcrumb = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
`;

const ActivitySelector = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SelectorLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const ActivitySelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: white;
  cursor: pointer;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #4f7cff;
    box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.1);
  }
`;

const ActivityInfo = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  font-size: 0.9rem;
  color: #6b7280;

  strong {
    color: #374151;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
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
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
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
  width: ${props => props.$width}%;
  height: 100%;
  background: linear-gradient(90deg, #4f7cff, #3b63e0);
  transition: width 0.3s;
`;

const FiltersBar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
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
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.$active ? '#4f7cff' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#4f7cff' : '#e5e7eb'};
  border-radius: 8px;
  color: ${props => props.$active ? 'white' : '#6b7280'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#3b63e0' : '#f9fafb'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.$primary ? '#4f7cff' : 'transparent'};
  border: 1px solid ${props => props.$primary ? '#4f7cff' : '#e5e7eb'};
  border-radius: 8px;
  color: ${props => props.$primary ? 'white' : '#6b7280'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$primary ? '#3b63e0' : '#f9fafb'};
  }
`;

const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
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

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background: ${props => props.$color};
`;

const StatusIcon = styled.div`
  color: ${props => props.$color};
  display: inline-flex;
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

const ExportButton = styled.button`
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #4f7cff;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #4f7cff;
  }
`;

export default ParticipantesPage;