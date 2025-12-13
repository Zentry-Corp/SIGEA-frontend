import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Juan A.',
      role: 'Estudiante',
      detail: 'Ciclo VII 2025',
      rating: 5,
      comment: 'La plataforma es muy fácil de usar. Me permitió inscribirme en solo 5 minutos.',
      initial: 'J',
      color: '#4F7CFF'
    },
    {
      id: 2,
      name: 'María G.',
      role: 'Profesional',
      detail: 'Curso de Sostenibilidad',
      rating: 5,
      comment: 'Excelente experiencia. El certificado digital fue muy útil para mis credenciales.',
      initial: 'M',
      color: '#4F7CFF'
    },
    {
      id: 3,
      name: 'Carlos M.',
      role: 'Investigador',
      detail: 'Conferencia Científica',
      rating: 4,
      comment: 'El sistema de pago fue seguro y rápido. Muy recomendado.',
      initial: 'C',
      color: '#4F7CFF'
    }
  ];

  return (
    <SectionContainer>
      <SectionHeader
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle>Lo que dicen nuestros <Highlight>usuarios</Highlight></SectionTitle>
        <SectionSubtitle>
          Experiencias reales de estudiantes y profesionales que confían en SIGEA.
        </SectionSubtitle>
      </SectionHeader>

      <TestimonialsGrid>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
          >
            <Rating>
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  $filled={i < testimonial.rating}
                >
                  <FiStar size={18} fill={i < testimonial.rating ? '#4F7CFF' : 'none'} />
                </StarIcon>
              ))}
            </Rating>

            <Comment>{testimonial.comment}</Comment>

            <UserInfo>
              <Avatar $color={testimonial.color}>
                {testimonial.initial}
              </Avatar>
              <UserDetails>
                <UserName>{testimonial.name}</UserName>
                <UserRole>{testimonial.role} · {testimonial.detail}</UserRole>
              </UserDetails>
            </UserInfo>
          </TestimonialCard>
        ))}
      </TestimonialsGrid>
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
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
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

const SectionSubtitle = styled.p`
  font-size: 1.0625rem;
  color: #64748b;
  margin: 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: #f8fafc;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;

  &:hover {
    background: white;
    box-shadow: 0 8px 24px rgba(79, 124, 255, 0.1);
    border-color: #e2e8f0;
  }
`;

const Rating = styled.div`
  display: flex;
  gap: 6px;
`;

const StarIcon = styled.div`
  color: ${props => props.$filled ? '#4F7CFF' : '#cbd5e1'};
`;

const Comment = styled.p`
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.65;
  margin: 0;
  font-style: italic;
  flex: 1;
  font-weight: 400;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
`;

const UserRole = styled.span`
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 400;
`;

export default TestimonialsSection;