import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { LoginModal } from '../../../../features/auth';

const PublicHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <HeaderContainer $isScrolled={isScrolled}>
        <HeaderContent>
          <Logo>
            <LogoIcon src="/logo-sigea.png" alt="SIGEA" />
            <LogoTextWrapper>
              <LogoTitle>Sistema de Gestión de Eventos Académicos</LogoTitle>
            </LogoTextWrapper>
          </Logo>

          <DesktopNav>
            <NavLink href="#programas">Programas</NavLink>
            <NavLink href="#certificados">Certificados</NavLink>
            <NavLink href="#nosotros">Nosotros</NavLink>
          </DesktopNav>

          <DesktopButtons>
            <LoginButton onClick={() => setIsLoginModalOpen(true)}>
              Iniciar sesión
            </LoginButton>
            <SignUpButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/register'}
            >
              Crear cuenta
            </SignUpButton>
          </DesktopButtons>

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
        </HeaderContent>

        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MobileNavLink href="#programas" onClick={toggleMobileMenu}>
              Programas
            </MobileNavLink>
            <MobileNavLink href="#certificados" onClick={toggleMobileMenu}>
              Certificados
            </MobileNavLink>
            <MobileNavLink href="#nosotros" onClick={toggleMobileMenu}>
              Nosotros
            </MobileNavLink>
            <MobileDivider />
            <MobileLoginButton onClick={() => {
              setIsLoginModalOpen(true);
              setIsMobileMenuOpen(false);
            }}>
              Iniciar sesión
            </MobileLoginButton>
            <MobileSignUpButton onClick={() => {
              setIsMobileMenuOpen(false);
              window.location.href = '/register';
            }}>
              Crear cuenta
            </MobileSignUpButton>
          </MobileMenu>
        )}
      </HeaderContainer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

// Styled Components (mantén los que ya tienes)
const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background: ${props => props.$isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white'};
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.$isScrolled ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.3s ease;
  z-index: 1000;
  border-bottom: 1px solid #f0f0f0;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @media (max-width: 968px) {
    gap: 20px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  flex-shrink: 0;
  padding-top: 2px;  /* Ajuste fino para alinearlo visualmente */
`;


const LogoIcon = styled.img`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  object-fit: contain;
  transform: translateY(1px); /* Alineación fina con el texto */

  @media (max-width: 768px) {
    width: 46px;
    height: 46px;
  }
`;


const LogoTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 580px) {
    display: none;
  }
`;

const LogoTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2a2a2a;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.9;
  white-space: nowrap;
  transform: translateY(1px); /* Alineación perfecta */

  @media (max-width: 1200px) {
    font-size: 0.75rem;
  }

  @media (max-width: 968px) {
    display: none;
  }
`;



const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #444;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #4F7CFF;
  }
`;

const DesktopButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  @media (max-width: 968px) {
    display: none;
  }
`;

const LoginButton = styled.button`
  background: transparent;
  color: #4F7CFF;
  border: 2px solid #4F7CFF;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(79, 124, 255, 0.05);
  }
`;

const SignUpButton = styled(motion.button)`
  background: #4F7CFF;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3b63e0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #1a1a1a;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px 20px;
  background: white;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 968px) {
    display: flex;
  }
`;

const MobileNavLink = styled.a`
  color: #444;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #f8f9ff;
    color: #4F7CFF;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
`;

const MobileLoginButton = styled.button`
  background: transparent;
  color: #4F7CFF;
  border: 2px solid #4F7CFF;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(79, 124, 255, 0.05);
  }
`;

const MobileSignUpButton = styled.button`
  background: #4F7CFF;
  color: white;
  border: none;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3b63e0;
  }
`;

export default PublicHeader;