import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Elige un evento',
      description: 'Explora programas, cursos, talleres y conferencias vigentes.'
    },
    {
      number: 2,
      title: 'Inscríbete y paga',
      description: 'Completa tus datos y paga en línea o en caja.'
    },
    {
      number: 3,
      title: 'Confirma tu asistencia',
      description: 'Recibe tu QR de registro y accede al evento.'
    },
    {
      number: 4,
      title: 'Obtén tu certificado',
      description: 'Se genera automáticamente al finalizar.'
    }
  ];

  return (
    <SectionContainer>
      <SectionTitle
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        ¿Cómo funciona SIGEA?
      </SectionTitle>
      <SectionSubtitle
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Un proceso simple en 4 pasos para inscribirte en tus eventos académicos favoritos.
      </SectionSubtitle>

      <StepsGrid>
  {steps.map((step, index) => (
    <StepCard
      key={step.number}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
    >
      <StepNumber>{step.number}</StepNumber>
      <StepContent>
        <StepTitle>{step.title}</StepTitle>
        <StepDescription>{step.description}</StepDescription>
      </StepContent>
    </StepCard>
  ))}
</StepsGrid>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: 100px 20px;
  background: #ffffff;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: #666;
  text-align: center;
  margin: 0 0 60px 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 40px;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
  position: relative;

  /* Línea conectora entre pasos */
  &::before {
    content: '';
    position: absolute;
    top: 50px;
    left: 8%;
    right: 8%;
    height: 2px;
    background: linear-gradient(90deg, #4F7CFF 0%, #8B9FFF 50%, #4F7CFF 100%);
    z-index: 0;
  }

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    &::before {
      display: none;
    }
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    &::before {
      display: none;
    }
  }
`;

const StepCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 35px 25px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  z-index: 1;
  border: 2px solid transparent;

  &:hover {
    box-shadow: 0 12px 35px rgba(79, 124, 255, 0.2);
    transform: translateY(-8px);
    border-color: #4F7CFF;
  }

  @media (max-width: 580px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const StepNumber = styled.div`
  min-width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4F7CFF 0%, #6B8FFF 100%);
  color: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(79, 124, 255, 0.3);
  flex-shrink: 0;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;


const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const StepDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

export default HowItWorksSection;