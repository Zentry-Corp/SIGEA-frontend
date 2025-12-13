import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiUsers, 
  FiAward, 
  FiTrendingUp,
  FiPlus,
  FiClipboard,
  FiCheckCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import OrganizerLayout from './OrganizerLayout';

const OrganizerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    actividadesActivas: 12,
    inscritosTotales: 1234,
    certificadosEmitidos: 856,
    eventosEsteMes: 8,
    cambioActividades: '+5%',
    cambioInscritos: '+12%',
    cambioCertificados: '+8%',
    cambioEventos: '+3'
  });

  const quickActions = [
    {
      icon: FiPlus,
      title: 'Crear nueva actividad',
      description: 'Configura y publica un nuevo evento o curso.',
      color: '#4f7cff',
      action: () => navigate('/organizador/actividades/crear')
    },
    {
      icon: FiUsers,
      title: 'Ver inscripciones',
      description: 'Consulta la lista completa de participantes.',
      color: '#10b981',
      action: () => navigate('/organizador/participantes')
    },
    {
      icon: FiCheckCircle,
      title: 'Gestionar asistencia',
      description: 'Registra y valida asistencia de eventos.',
      color: '#f59e0b',
      action: () => navigate('/organizador/participantes')
    },
  ];

  const recentActivities = [
    {
      id: 1,
      titulo: 'Curso Avanzado de Sostenibilidad',
      fecha: '15 - 20 Mar 2025',
      estado: 'Activa',
      estadoColor: '#10b981'
    },
    {
      id: 2,
      titulo: 'Taller de Investigación Científica',
      fecha: '22 - 26 Mar 2025',
      estado: 'Borrador',
      estadoColor: '#f59e0b'
    },
    {
      id: 3,
      titulo: 'Conferencia de Agroecología',
      fecha: '10 - 12 Abr 2025',
      estado: 'Activa',
      estadoColor: '#10b981'
    },
    {
      id: 4,
      titulo: 'Seminario de Innovación',
      fecha: '18 - 22 Abr 2025',
      estado: 'Finalizada',
      estadoColor: '#6b7280'
    }
  ];

  const recentRegistrations = [
    {
      nombre: 'María García López',
      actividad: 'Curso Avanzado de Sostenibilidad',
      fecha: 'Hoy - 10:30 AM'
    },
    {
      nombre: 'Carlos Mendoza Ruiz',
      actividad: 'Taller de Investigación',
      fecha: 'Hoy - 09:15 AM'
    },
    {
      nombre: 'Ana Fernández Torres',
      actividad: 'Curso Avanzado de Sostenibilidad',
      fecha: 'Ayer - 02:45 PM'
    },
    {
      nombre: 'Roberto Sánchez Pérez',
      actividad: 'Conferencia de Agroecología',
      fecha: 'Ayer - 11:20 AM'
    }
  ];

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Panel de Control</Title>
            <Breadcrumb>Inicio / Dashboard</Breadcrumb>
          </HeaderContent>
          <HeaderAction>
            <CreateButton
              onClick={() => navigate('/organizador/actividades/crear')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={20} />
              Crear actividad
            </CreateButton>
          </HeaderAction>
        </Header>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon $color="#E3F2FD">
              <FiCalendar size={24} color="#4f7cff" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.actividadesActivas}</StatValue>
              <StatLabel>Actividades activas</StatLabel>
              <StatChange $positive>{stats.cambioActividades} vs mes pasado</StatChange>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon $color="#E8F5E9">
              <FiUsers size={24} color="#10b981" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.inscritosTotales.toLocaleString()}</StatValue>
              <StatLabel>Inscritos totales</StatLabel>
              <StatChange $positive>{stats.cambioInscritos} vs mes pasado</StatChange>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon $color="#FFF3E0">
              <FiAward size={24} color="#f59e0b" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.certificadosEmitidos}</StatValue>
              <StatLabel>Certificados emitidos</StatLabel>
              <StatChange $positive>{stats.cambioCertificados} vs mes pasado</StatChange>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon $color="#F3E5F5">
              <FiTrendingUp size={24} color="#a855f7" />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.eventosEsteMes}</StatValue>
              <StatLabel>Eventos este mes</StatLabel>
              <StatChange $positive>{stats.cambioEventos} eventos</StatChange>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Quick Actions */}
        <SectionTitle>Acciones rápidas</SectionTitle>
        <QuickActionsGrid>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              as={motion.div}
              onClick={action.action}
              whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <ActionIcon $color={action.color}>
                <action.icon size={24} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>{action.title}</ActionTitle>
                <ActionDescription>{action.description}</ActionDescription>
              </ActionContent>
            </QuickActionCard>
          ))}
        </QuickActionsGrid>

        {/* Recent Data */}
        <TwoColumnGrid>
          {/* Actividades Recientes */}
          <Section>
            <SectionHeader>
              <SectionTitle>Actividades recientes</SectionTitle>
            </SectionHeader>
            <ActivityList>
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id}>
                  <ActivityInfo>
                    <ActivityTitle>{activity.titulo}</ActivityTitle>
                    <ActivityDate>{activity.fecha}</ActivityDate>
                  </ActivityInfo>
                  <ActivityBadge $color={activity.estadoColor}>
                    {activity.estado}
                  </ActivityBadge>
                  <ViewButton onClick={() => navigate(`/organizador/actividades/${activity.id}`)}>
                    Ver detalle
                  </ViewButton>
                </ActivityItem>
              ))}
            </ActivityList>
            <ViewAllButton onClick={() => navigate('/organizador/actividades')}>
              Ver todas →
            </ViewAllButton>
          </Section>

          {/* Inscripciones Recientes */}
          <Section>
            <SectionHeader>
              <SectionTitle>Inscripciones recientes</SectionTitle>
            </SectionHeader>
            <RegistrationList>
              {recentRegistrations.map((reg, index) => (
                <RegistrationItem key={index}>
                  <RegistrationInfo>
                    <RegistrationName>{reg.nombre}</RegistrationName>
                    <RegistrationActivity>{reg.actividad}</RegistrationActivity>
                    <RegistrationDate>{reg.fecha}</RegistrationDate>
                  </RegistrationInfo>
                </RegistrationItem>
              ))}
            </RegistrationList>
            <ViewAllButton onClick={() => navigate('/organizador/participantes')}>
              Ver reporte completo →
            </ViewAllButton>
          </Section>
        </TwoColumnGrid>
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

const Breadcrumb = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const HeaderAction = styled.div``;

const CreateButton = styled(motion.button)`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
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

const StatChange = styled.div`
  font-size: 0.85rem;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  font-weight: 600;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const QuickActionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${props => props.$color};
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
`;

const ActionDescription = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const ActivityDate = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const ActivityBadge = styled.span`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background: ${props => props.$color};
`;

const ViewButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #4f7cff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #4f7cff;
  }
`;

const RegistrationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

const RegistrationItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #f9fafb;
`;

const RegistrationInfo = styled.div`
  flex: 1;
`;

const RegistrationName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const RegistrationActivity = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

const RegistrationDate = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const ViewAllButton = styled.button`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  color: #4f7cff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3b63e0;
  }
`;

export default OrganizerDashboardPage;