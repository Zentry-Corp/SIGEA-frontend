import React from 'react';
import styled from 'styled-components';

const PublicFooter = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterBrand>
            <BrandTitle>SIGEA</BrandTitle>
            <BrandDescription>
              Plataforma educativa de gestión e inscripción a eventos académicos de la UNAS.
            </BrandDescription>
          </FooterBrand>

          <FooterColumn>
            <ColumnTitle>Plataforma</ColumnTitle>
            <FooterLink href="#programas">Programas</FooterLink>
            <FooterLink href="#certificados">Certificados</FooterLink>
            <FooterLink href="#eventos">Eventos</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Legal</ColumnTitle>
            <FooterLink href="#terminos">Términos de servicio</FooterLink>
            <FooterLink href="#privacidad">Privacidad</FooterLink>
            <FooterLink href="#contacto">Contacto</FooterLink>
          </FooterColumn>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            © 2025 SIGEA - Universidad Nacional Agraria de la Selva. Todos los derechos reservados.
          </Copyright>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: #1a2332;
  color: white;
  padding: 60px 20px 30px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 60px;
  padding-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BrandTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const BrandDescription = styled.p`
  font-size: 0.95rem;
  color: #a0aec0;
  line-height: 1.6;
  margin: 0;
  max-width: 400px;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ColumnTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
`;

const FooterLink = styled.a`
  font-size: 0.95rem;
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #4F7CFF;
  }
`;

const FooterBottom = styled.div`
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const Copyright = styled.p`
  font-size: 0.875rem;
  color: #a0aec0;
  margin: 0;
`;

export default PublicFooter;