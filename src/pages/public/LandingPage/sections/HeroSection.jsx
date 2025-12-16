import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <HeroContainer>
      <ContentWrapper>
        <LeftContent
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Title>
            Inscríbete y paga tus eventos académicos <Highlight>en minutos</Highlight>
          </Title>
          <Subtitle>
            Cursos, talleres y conferencias de la UNAS con certificados digitales QR y validación automática.
          </Subtitle>

          <FeatureList>
            <Feature
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <IconWrapper>
                <FiCheckCircle size={20} />
              </IconWrapper>
              <FeatureText>Inscripción 100% virtual desde cualquier dispositivo.</FeatureText>
            </Feature>
            <Feature
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <IconWrapper>
                <FiCheckCircle size={20} />
              </IconWrapper>
              <FeatureText>Pagos en línea o en caja con estado actualizado.</FeatureText>
            </Feature>
            <Feature
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <IconWrapper>
                <FiCheckCircle size={20} />
              </IconWrapper>
              <FeatureText>Certificados digitales con QR y verificación inmediata.</FeatureText>
            </Feature>
          </FeatureList>

          <ButtonGroup>
            <PrimaryButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/#programas'}
            >
              Explorar eventos →
            </PrimaryButton>
            <SecondaryButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Validar certificado
            </SecondaryButton>
          </ButtonGroup>
        </LeftContent>

        <RightContent
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <CertificateCard
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <CertificateIllustration>
              {/* Mini Certificado Ilustrado */}
              <MiniCertificate>
                {/* Header del certificado */}
                <CertHeader>
                  <CertLogo>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect width="28" height="28" rx="6" fill="#4F7CFF"/>
                      <path d="M14 8L16 13L21 13L17 16L18.5 21L14 18L9.5 21L11 16L7 13L12 13L14 8Z" fill="white"/>
                    </svg>
                  </CertLogo>
                  <CertTitle>SIGEA</CertTitle>
                </CertHeader>

                {/* Body del certificado */}
                <CertBody>
                  <CertLine $width="80%" />
                  <CertLine $width="60%" />
                  <CertLine $width="70%" />
                  
                  <CertQRSection>
                    <QRCodeMock>
                      <QRPattern>
                        <QRSquare $top="2px" $left="2px" />
                        <QRSquare $top="2px" $right="2px" />
                        <QRSquare $bottom="2px" $left="2px" />
                        <QRCenter />
                      </QRPattern>
                    </QRCodeMock>
                    <VerifiedBadge>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" fill="#10b981"/>
                        <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span>Verificado</span>
                    </VerifiedBadge>
                  </CertQRSection>

                  <CertFooterLine />
                </CertBody>
              </MiniCertificate>

              {/* Elementos decorativos flotantes */}
              <FloatingElement
                $delay={0}
                style={{ top: '10%', right: '-10%' }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="#4F7CFF" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M16 10L18 15L23 15L19 18L20.5 23L16 20L11.5 23L13 18L9 15L14 15L16 10Z" fill="#4F7CFF"/>
                </svg>
              </FloatingElement>

              <FloatingElement
                $delay={0.5}
                style={{ bottom: '15%', left: '-5%' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#E8EFFF"/>
                  <path d="M12 7L9 12H15L12 17" stroke="#4F7CFF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </FloatingElement>
            </CertificateIllustration>

            <CertificateText>Certificados Digitales</CertificateText>
            <CertificateSubtext>Con QR verificable al instante</CertificateSubtext>
          </CertificateCard>
        </RightContent>
      </ContentWrapper>
    </HeroContainer>
  );
};

// Styled Components
const HeroContainer = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 80px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(79, 124, 255, 0.06) 0%, transparent 70%);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    min-height: auto;
    padding: 60px 20px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const LeftContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Title = styled.h1`
  font-size: 3.25rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Highlight = styled.span`
  color: #4F7CFF;
  background: linear-gradient(135deg, #4F7CFF 0%, #6B92FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
`;

const Feature = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconWrapper = styled.div`
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
`;

const FeatureText = styled.p`
  font-size: 0.975rem;
  color: #475569;
  margin: 0;
  line-height: 1.5;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(135deg, #4F7CFF 0%, #3b63e0 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 124, 255, 0.2);

  &:hover {
    box-shadow: 0 6px 20px rgba(79, 124, 255, 0.3);
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: #4F7CFF;
  border: 2px solid #e2e8f0;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #4F7CFF;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const RightContent = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CertificateCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 320px;
  border: 1px solid #f1f5f9;

  @media (max-width: 968px) {
    min-width: 280px;
    padding: 40px 32px;
  }
`;

const CertificateIllustration = styled.div`
  position: relative;
  width: 100%;
  max-width: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const MiniCertificate = styled.div`
  width: 200px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4F7CFF 0%, #6B92FF 100%);
    border-radius: 12px 12px 0 0;
  }
`;

const CertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

const CertLogo = styled.div`
  flex-shrink: 0;
`;

const CertTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  letter-spacing: 0.5px;
`;

const CertBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const CertLine = styled.div`
  height: 6px;
  width: ${props => props.$width || '100%'};
  background: #f1f5f9;
  border-radius: 3px;
`;

const CertQRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const QRCodeMock = styled.div`
  width: 60px;
  height: 60px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px;
  position: relative;
`;

const QRPattern = styled.div`
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, #1a1a2e 30%, transparent 30%),
    linear-gradient(#1a1a2e 30%, transparent 30%);
  background-size: 8px 8px;
  position: relative;
  border-radius: 3px;
`;

const QRSquare = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #1a1a2e;
  border: 2px solid #1a1a2e;
  ${props => props.$top && `top: ${props.$top};`}
  ${props => props.$bottom && `bottom: ${props.$bottom};`}
  ${props => props.$left && `left: ${props.$left};`}
  ${props => props.$right && `right: ${props.$right};`}
`;

const QRCenter = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background: #4F7CFF;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #86efac;

  span {
    font-size: 0.75rem;
    font-weight: 600;
    color: #10b981;
  }
`;

const CertFooterLine = styled.div`
  width: 100%;
  height: 1px;
  background: #e2e8f0;
  margin-top: 8px;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  opacity: 0;
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;

  @keyframes float {
    0%, 100% {
      opacity: 0.6;
      transform: translateY(0px);
    }
    50% {
      opacity: 1;
      transform: translateY(-10px);
    }
  }
`;

const CertificateIcon = styled.div`
  svg {
    filter: drop-shadow(0 4px 8px rgba(79, 124, 255, 0.2));
  }
`;

const CertificateText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  text-align: center;
  line-height: 1.3;
`;

const CertificateSubtext = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #64748b;
  margin: 0;
  text-align: center;
`;

export default HeroSection;