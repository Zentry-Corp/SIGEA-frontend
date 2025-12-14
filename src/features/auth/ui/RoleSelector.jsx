import React from 'react';
import styled from 'styled-components';
import { FiUser, FiCalendar, FiSettings } from 'react-icons/fi';

const roles = [
  {
    id: 'participante',
    name: 'Participante',
    icon: FiUser,
    description: 'Accede a tus inscripciones y certificados.',
  },
  {
    id: 'organizador',
    name: 'Organizador',
    icon: FiCalendar,
    description: 'Gestiona eventos y asistencia.',
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: FiSettings,
    description: 'Administra usuarios y programas.',
  },
];

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <Container>
      <Title>SELECCIONA TU ROL</Title>
      <RolesGrid>
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <RoleCard
              key={role.id}
              $isSelected={selectedRole === role.id}
              onClick={() => onSelectRole(role.id)}
            >
              <IconWrapper $isSelected={selectedRole === role.id}>
                <Icon size={28} />
              </IconWrapper>
              <RoleName>{role.name}</RoleName>
              <RoleDescription>{role.description}</RoleDescription>
            </RoleCard>
          );
        })}
      </RolesGrid>
      <Hint>Serás redirigido a la página de tu rol.</Hint>
    </Container>
  );
};

const Container = styled.div`
  margin: 30px 0;
`;

const Title = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #8b9dc3;
  letter-spacing: 1px;
  margin-bottom: 16px;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCard = styled.div`
  background: ${props => props.$isSelected ? 'rgba(79, 124, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.$isSelected ? '#4F7CFF' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(79, 124, 255, 0.1);
    border-color: #4F7CFF;
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  background: ${props => props.$isSelected ? '#4F7CFF' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
`;

const RoleName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
`;

const RoleDescription = styled.div`
  font-size: 0.75rem;
  color: #8b9dc3;
  line-height: 1.4;
`;

const Hint = styled.p`
  font-size: 0.85rem;
  color: #8b9dc3;
  text-align: center;
  margin-top: 12px;
`;

export default RoleSelector;