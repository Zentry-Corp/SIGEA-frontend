import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUsers, FiDollarSign, FiAward } from "react-icons/fi";

const MissionSection = () => {
  const features = [
    {
      icon: <FiUsers size={32} />,
      title: "Inscripción online",
      description: "Acceso 24/7 desde cualquier dispositivo",
    },
    {
      icon: <FiDollarSign size={32} />,
      title: "Pagos integrados",
      description: "Múltiples métodos seguros y confiables",
    },
    {
      icon: <FiAward size={32} />,
      title: "Certificados con QR",
      description: "Verificación inmediata y automática",
    },
  ];

  return (
    <SectionContainer id="nosotros">
      <ContentWrapper>
        <SectionHeader
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>
            Nuestra <Highlight>misión</Highlight>
          </SectionTitle>
          <SectionDescription>
            Transformar la experiencia académica de los estudiantes y
            profesionales de la UNAS, simplificando la inscripción a eventos
            educativos y proporcionando certificados digitales confiables y
            verificables.
          </SectionDescription>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </ContentWrapper>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  scroll-margin-top: 100px; /* altura del header */
  padding: 100px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -30%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(
      circle,
      rgba(79, 124, 255, 0.04) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -40%;
    right: -15%;
    width: 700px;
    height: 700px;
    background: radial-gradient(
      circle,
      rgba(79, 124, 255, 0.03) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Highlight = styled.span`
  color: #4f7cff;
  background: linear-gradient(135deg, #4f7cff 0%, #6b92ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionDescription = styled.p`
  font-size: 1.0625rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0 auto;
  max-width: 800px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 36px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 24px rgba(79, 124, 255, 0.12);
    border-color: rgba(79, 124, 255, 0.2);
  }
`;

const IconWrapper = styled.div`
  color: #4f7cff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
`;

export default MissionSection;
