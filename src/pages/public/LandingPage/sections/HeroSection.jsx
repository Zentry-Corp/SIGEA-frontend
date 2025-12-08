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
            Inscríbete y paga tus eventos académicos en minutos.
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
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CertificateIcon>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" stroke="#4F7CFF" strokeWidth="3" />
                <path d="M40 20L45 35L60 35L48 45L53 60L40 50L27 60L32 45L20 35L35 35L40 20Z" fill="#4F7CFF" />
              </svg>
            </CertificateIcon>
            <CertificateText>Certificados Digitales</CertificateText>
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
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
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
    background: radial-gradient(circle, rgba(79, 124, 255, 0.08) 0%, transparent 70%);
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
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  font-size: 1rem;
  color: #444;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(motion.button)`
  background: #4F7CFF;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3b63e0;
    box-shadow: 0 4px 12px rgba(79, 124, 255, 0.3);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: #4F7CFF;
  border: 2px solid #4F7CFF;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(79, 124, 255, 0.05);
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
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 300px;

  @media (max-width: 968px) {
    min-width: 250px;
    padding: 50px 30px;
  }
`;

const CertificateIcon = styled.div`
  svg {
    filter: drop-shadow(0 4px 8px rgba(79, 124, 255, 0.2));
  }
`;

const CertificateText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #4F7CFF;
  margin: 0;
  text-align: center;
`;

export default HeroSection;