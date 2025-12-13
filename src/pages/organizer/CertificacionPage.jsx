import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle,
  FiClock,
  FiSend,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import OrganizerLayout from './OrganizerLayout';

const CertificacionPage = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('Todos');

  // Datos de ejemplo
  const activities = [
    { id: 1, nombre: 'Curso Avanzado de Sostenibilidad Ambiental' },
    { id: 2, nombre: 'Taller de Investigación Científica' },
    { id: 3, nombre: 'Seminario de Innovación Tecnológica' },
  ];

  const [stats, setStats] = useState({
    listosParaEmitir: 4,
    certificadosEmitidos: 2
  });

  const [readyToEmit, setReadyToEmit] = useState([
    {
      id: 1,
      nombre: 'María García López',
      email: 'maria.garcia@unas.edu.pe',
      pago: 'Pagado',
      pagoColor: '#10b981',
      asistencia: true,
      observaciones: ''
    },
    {
      id: 2,
      nombre: 'Ana Fernández Torres',
      email: 'ana.fernandez@unas.edu.pe',
      pago: 'Pagado',
      pagoColor: '#10b981',
      asistencia: true,
      observaciones: ''
    },
    {
      id: 3,
      nombre: 'Carlos Mendoza Ruiz',
      email: 'carlos.mendoza@unas.edu.pe',
      pago: 'Pendiente',
      pagoColor: '#f59e0b',
      asistencia: true,
      observaciones: 'Pago pendiente'
    },
    {
      id: 4,
      nombre: 'Roberto Sánchez Pérez',
      email: 'roberto.sanchez@unas.edu.pe',
      pago: 'Exonerado',
      pagoColor: '#6b7280',
      asistencia: true,
      observaciones: ''
    }
  ]);

  const [emittedHistory, setEmittedHistory] = useState([
    {
      id: 'CERT-2025-001',
      participante: 'María García López',
      email: 'maria.garcia@unas.edu.pe',
      fechaEmision: '15 Feb 2025',
      estado: 'Emitido',
      estadoColor: '#10b981'
    },
    {
      id: 'CERT-2025-002',
      participante: 'Ana Fernández Torres',
      email: 'ana.fernandez@unas.edu.pe',
      fechaEmision: '15 Feb 2025',
      estado: 'Emitido',
      estadoColor: '#10b981'
    },
    {
      id: 'CERT-2025-003',
      participante: 'Roberto Sánchez Pérez',
      email: 'roberto.sanchez@unas.edu.pe',
      fechaEmision: '14 Feb 2025',
      estado: 'Revocado',
      estadoColor: '#ef4444'
    },
    {
      id: 'CERT-2025-004',
      participante: 'Juan Morales Díaz',
      email: 'juan.morales@unas.edu.pe',
      fechaEmision: '10 Feb 2025',
      estado: 'Emitido',
      estadoColor: '#10b981'
    }
  ]);

  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedParticipants(readyToEmit.map(p => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleSelectParticipant = (id) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedParticipants(prev => [...prev, id]);
    }
  };

  const handleEmitirSeleccionados = () => {
    if (selectedParticipants.length === 0) {
      alert('⚠️ Selecciona al menos un participante');
      return;
    }
    alert(`✅ Emitiendo ${selectedParticipants.length} certificado(s)...`);
    setSelectedParticipants([]);
  };

  const filteredHistory = emittedHistory.filter(cert => {
    const matchesSearch = cert.participante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = filterTab === 'Todos' || 
                      (filterTab === 'Emitido' && cert.estado === 'Emitido') ||
                      (filterTab === 'Revocado' && cert.estado === 'Revocado');
    return matchesSearch && matchesTab;
  });

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Certificación</Title>
            <Subtitle>Emite y gestiona certificados</Subtitle>
            <Breadcrumb>Inicio / Certificación</Breadcrumb>
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
              <strong>Fechas:</strong> 15-20 Mar
            </InfoItem>
            <InfoItem>
              <strong>Modalidad:</strong> Presencial
            </InfoItem>
            <InfoItem>
              <strong>Participantes totales:</strong> 25
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
            <StatIcon $color="#FFF3E0">
              <FiCheckCircle size={24} color="#f59e0b" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.listosParaEmitir}</StatValue>
              <StatLabel>Listos para emitir</StatLabel>
              <ViewListLink>Ver lista →</ViewListLink>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon $color="#E8F5E9">
              <FiClock size={24} color="#10b981" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.certificadosEmitidos}</StatValue>
              <StatLabel>Certificados emitidos</StatLabel>
              <ViewListLink>Ver historial →</ViewListLink>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Emisión de Certificados */}
        <Section>
          <SectionHeader>
            <SectionTitle>Participantes listos para emitir</SectionTitle>
          </SectionHeader>

          <FilterBar>
            <SearchBar>
              <FiSearch size={20} color="#6b7280" />
              <SearchInput
                type="text"
                placeholder="Buscar participante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>

            <ActionButtons>
              <SelectAllButton onClick={handleSelectAll}>
                Seleccionar todos
              </SelectAllButton>
              <EmitButton 
                onClick={handleEmitirSeleccionados}
                disabled={selectedParticipants.length === 0}
              >
                <FiSend size={18} />
                Emitir seleccionados
              </EmitButton>
            </ActionButtons>
          </FilterBar>

          <TableCard>
            <Table>
              <thead>
                <tr>
                  <Th width="50px"></Th>
                  <Th>PARTICIPANTE</Th>
                  <Th>PAGO</Th>
                  <Th>ASISTENCIA</Th>
                  <Th>OBSERVACIONES</Th>
                </tr>
              </thead>
              <tbody>
                {readyToEmit.map((participant) => (
                  <Tr key={participant.id}>
                    <Td>
                      <Checkbox
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={() => handleSelectParticipant(participant.id)}
                      />
                    </Td>
                    <Td>
                      <ParticipantInfo>
                        <ParticipantName>{participant.nombre}</ParticipantName>
                        <ParticipantEmail>{participant.email}</ParticipantEmail>
                      </ParticipantInfo>
                    </Td>
                    <Td>
                      <Badge $color={participant.pagoColor}>
                        {participant.pago}
                      </Badge>
                    </Td>
                    <Td>
                      <StatusIcon $color="#10b981">
                        <FiCheckCircle size={20} />
                      </StatusIcon>
                    </Td>
                    <Td>
                      <Observations>{participant.observaciones || '—'}</Observations>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableCard>
        </Section>

        {/* Historial de Emisiones */}
        <Section>
          <SectionHeader>
            <SectionTitle>Historial de emisiones</SectionTitle>
          </SectionHeader>

          <FilterBar>
            <SearchBar>
              <FiSearch size={20} color="#6b7280" />
              <SearchInput
                type="text"
                placeholder="Buscar por nombre, email o ID de certificado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>

            <TabGroup>
              <Tab 
                $active={filterTab === 'Todos'}
                onClick={() => setFilterTab('Todos')}
              >
                Todos
              </Tab>
              <Tab 
                $active={filterTab === 'Emitido'}
                onClick={() => setFilterTab('Emitido')}
              >
                Emitido
              </Tab>
              <Tab 
                $active={filterTab === 'Revocado'}
                onClick={() => setFilterTab('Revocado')}
              >
                Revocado
              </Tab>
            </TabGroup>
          </FilterBar>

          <TableCard>
            <Table>
              <thead>
                <tr>
                  <Th>ID CERTIFICADO</Th>
                  <Th>PARTICIPANTE</Th>
                  <Th>FECHA DE EMISIÓN</Th>
                  <Th>ESTADO</Th>
                  <Th>ACCIONES</Th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((cert) => (
                  <Tr key={cert.id}>
                    <Td>
                      <CertId>{cert.id}</CertId>
                    </Td>
                    <Td>
                      <ParticipantInfo>
                        <ParticipantName>{cert.participante}</ParticipantName>
                        <ParticipantEmail>{cert.email}</ParticipantEmail>
                      </ParticipantInfo>
                    </Td>
                    <Td>{cert.fechaEmision}</Td>
                    <Td>
                      <Badge $color={cert.estadoColor}>
                        {cert.estado}
                      </Badge>
                    </Td>
                    <Td>
                      <ActionLink>⋮</ActionLink>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>

            {filteredHistory.length === 0 && (
              <EmptyState>
                <EmptyText>No se encontraron certificados</EmptyText>
              </EmptyState>
            )}
          </TableCard>

          <Pagination>
            <PaginationText>Mostrando {filteredHistory.length} de {emittedHistory.length}</PaginationText>
          </Pagination>
        </Section>
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
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

const ViewListLink = styled.button`
  background: none;
  border: none;
  color: #4f7cff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 16px;
  min-width: 250px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const SelectAllButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const EmitButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.disabled ? '#9ca3af' : '#4f7cff'};
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover:not(:disabled) {
    background: #3b63e0;
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 8px;
  background: #f9fafb;
  padding: 4px;
  border-radius: 8px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-radius: 6px;
  color: ${props => props.$active ? '#1a1a1a' : '#6b7280'};
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: #1a1a1a;
  }
`;

const TableCard = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  width: ${props => props.width || 'auto'};
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

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
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

const Observations = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const CertId = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4f7cff;
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #4f7cff;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const EmptyText = styled.p`
  color: #6b7280;
`;

const Pagination = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const PaginationText = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

export default CertificacionPage;