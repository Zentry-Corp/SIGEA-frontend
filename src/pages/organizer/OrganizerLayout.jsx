import React from 'react';
import styled from 'styled-components';
import OrganizerSidebar from './OrganizerSidebar';

const OrganizerLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <OrganizerSidebar />
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
  margin-left: 250px;
  padding: 32px;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
  }
`;

export default OrganizerLayout;