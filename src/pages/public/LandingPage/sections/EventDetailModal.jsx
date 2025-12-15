// src/pages/public/LandingPage/sections/EventDetailModal.jsx
// Modal de detalle de evento para la landing page pública

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiInfo,
  FiList,
  FiAward,
  FiDollarSign,
  FiVideo,
  FiHome,
  FiGlobe,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ============================================
// HELPERS
// ============================================
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'd MMM yyyy', { locale: es });
  } catch {
    return dateString;
  }
};

const formatFullDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: es });
  } catch {
    return dateString;
  }
};

const formatTime = (timeValue) => {
  if (!timeValue) return '-';
  
  // Si es objeto con hour/minute
  if (typeof timeValue === 'object' && timeValue.hour !== undefined) {
    const hour = String(timeValue.hour).padStart(2, '0');
    const minute = String(timeValue.minute || 0).padStart(2, '0');
    return `${hour}:${minute}`;
  }
  
  // Si es string HH:MM
  if (typeof timeValue === 'string') {
    return timeValue.substring(0, 5);
  }
  
  return '-';
};

const getModalidadInfo = (modalidad) => {
  const modalidades = {
    PRESENCIAL: { icon: FiHome, color: '#10b981', bg: '#ecfdf5', label: 'Presencial' },
    VIRTUAL: { icon: FiVideo, color: '#6366f1', bg: '#eef2ff', label: 'Virtual' },
    HIBRIDO: { icon: FiGlobe, color: '#f59e0b', bg: '#fffbeb', label: 'Híbrido' },
  };
  return modalidades[modalidad] || modalidades.PRESENCIAL;
};

const getEstadoInfo = (estado) => {
  const estados = {
    'EN_CURSO': { color: '#10b981', bg: '#ecfdf5', label: 'En Curso' },
    'ACTIVO': { color: '#10b981', bg: '#ecfdf5', label: 'Activo' },
    'PROXIMO': { color: '#3b82f6', bg: '#eff6ff', label: 'Próximo' },
    'FINALIZADO': { color: '#6b7280', bg: '#f3f4f6', label: 'Finalizado' },
    'CANCELADO': { color: '#ef4444', bg: '#fef2f2', label: 'Cancelado' },
  };
  return estados[estado] || { color: '#6b7280', bg: '#f3f4f6', label: estado || 'N/A' };
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const EventDetailModal = ({ activity, isOpen, onClose }) => {
  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!activity) return null;

  const modalidadInfo = getModalidadInfo(activity.modalidad);
  const estadoInfo = getEstadoInfo(activity.estado);
  const ModalidadIcon = modalidadInfo.icon;

  const handleInscribirse = () => {
    // Redirigir a registro o mostrar modal de login
    window.location.href = `/registro?actividad=${activity.id}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalWrapper>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <ModalContainer
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Botón cerrar */}
            <CloseButton onClick={onClose}>
              <FiX size={20} />
            </CloseButton>

            {/* Banner */}
            <BannerContainer>
              {activity.imagen ? (
                <BannerImage src={activity.imagen} alt={activity.titulo} />
              ) : (
                <BannerPlaceholder>
                  <FiCalendar size={48} />
                </BannerPlaceholder>
              )}
            </BannerContainer>

            {/* Contenido scrolleable */}
            <ModalContent>
              {/* Título */}
              <TitleSection>
                <ActivityTitle>{activity.titulo}</ActivityTitle>
              </TitleSection>

              {/* Quick Info Pills */}
              <QuickInfoGrid>
                <QuickInfoPill>
                  <FiCalendar size={16} />
                  <span><strong>Fecha Inicio</strong></span>
                  <span>{formatDate(activity.fechaInicio)}</span>
                </QuickInfoPill>
                
                <QuickInfoPill>
                  <FiClock size={16} />
                  <span><strong>Horario</strong></span>
                  <span>{formatTime(activity.horaInicio)} - {formatTime(activity.horaFin)}</span>
                </QuickInfoPill>
                
                <QuickInfoPill $color={estadoInfo.color} $bg={estadoInfo.bg}>
                  <FiInfo size={16} />
                  <span><strong>Estado</strong></span>
                  <span style={{ color: estadoInfo.color }}>{estadoInfo.label}</span>
                </QuickInfoPill>
              </QuickInfoGrid>

              {/* Descripción */}
              <Section>
                <SectionTitle>
                  <FiInfo size={18} />
                  Descripción de la actividad
                </SectionTitle>
                <Description>
                  {activity.descripcion || 'Sin descripción disponible.'}
                </Description>
              </Section>

              {/* Fechas y Duración */}
              <Section>
                <SectionTitle>
                  <FiCalendar size={18} />
                  Fechas y duración
                </SectionTitle>
                <DateGrid>
                  <DateCard>
                    <DateLabel>Fecha de Inicio</DateLabel>
                    <DateValue>{formatFullDate(activity.fechaInicio)}</DateValue>
                  </DateCard>
                  <DateCard>
                    <DateLabel>Fecha de Finalización</DateLabel>
                    <DateValue>{formatFullDate(activity.fechaFin)}</DateValue>
                  </DateCard>
                </DateGrid>
                
                {activity.lugar && (
                  <LocationChip>
                    <FiMapPin size={16} />
                    {activity.lugar}
                  </LocationChip>
                )}
              </Section>

              {/* Modalidad */}
              <Section>
                <ModalidadBadge $color={modalidadInfo.color} $bg={modalidadInfo.bg}>
                  <ModalidadIcon size={18} />
                  {modalidadInfo.label}
                </ModalidadBadge>
              </Section>

              {/* Sesiones */}
              <Section>
                <SectionTitle>
                  <FiList size={18} />
                  Sesiones
                </SectionTitle>
                
                {activity.sesiones && activity.sesiones.length > 0 ? (
                  <SessionsList>
                    {activity.sesiones.map((sesion, index) => (
                      <SessionCard key={sesion.id || index}>
                        <SessionNumber>{index + 1}</SessionNumber>
                        <SessionInfo>
                          <SessionTitle>{sesion.titulo || `Sesión ${index + 1}`}</SessionTitle>
                          <SessionMeta>
                            <FiCalendar size={14} />
                            {formatDate(sesion.fecha)}
                            <FiClock size={14} />
                            {formatTime(sesion.horaInicio)} - {formatTime(sesion.horaFin)}
                          </SessionMeta>
                        </SessionInfo>
                      </SessionCard>
                    ))}
                  </SessionsList>
                ) : (
                  <EmptySessionsCard>
                    <EmptyIcon>📭</EmptyIcon>
                    <EmptyText>Aún no hay sesiones registradas</EmptyText>
                  </EmptySessionsCard>
                )}
              </Section>

              {/* Información adicional */}
              <Section>
                <SectionTitle>
                  <FiAward size={18} />
                  Organización y patrocinio
                </SectionTitle>
                <InfoGrid>
                  {activity.organizador && (
                    <InfoItem>
                      <InfoLabel>Organizador</InfoLabel>
                      <InfoValue>{activity.organizador}</InfoValue>
                    </InfoItem>
                  )}
                  {activity.vacantes && (
                    <InfoItem>
                      <InfoLabel>Vacantes</InfoLabel>
                      <InfoValue>
                        <FiUsers size={14} />
                        {activity.vacantes} disponibles
                      </InfoValue>
                    </InfoItem>
                  )}
                  {activity.precio !== undefined && (
                    <InfoItem>
                      <InfoLabel>Inversión</InfoLabel>
                      <InfoValue $highlight>
                        <FiDollarSign size={14} />
                        {activity.precio > 0 ? `S/ ${activity.precio.toFixed(2)}` : 'Gratuito'}
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </Section>

              {/* Botón de inscripción */}
              <ActionSection>
                <InscribirseButton
                  onClick={handleInscribirse}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Inscribirme ahora
                </InscribirseButton>
              </ActionSection>
            </ModalContent>
          </ModalContainer>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
};

// ============================================
// STYLED COMPONENTS
// ============================================
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
  z-index: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 95vh;
    border-radius: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #1a1a2e;
    color: #ffffff;
    transform: scale(1.05);
  }
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 180px;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BannerPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.9;
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px 32px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 20px;
`;

const ActivityTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const QuickInfoGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const QuickInfoPill = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 18px;
  background: ${props => props.$bg || '#f0f4ff'};
  border-radius: 14px;
  flex: 1;
  min-width: 140px;

  svg {
    color: ${props => props.$color || '#4f7cff'};
    margin-bottom: 4px;
  }

  span:first-of-type {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  span:last-of-type {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a2e;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: 10px 14px;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 14px 0;

  svg {
    color: #4f7cff;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DateCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
`;

const DateLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const DateValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a2e;
`;

const LocationChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f8fafc;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #64748b;
  border: 1px solid #e2e8f0;

  svg {
    color: #4f7cff;
  }
`;

const ModalidadBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${props => props.$bg || '#f0f4ff'};
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$color || '#4f7cff'};
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SessionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const SessionNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4f7cff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const SessionInfo = styled.div`
  flex: 1;
`;

const SessionTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
`;

const SessionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #64748b;

  svg {
    color: #94a3b8;
  }
`;

const EmptySessionsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.$highlight ? '#10b981' : '#1a1a2e'};

  svg {
    color: ${props => props.$highlight ? '#10b981' : '#64748b'};
  }
`;

const ActionSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const InscribirseButton = styled(motion.button)`
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(79, 124, 255, 0.4);

  &:hover {
    box-shadow: 0 6px 20px rgba(79, 124, 255, 0.5);
  }
`;

export default EventDetailModal;