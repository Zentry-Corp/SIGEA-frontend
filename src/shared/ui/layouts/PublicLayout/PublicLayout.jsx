import React from 'react';
import styled from 'styled-components';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <PublicHeader />
      <MainContent>{children}</MainContent>
      <PublicFooter />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

export default PublicLayout;