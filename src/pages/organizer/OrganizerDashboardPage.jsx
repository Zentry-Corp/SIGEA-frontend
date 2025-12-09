import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPlus, FiCalendar, FiUsers, FiClipboard, FiAward, FiDollarSign } from 'react-icons/fi';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%);
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const HeaderInfo = styled.div``;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0 0 10px 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 107, 107, 0.3);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  color: #4f7cff;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 8px 0;
  
  strong {
    color: white;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: #4f7cff;
    box-shadow: 0 8px 24px rgba(79, 124, 255, 0.3);
  }
`;

const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 24px;
  color: white;
`;

const ActionTitle = styled.h4`
  color: white;
  font-size: 1.1rem;
  margin: 0 0 8px 0;
`;

const ActionDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 10px;
`;

export const OrganizerDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    {
      icon: <FiPlus />,
      title: 'Crear Evento',
      description: 'Crea un nuevo evento académico',
      action: () => alert('Próximamente: Crear nuevo evento')
    },
    {
      icon: <FiCalendar />,
      title: 'Mis Eventos',
      description: 'Gestiona tus eventos creados',
      action: () => alert('Próximamente: Ver mis eventos')
    },
    {
      icon: <FiUsers />,
      title: 'Inscripciones',
      description: 'Ver inscripciones por evento',
      action: () => alert('Próximamente: Ver inscripciones')
    },
    {
      icon: <FiClipboard />,
      title: 'Control de Asistencia',
      description: 'Registra la asistencia de participantes',
      action: () => alert('Próximamente: Control de asistencia')
    },
    {
      icon: <FiAward />,
      title: 'Certificados',
      description: 'Genera y gestiona certificados',
      action: () => alert('Próximamente: Gestión de certificados')
    },
    {
      icon: <FiDollarSign />,
      title: 'Pagos',
      description: 'Gestiona los pagos de eventos',
      action: () => alert('Próximamente: Gestión de pagos')
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <HeaderInfo>
          <Title>👋 Bienvenido, {user?.nombres || 'Organizador'}</Title>
          <Subtitle>Panel de Organizador - SIGEA</Subtitle>
        </HeaderInfo>
        <LogoutButton onClick={handleLogout}>
          <FiLogOut size={20} />
          Cerrar Sesión
        </LogoutButton>
      </Header>

      <InfoCard>
        <InfoTitle>
          <FiUsers />
          Información de tu cuenta
        </InfoTitle>
        <InfoText><strong>Nombre:</strong> {user?.nombres} {user?.apellidos}</InfoText>
        <InfoText><strong>Correo:</strong> {user?.correo}</InfoText>
        <InfoText><strong>DNI:</strong> {user?.dni}</InfoText>
        <InfoText><strong>Rol:</strong> {user?.rol?.nombre_rol || 'ORGANIZADOR'}</InfoText>
      </InfoCard>

      <InfoCard>
        <InfoTitle>
          <FiCalendar />
          Gestión de Eventos
        </InfoTitle>
        <QuickActionsGrid>
          {quickActions.map((action, index) => (
            <ActionCard key={index} onClick={action.action}>
              <ActionIcon>{action.icon}</ActionIcon>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
              <ComingSoonBadge>Próximamente</ComingSoonBadge>
            </ActionCard>
          ))}
        </QuickActionsGrid>
      </InfoCard>
    </DashboardContainer>
  );
};

export default OrganizerDashboardPage;