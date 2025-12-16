import React from 'react';
import { FiLogOut, FiShield } from 'react-icons/fi';
import {
  Header,
  HeaderInfo,
  Title,
  Subtitle,
  LogoutButton,
  AdminBadge,
} from './adminDashboard.styles';

export const AdminDashboardHeader = ({ user, onLogout }) => {
  return (
    <Header>
      <HeaderInfo>
        <Title>👋 Bienvenido, {user?.nombres || 'Administrador'}</Title>
        <Subtitle>Panel de Administración - SIGEA</Subtitle>
        <AdminBadge>
          <FiShield />
          Administrador
        </AdminBadge>
      </HeaderInfo>

      <LogoutButton onClick={onLogout}>
        <FiLogOut size={20} />
        Cerrar Sesión
      </LogoutButton>
    </Header>
  );
};
