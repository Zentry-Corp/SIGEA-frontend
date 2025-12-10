import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiUsers, FiAward, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../features/auth/hooks/useAuth';

const OrganizerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/organizador/dashboard',
      icon: FiHome,
      label: 'Inicio',
    },
    {
      path: '/organizador/actividades',
      icon: FiCalendar,
      label: 'Gestión de Actividades',
    },
    {
      path: '/organizador/participantes',
      icon: FiUsers,
      label: 'Participantes y Asistencia',
    },
    {
      path: '/organizador/certificacion',
      icon: FiAward,
      label: 'Certificación',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Cerrar sidebar en mobile después de navegar
  };

  return (
    <>
      {/* Header superior para mobile */}
      <MobileHeader>
        <MobileHeaderContent>
          <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </HamburgerButton>

          <MobileUserInfo>
            <MobileAvatar>
              {user?.nombres?.[0] || user?.correo?.[0].toUpperCase() || 'U'}
            </MobileAvatar>
            <MobileUserDetails>
              <MobileUserName>{user?.nombres || 'Usuario'}</MobileUserName>
              <MobileUserRole>Organizador</MobileUserRole>
            </MobileUserDetails>
          </MobileUserInfo>
        </MobileHeaderContent>
      </MobileHeader>

      {/* Overlay para mobile */}
      <Overlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />

      {/* Sidebar */}
      <SidebarContainer $isOpen={isOpen}>
        <Header>
          <UserInfo>
            <Avatar>
              {user?.nombres?.[0] || user?.correo?.[0].toUpperCase() || 'U'}
            </Avatar>
            <UserDetails>
              <UserName>{user?.nombres || 'Usuario'}</UserName>
              <UserRole>Organizador</UserRole>
            </UserDetails>
          </UserInfo>
        </Header>

        <Nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                $active={isActive(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </Nav>

        <Footer>
          <LogoutButton onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Cerrar sesión</span>
          </LogoutButton>
        </Footer>
      </SidebarContainer>
    </>
  );
};

// Styled Components
const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (max-width: 968px) {
    display: block;
  }
`;

const MobileHeaderContent = styled.div`
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 100%;
`;

const HamburgerButton = styled.button`
  width: 44px;
  height: 44px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #1a1a2e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
  justify-content: flex-end;
`;

const MobileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(79, 124, 255, 0.25);
`;

const MobileUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 480px) {
    display: none;
  }
`;

const MobileUserName = styled.div`
  color: #1a1a2e;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileUserRole = styled.div`
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;

  @media (max-width: 968px) {
    display: block;
  }
`;

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: transform 0.3s ease;

  @media (max-width: 968px) {
    top: 70px;
    height: calc(100vh - 70px);
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    box-shadow: ${props => props.$isOpen ? '8px 0 32px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

const Header = styled.div`
  padding: 32px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(79, 124, 255, 0.35);
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  color: white;
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border-radius: 10px;
  color: ${props => props.$active ? 'white' : '#94a3b8'};
  background: ${props => props.$active ? 'rgba(79, 124, 255, 0.15)' : 'transparent'};
  border-left: 3px solid ${props => props.$active ? '#4f7cff' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 6px;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  position: relative;

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  span {
    flex: 1;
  }

  &:hover {
    background: ${props => props.$active ? 'rgba(79, 124, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    color: white;
    transform: translateX(4px);

    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }

  ${props => props.$active && `
    box-shadow: 0 2px 8px rgba(79, 124, 255, 0.2);
  `}
`;

const Footer = styled.div`
  padding: 20px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 13px 16px;
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 10px;
  color: #ff6b6b;
  font-size: 0.9375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(255, 107, 107, 0.1);
    border-color: #ff6b6b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export default OrganizerSidebar;

/* 
  NOTA IMPORTANTE: Para que el contenido principal no quede detrás del header en mobile,
  debes agregar padding/margin en el componente que envuelve el contenido:

  const MainContent = styled.div`
    margin-left: 260px;  // Ancho del sidebar
    min-height: 100vh;
    
    @media (max-width: 968px) {
      margin-left: 0;
      padding-top: 70px;  // Altura del header mobile
    }
  `;
*/