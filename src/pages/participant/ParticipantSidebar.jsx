import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiAward,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
} from 'react-icons/fi';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useMyNotifications } from '../../features/participant/hooks/useMyNotifications';
import NotificationBell from './NotificationBell';

const ParticipantSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const usuarioId = String(user?.usuarioId || user?.id_usuario || user?.id || '');
  const { unreadCount } = useMyNotifications(usuarioId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/participante/dashboard', icon: FiHome, label: 'Inicio' },
    { path: '/participante/eventos', icon: FiCalendar, label: 'Explorar eventos' },
    { path: '/participante/inscripciones', icon: FiClipboard, label: 'Mis inscripciones' },
    { path: '/participante/certificados', icon: FiAward, label: 'Mis certificados' },
    {
      path: '/participante/notificaciones',
      icon: FiBell,
      label: 'Notificaciones',
      badge: unreadCount,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Header superior para mobile */}
      <MobileHeader>
        <MobileHeaderContent>
          <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </HamburgerButton>

          <MobileRight>
            <NotificationBell
              count={unreadCount}
              onClick={() => handleNavigation('/participante/notificaciones')}
              title="Notificaciones"
            />

            <MobileUserInfo>
              <MobileAvatar>
                {user?.nombres?.[0] || user?.correo?.[0]?.toUpperCase() || 'U'}
              </MobileAvatar>
              <MobileUserDetails>
                <MobileUserName>{user?.nombres || 'Usuario'}</MobileUserName>
                <MobileUserRole>Participante</MobileUserRole>
              </MobileUserDetails>
            </MobileUserInfo>
          </MobileRight>
        </MobileHeaderContent>
      </MobileHeader>

      {/* Overlay para mobile */}
      <Overlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />

      {/* Sidebar */}
      <SidebarContainer $isOpen={isOpen}>
        <Header>
          <UserInfo>
            <Avatar>
              {user?.nombres?.[0] || user?.correo?.[0]?.toUpperCase() || 'U'}
            </Avatar>

            <UserDetails>
              <UserName>{user?.nombres || 'Usuario'}</UserName>
              <UserRole>Participante</UserRole>
            </UserDetails>

            <HeaderBellWrap>
              <NotificationBell
                count={unreadCount}
                onClick={() => handleNavigation('/participante/notificaciones')}
                title="Notificaciones"
              />
            </HeaderBellWrap>
          </UserInfo>
        </Header>

        <Nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const showBadge = Number(item.badge) > 0;

            return (
              <NavItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                $active={isActive(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>

                {showBadge && (
                  <NavBadge>{item.badge > 99 ? '99+' : item.badge}</NavBadge>
                )}
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

/* =========================
   Styled Components (CLARO)
========================= */

const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  border-bottom: 1px solid #e8ecf3;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

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

const MobileRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
`;

const HamburgerButton = styled.button`
  width: 44px;
  height: 44px;
  background: #f8fafc;
  border: 1px solid #e8ecf3;
  border-radius: 12px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    border-color: #d1d5db;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
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
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(4px);
  z-index: 998;
  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
  pointer-events: ${(props) => (props.$isOpen ? 'all' : 'none')};
  transition: opacity 0.3s ease;

  @media (max-width: 968px) {
    display: block;
  }
`;

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid #e8ecf3;
  z-index: 999;
  transition: transform 0.3s ease;

  @media (max-width: 968px) {
    top: 70px;
    height: calc(100vh - 70px);
    transform: translateX(${(props) => (props.$isOpen ? '0' : '-100%')});
    box-shadow: ${(props) =>
      props.$isOpen ? '4px 0 24px rgba(0, 0, 0, 0.08)' : 'none'};
  }
`;

const Header = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid #f1f5f9;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  position: relative;
`;

const HeaderBellWrap = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
  padding-right: 56px; /* espacio para la campana */
`;

const UserName = styled.div`
  color: #1a1a2e;
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 20px 14px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  font-size: 0.9375rem;
  position: relative;

  color: ${(props) => (props.$active ? '#4F7CFF' : '#64748b')};
  background: ${(props) =>
    props.$active ? 'rgba(79, 124, 255, 0.08)' : 'transparent'};
  font-weight: ${(props) => (props.$active ? '600' : '500')};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${(props) => (props.$active ? '24px' : '0')};
    background: #4f7cff;
    border-radius: 0 4px 4px 0;
    transition: height 0.2s ease;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  span {
    flex: 1;
  }

  &:hover {
    background: ${(props) =>
      props.$active ? 'rgba(79, 124, 255, 0.12)' : '#f8fafc'};
    color: ${(props) => (props.$active ? '#4F7CFF' : '#374151')};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NavBadge = styled.span`
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  font-weight: 800;
  font-size: 0.72rem;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.div`
  padding: 16px 14px 24px;
  border-top: 1px solid #f1f5f9;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #ef4444;
  font-size: 0.9375rem;
  font-weight: 500;
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
    background: #fef2f2;
    border-color: #ef4444;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default ParticipantSidebar;
