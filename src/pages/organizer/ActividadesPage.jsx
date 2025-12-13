// src/pages/organizer/ActividadesPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import OrganizerSidebar from './OrganizerSidebar';
import { useActivities } from '../../features/activities/hooks/useActivities';
import ActivityCard from '../../features/activities/ui/ActivityCard';
import ActivityDetailModal from '../../features/activities/ui/ActivityDetailModal';
import ActivityFilters from '../../features/activities/ui/ActivityFilters';

const ActividadesPage = () => {
  const navigate = useNavigate();

  const {
    activities,
    tipos,
    estados,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
  } = useActivities();
  console.log('ACTIVITIES =>', activities);
console.log('FILTERS =>', filters);
console.log('LOADING =>', loading);
console.log('ERROR =>', error);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedActivity(null), 200);
  };

  return (
    <>
      <OrganizerSidebar />
      
      <PageContainer>
        <Container>
          {/* HEADER */}
          <Header>
            <HeaderContent>
              <Title>Gestión de Actividades</Title>
              <Subtitle>Crea y gestiona tus actividades académicas</Subtitle>
              <Breadcrumb>Inicio / <strong>Gestión de actividades</strong></Breadcrumb>
            </HeaderContent>

            <NewActivityButton
              onClick={() => navigate('/organizador/actividades/crear')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={20} />
              Nueva actividad
            </NewActivityButton>
          </Header>

          {/* FILTROS */}
          {!loading && !error && (
            <ActivityFilters
              filters={filters}
              tipos={tipos}
              estados={estados}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              resultCount={activities.length}
            />
          )}

          {/* LOADING STATE */}
          {loading && (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Cargando actividades...</LoadingText>
            </LoadingContainer>
          )}

          {/* ERROR STATE */}
          {error && (
            <ErrorContainer>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorTitle>Error al cargar actividades</ErrorTitle>
              <ErrorMessage>{error}</ErrorMessage>
            </ErrorContainer>
          )}

          {/* ACTIVIDADES GRID */}
          {!loading && !error && (
            <>
              <ResultsHeader>
                <ResultsTitle>Mis actividades</ResultsTitle>
                <ResultsCount>
                  Mostrando <strong>{activities.length}</strong> {activities.length === 1 ? 'actividad' : 'actividades'}
                </ResultsCount>
              </ResultsHeader>

              {activities.length > 0 ? (
                <ActivitiesGrid>
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ActivityCard 
                        activity={activity}
                        onViewDetail={handleViewDetail}
                      />
                    </motion.div>
                  ))}
                </ActivitiesGrid>
              ) : (
                <EmptyState>
                  <EmptyIcon>📋</EmptyIcon>
                  <EmptyTitle>No hay actividades</EmptyTitle>
                  <EmptyText>
                    {filters.busqueda || filters.tipo !== 'todos' || filters.estado !== 'todos'
                      ? 'No se encontraron actividades con los filtros aplicados'
                      : 'Comienza creando tu primera actividad'}
                  </EmptyText>
                  {!filters.busqueda && filters.tipo === 'todos' && filters.estado === 'todos' && (
                    <CreateButtonSecondary onClick={() => navigate('/organizador/actividades/crear')}>
                      <FiPlus />
                      Crear primera actividad
                    </CreateButtonSecondary>
                  )}
                </EmptyState>
              )}
            </>
          )}
        </Container>
      </PageContainer>

      {/* MODAL - RENDERIZADO AL FINAL */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ActividadesPage;

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
  font-weight: 400;
`;

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;

  strong {
    color: #475569;
    font-weight: 600;
  }
`;

const NewActivityButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 124, 255, 0.2);

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    box-shadow: 0 6px 20px rgba(79, 124, 255, 0.3);
  }

  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  max-width: 400px;
`;

const ResultsHeader = styled.div`
  margin-bottom: 24px;
`;

const ResultsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;
`;

const ResultsCount = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;

  strong {
    color: #4F7CFF;
    font-weight: 700;
  }
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  background: #ffffff;
  border: 2px dashed #e2e8f0;
  border-radius: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 24px 0;
  max-width: 400px;
`;

const CreateButtonSecondary = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #4f7cff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: #4f7cff;
    color: #ffffff;
    border-color: #4f7cff;
  }
`;