import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';

const ActividadesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterTime, setFilterTime] = useState('Próximas');

  // Datos de ejemplo (luego conectaremos con el endpoint)
  const [actividades, setActividades] = useState([
    {
      id: 1,
      icono: '🎓',
      titulo: 'Diplomado en Gestión Agrícola Sostenible',
      tipo: 'Diplomado',
      modalidad: 'Presencial',
      estado: 'Finalizada',
      fecha: '01 Feb 2025 - 28 Feb 2025',
      participantes: 45,
      cupos: 60,
      estadoColor: '#6b7280'
    },
    {
      id: 2,
      icono: '🌱',
      titulo: 'Curso Avanzado de Sostenibilidad Ambiental',
      tipo: 'Curso',
      modalidad: 'Presencial',
      estado: 'En curso',
      fecha: '15 Feb 2025 - 20 Feb 2025',
      participantes: 25,
      cupos: 40,
      estadoColor: '#10b981'
    },
    {
      id: 3,
      icono: '💡',
      titulo: 'Seminario de Innovación Tecnológica',
      tipo: 'Seminario',
      modalidad: 'Virtual',
      estado: 'En curso',
      fecha: '18 Feb 2025 - 22 Feb 2025',
      participantes: 22,
      cupos: 35,
      estadoColor: '#10b981'
    },
    {
      id: 4,
      icono: '🔬',
      titulo: 'Taller de Investigación Científica',
      tipo: 'Taller',
      modalidad: 'Presencial',
      estado: 'Próxima',
      fecha: '01 Mar 2025 - 05 Mar 2025',
      participantes: 18,
      cupos: 30,
      estadoColor: '#4f7cff'
    },
    {
      id: 5,
      icono: '🌾',
      titulo: 'Conferencia de Agroecología',
      tipo: 'Conferencia',
      modalidad: 'Híbrida',
      estado: 'Próxima',
      fecha: '10 Mar 2025 - 12 Mar 2025',
      participantes: 32,
      cupos: 50,
      estadoColor: '#4f7cff'
    }
  ]);

  const filteredActividades = actividades.filter(act => {
    const matchesSearch = act.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || act.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Gestión de Actividades</Title>
            <Subtitle>Crea y gestiona tus actividades académicas</Subtitle>
            <Breadcrumb>Inicio / Gestión de actividades</Breadcrumb>
          </HeaderContent>
          <HeaderAction>
            <NewActivityButton
              onClick={() => navigate('/organizador/actividades/crear')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={20} />
              Nueva actividad
            </NewActivityButton>
          </HeaderAction>
        </Header>

        {/* Filtros y Búsqueda */}
        <FiltersBar>
          <SearchBar>
            <FiSearch size={20} color="#6b7280" />
            <SearchInput
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>

          <FilterGroup>
            <FilterSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="En curso">En curso</option>
              <option value="Próxima">Próximas</option>
              <option value="Finalizada">Finalizadas</option>
            </FilterSelect>

            <FilterSelect
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
            >
              <option value="Próximas">Próximas</option>
              <option value="Este mes">Este mes</option>
              <option value="Último mes">Último mes</option>
            </FilterSelect>

            <ClearFiltersButton onClick={() => {
              setSearchTerm('');
              setFilterStatus('Todos');
              setFilterTime('Próximas');
            }}>
              Limpiar filtros
            </ClearFiltersButton>
          </FilterGroup>
        </FiltersBar>

        {/* Lista de Actividades */}
        <ResultsHeader>
          <ResultsCount>
            <strong>Mis actividades</strong>
            <Count>Mostrando {filteredActividades.length} de {actividades.length}</Count>
          </ResultsCount>
        </ResultsHeader>

        <ActivitiesGrid>
          {filteredActividades.map((actividad, index) => (
            <ActivityCard
              key={actividad.id}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            >
              <CardHeader>
                <ActivityIcon>{actividad.icono}</ActivityIcon>
                <CardMenu>
                  <FiMoreVertical size={20} color="#6b7280" />
                </CardMenu>
              </CardHeader>

              <CardContent>
                <ActivityType>
                  {actividad.tipo}
                  <TypeBadge>{actividad.modalidad}</TypeBadge>
                  <StatusBadge $color={actividad.estadoColor}>
                    {actividad.estado}
                  </StatusBadge>
                </ActivityType>

                <ActivityTitle>{actividad.titulo}</ActivityTitle>

                <ActivityDate>
                  Periodo: {actividad.fecha}
                </ActivityDate>

                <ParticipantsInfo>
                  Participantes: {actividad.participantes} / Cupos: {actividad.cupos}
                </ParticipantsInfo>
              </CardContent>

              <CardFooter>
                <ViewDetailButton onClick={() => navigate(`/organizador/actividades/${actividad.id}`)}>
                  Ver detalle
                </ViewDetailButton>
              </CardFooter>
            </ActivityCard>
          ))}
        </ActivitiesGrid>

        {filteredActividades.length === 0 && (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyTitle>No se encontraron actividades</EmptyTitle>
            <EmptyText>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primera actividad'
              }
            </EmptyText>
            {!searchTerm && (
              <NewActivityButton
                onClick={() => navigate('/organizador/actividades/crear')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={20} />
                Crear primera actividad
              </NewActivityButton>
            )}
          </EmptyState>
        )}
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
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

const HeaderAction = styled.div``;

const NewActivityButton = styled(motion.button)`
  background: #4f7cff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(79, 124, 255, 0.3);

  &:hover {
    background: #3b63e0;
  }
`;

const FiltersBar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
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
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4f7cff;
  }

  &:focus {
    outline: none;
    border-color: #4f7cff;
    box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.1);
  }
`;

const ClearFiltersButton = styled.button`
  padding: 10px 16px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: #4f7cff;
    border-color: #4f7cff;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ResultsCount = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 1.25rem;
    color: #1a1a1a;
  }
`;

const Count = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ActivityIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const CardMenu = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const CardContent = styled.div`
  margin-bottom: 20px;
`;

const ActivityType = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const TypeBadge = styled.span`
  padding: 4px 10px;
  background: #4f7cff;
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  background: ${props => props.$color};
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ActivityTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const ActivityDate = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
`;

const ParticipantsInfo = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const CardFooter = styled.div`
  display: flex;
  gap: 12px;
`;

const ViewDetailButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid #4f7cff;
  border-radius: 8px;
  color: #4f7cff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4f7cff;
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 24px;
`;

export default ActividadesPage;