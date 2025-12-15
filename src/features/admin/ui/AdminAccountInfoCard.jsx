import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { InfoCard, InfoTitle, InfoText } from './adminDashboard.styles';

export const AdminAccountInfoCard = ({ user }) => {
  return (
    <InfoCard>
      <InfoTitle>
        <FiUsers />
        Información de tu cuenta
      </InfoTitle>

      <InfoText>
        <strong>Nombre:</strong> {user?.nombres} {user?.apellidos}
      </InfoText>
      <InfoText>
        <strong>Correo:</strong> {user?.correo}
      </InfoText>
      <InfoText>
        <strong>DNI:</strong> {user?.dni}
      </InfoText>
      <InfoText>
        <strong>Rol:</strong> {user?.rol?.nombre_rol || 'ADMINISTRADOR'}
      </InfoText>
    </InfoCard>
  );
};
