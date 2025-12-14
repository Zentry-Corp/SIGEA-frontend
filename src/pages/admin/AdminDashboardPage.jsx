import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers, FiCalendar, FiSettings, FiBarChart2, FiShield, FiAward } from 'react-icons/fi';

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

const AdminBadge = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
`;

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    {
      icon: <FiUsers />,
      title: 'Gestionar Usuarios',
      description: 'Administra usuarios y asigna roles',
      action: () => alert('Próximamente: Gestión de usuarios')
    },
    {
      icon: <FiCalendar />,
      title: 'Supervisar Eventos',
      description: 'Vista general de todos los eventos',
      action: () => alert('Próximamente: Supervisión de eventos')
    },
    {
      icon: <FiAward />,
      title: 'Certificados',
      description: 'Supervisión de certificados emitidos',
      action: () => alert('Próximamente: Supervisión de certificados')
    },
    {
      icon: <FiBarChart2 />,
      title: 'Reportes del Sistema',
      description: 'Estadísticas y análisis completo',
      action: () => alert('Próximamente: Ver reportes')
    },
    {
      icon: <FiSettings />,
      title: 'Configuración Global',
      description: 'Ajustes del sistema SIGEA',
      action: () => alert('Próximamente: Configuración')
    },
    {
      icon: <FiShield />,
      title: 'Logs de Auditoría',
      description: 'Registro de actividad del sistema',
      action: () => alert('Próximamente: Logs de auditoría')
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <HeaderInfo>
          <Title>👋 Bienvenido, {user?.nombres || 'Administrador'}</Title>
          <Subtitle>Panel de Administración - SIGEA</Subtitle>
          <AdminBadge>
            <FiShield />
            Administrador
          </AdminBadge>
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
        <InfoText><strong>Rol:</strong> {user?.rol?.nombre_rol || 'ADMINISTRADOR'}</InfoText>
      </InfoCard>

      <InfoCard>
        <InfoTitle>
          <FiSettings />
          Administración del Sistema
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

export default AdminDashboardPage;