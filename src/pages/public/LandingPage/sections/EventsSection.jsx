import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: 'Curso Avanzado de Sostenibilidad Ambiental',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      dateRange: '15 - 20 Mar 2025',
      time: '14:00 - 16:00 h',
      modality: 'Presencial',
      price: 'S/ 150.00'
    },
    {
      id: 2,
      title: 'Taller de Investigación Científica',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      dateRange: '22 - 26 Mar 2025',
      time: '10:00 - 12:00 h',
      modality: 'Virtual',
      price: 'S/ 80.00'
    },
    {
      id: 3,
      title: 'Conferencia Internacional de Agroecología',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      dateRange: '10 - 12 Abr 2025',
      time: '09:00 - 13:00 h',
      modality: 'Híbrido',
      price: 'Desde S/ 50.00'
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
        <SectionTitle>Programas y <Highlight>eventos</Highlight></SectionTitle>
        <SectionSubtitle>
          Explora nuestra oferta académica de cursos, talleres y conferencias.
        </SectionSubtitle>
      </SectionHeader>

      <EventsGrid>
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
          >
            <EventImage
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <EventContent>
              <EventTitle>{event.title}</EventTitle>

              <EventInfo>
                <InfoItem>
                  <FiCalendar size={16} />
                  <span>{event.dateRange}</span>
                </InfoItem>
                <InfoItem>
                  <FiClock size={16} />
                  <span>{event.time}</span>
                </InfoItem>
                <InfoItem>
                  <FiMapPin size={16} />
                  <ModalityBadge $modality={event.modality}>
                    {event.modality}
                  </ModalityBadge>
                </InfoItem>
              </EventInfo>

              <PriceSection>
                <PriceLabel>Desde</PriceLabel>
                <Price>{event.price}</Price>
              </PriceSection>

              <ViewEventButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver evento
              </ViewEventButton>
            </EventContent>
          </EventCard>
        ))}
      </EventsGrid>

      <ViewAllButtonWrapper>
        <ViewAllButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver todos los eventos
        </ViewAllButton>
      </ViewAllButtonWrapper>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: 100px 20px;
  background: #f8fafc;
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
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 50px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #e2e8f0;
  }
`;

const EventImage = styled.div`
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: #e5e7eb;
`;

const EventContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const EventTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.4;
  min-height: 48px;

  @media (max-width: 768px) {
    font-size: 1rem;
    min-height: auto;
  }
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 400;

  svg {
    color: #4F7CFF;
    flex-shrink: 0;
  }
`;

const ModalityBadge = styled.span`
  background: ${props => {
    if (props.$modality === 'Virtual') return '#E0F2FE';
    if (props.$modality === 'Híbrido') return '#FEF3C7';
    return '#F0F4FF';
  }};
  color: ${props => {
    if (props.$modality === 'Virtual') return '#0369A1';
    if (props.$modality === 'Híbrido') return '#92400E';
    return '#4F7CFF';
  }};
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  padding-top: 8px;
`;

const PriceLabel = styled.span`
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4F7CFF;
  letter-spacing: -0.01em;
`;

const ViewEventButton = styled(motion.button)`
  background: #E8EFFF;
  color: #4F7CFF;
  border: none;
  padding: 13px 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: #D6E4FF;
  }
`;

const ViewAllButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ViewAllButton = styled(motion.button)`
  background: linear-gradient(135deg, #4F7CFF 0%, #3b63e0 100%);
  color: white;
  border: none;
  padding: 16px 40px;
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

export default EventsSection;