import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCalendar, FiAward, FiClipboard, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import ParticipantLayout from './ParticipantLayout';

export const ParticipantDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    {
      icon: FiCalendar,
      title: 'Explorar eventos',
      description: 'Descubre eventos disponibles para ti.',
      color: '#4f7cff',
      action: () => navigate('/participante/eventos'),
    },
    {
      icon: FiClipboard,
      title: 'Mis inscripciones',
      description: 'Consulta el estado de tus inscripciones.',
      color: '#10b981',
      action: () => navigate('/participante/inscripciones'),
    },
    {
      icon: FiAward,
      title: 'Mis certificados',
      description: 'Descarga tus certificados obtenidos.',
      color: '#f59e0b',
      action: () => navigate('/participante/certificados'),
    },
  ];

  return (
    <ParticipantLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Panel de Participante</Title>
            <Breadcrumb>Inicio / Dashboard</Breadcrumb>
          </HeaderContent>

          <HeaderAction>
            <LogoutBtn
              as={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
            >
              <FiLogOut size={18} />
              Cerrar sesión
            </LogoutBtn>
          </HeaderAction>
        </Header>

        <TwoColumnGrid>
          <Section>
            <SectionTitle>Información de tu cuenta</SectionTitle>

            <InfoRow>
              <InfoKey>Nombre</InfoKey>
              <InfoVal>{(user?.nombres || '—') + ' ' + (user?.apellidos || '')}</InfoVal>
            </InfoRow>
            <InfoRow>
              <InfoKey>Correo</InfoKey>
              <InfoVal>{user?.correo || '—'}</InfoVal>
            </InfoRow>
            <InfoRow>
              <InfoKey>DNI</InfoKey>
              <InfoVal>{user?.dni || '—'}</InfoVal>
            </InfoRow>
            <InfoRow>
              <InfoKey>Rol</InfoKey>
              <InfoVal>{user?.rol?.nombre_rol || 'PARTICIPANTE'}</InfoVal>
            </InfoRow>
          </Section>

          <Section>
            <SectionTitle>Accesos rápidos</SectionTitle>
            <QuickActionsGrid>
              {quickActions.map((a, idx) => (
                <QuickActionCard
                  key={idx}
                  as={motion.div}
                  onClick={a.action}
                  whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ActionIcon $color={a.color}>
                    <a.icon size={22} />
                  </ActionIcon>

                  <ActionContent>
                    <ActionTitle>{a.title}</ActionTitle>
                    <ActionDesc>{a.description}</ActionDesc>
                  </ActionContent>
                </QuickActionCard>
              ))}
            </QuickActionsGrid>
          </Section>
        </TwoColumnGrid>
      </Container>
    </ParticipantLayout>
  );
};

export default ParticipantDashboardPage;

/* Styles */

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
    gap: 14px;
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

const LogoutBtn = styled.button`
  background: rgba(255, 107, 107, 0.12);
  border: 1px solid rgba(255, 107, 107, 0.25);
  color: #ef4444;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 0.95rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 18px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #eef2f7;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const InfoKey = styled.div`
  color: #6b7280;
  font-weight: 700;
`;

const InfoVal = styled.div`
  color: #111827;
  font-weight: 700;
  text-align: right;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const QuickActionCard = styled.div`
  background: #f9fafb;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  gap: 14px;
  cursor: pointer;
  transition: all 0.25s;
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${p => `${p.$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
  flex-shrink: 0;
`;

const ActionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActionTitle = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
`;

const ActionDesc = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
`;

