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
        <SectionTitle>Programas y eventos</SectionTitle>
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
  background: #fafbff;
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
  color: #1a1a1a;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #666;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
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
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  min-height: 50px;

  @media (max-width: 768px) {
    font-size: 1rem;
    min-height: auto;
  }
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;

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
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
`;

const PriceLabel = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4F7CFF;
`;

const ViewEventButton = styled(motion.button)`
  background: #E8EFFF;
  color: #4F7CFF;
  border: none;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
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
  background: #4F7CFF;
  color: white;
  border: none;
  padding: 16px 40px;
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

export default EventsSection;