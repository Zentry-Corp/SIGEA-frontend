import React from 'react';
import styled from 'styled-components';
import ParticipantSidebar from './ParticipantSidebar';

const ParticipantLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <ParticipantSidebar />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px; /* mismo ancho real del sidebar */
  padding: 32px;
  overflow-y: auto;

  @media (max-width: 968px) {
    margin-left: 0;
    padding: 20px;
    padding-top: 90px; /* 70 header + 20 padding */
  }
`;

export default ParticipantLayout;
