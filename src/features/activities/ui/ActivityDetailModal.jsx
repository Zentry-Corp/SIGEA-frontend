// src/features/activities/ui/ActivityDetailModal.jsx
// 🎨 DISEÑO LIMPIO Y MINIMALISTA - Estilo profesional

import React, { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionsByActivity } from "../../sessions";
import SessionList from "../../sessions/ui/SessionList";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiUsers,
  FiInfo,
  FiEdit3,
  FiUpload,
  FiPlayCircle,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiPauseCircle,
} from "react-icons/fi";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ActivityDetailModal = ({ activity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Helper para obtener color según estado
  const estadoConfigMap = {
    BORRADOR: {
      color: "#6B7280",
      icon: <FiEdit3 />,
    },
    PUBLICADO: {
      color: "#2563EB",
      icon: <FiUpload />,
    },
    EN_CURSO: {
      color: "#059669",
      icon: <FiPlayCircle />,
    },
    FINALIZADO: {
      color: "#6366F1",
      icon: <FiCheckCircle />,
    },
    CANCELADO: {
      color: "#DC2626",
      icon: <FiXCircle />,
    },
    SUSPENDIDO: {
      color: "#D97706",
      icon: <FiPauseCircle />,
    },
  };

  const getEstadoConfig = (codigo) =>
    estadoConfigMap[codigo] || {
      color: "#64748b",
      icon: <FiEdit3 />,
    };
  const { sesiones = [], loading: loadingSesiones } = useSessionsByActivity(
    activity?.id
  );
  

  // Helper para formatear fechas
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatFullDate = (dateString) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  if (!activity) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalWrapper>
          {/* Overlay */}
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <ModalContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>

            {/* Header con Imagen */}
            {activity.bannerUrl && (
              <BannerWrapper>
                <BannerImage src={activity.bannerUrl} alt={activity.titulo} />
              </BannerWrapper>
            )}

            {/* Content */}
            <ModalContent>
              {/* Title Section */}
              <TitleSection>
                <ActivityTitle>{activity.titulo}</ActivityTitle>
              </TitleSection>

              {/* Info Cards */}
              <InfoCardsGrid>
                <InfoCard>
                  <IconWrapper>
                    <FiCalendar />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Fecha inicio</InfoLabel>
                    <InfoValue>{formatDate(activity.fechaInicio)}</InfoValue>
                  </InfoContent>
                </InfoCard>

                <InfoCard>
                  <IconWrapper>
                    <FiClock />
                  </IconWrapper>
                  <InfoContent>
                    <InfoLabel>Horario</InfoLabel>
                    <InfoValue>
                      {activity.horaInicio} - {activity.horaFin}
                    </InfoValue>
                  </InfoContent>
                </InfoCard>

                <InfoCard>
                  <IconWrapper
                    $color={getEstadoConfig(activity.estado?.codigo).color}
                  >
                    {getEstadoConfig(activity.estado?.codigo).icon}
                  </IconWrapper>

                  <InfoContent>
                    <InfoLabel>Estado</InfoLabel>
                    <InfoValue
                      $color={getEstadoConfig(activity.estado?.codigo).color}
                    >
                      {activity.estado?.etiqueta}
                    </InfoValue>
                  </InfoContent>
                </InfoCard>
              </InfoCardsGrid>

              {/* Description */}
              <Section>
                <SectionHeader>
                  <FiInfo />
                  <SectionTitle>Descripción de la actividad</SectionTitle>
                </SectionHeader>
                <Description>{activity.descripcion}</Description>
              </Section>

              {/* Fechas y duración */}
              <Section>
                <SectionHeader>
                  <FiCalendar />
                  <SectionTitle>Fechas y duración</SectionTitle>
                </SectionHeader>
                <DatesGrid>
                  <DateBox>
                    <DateLabel>Fecha de inicio</DateLabel>
                    <DateValue>
                      {formatFullDate(activity.fechaInicio)}
                    </DateValue>
                  </DateBox>
                  <DateBox>
                    <DateLabel>Fecha de finalización</DateLabel>
                    <DateValue>{formatFullDate(activity.fechaFin)}</DateValue>
                  </DateBox>
                </DatesGrid>
                {activity.ubicacion && (
                  <LocationInfo>
                    <FiMapPin />
                    <span>{activity.ubicacion}</span>
                  </LocationInfo>
                )}
              </Section>

              <Section>
                <SectionHeader>
                  <FiList />
                  <SectionTitle>Sesiones</SectionTitle>
                </SectionHeader>

                {loadingSesiones ? (
                  <span>Cargando sesiones...</span>
                ) : (
                  <SessionList sessions={sesiones} loading={loadingSesiones} />
                )}
              </Section>

              {/* Organización */}
              {(activity.coOrganizador || activity.sponsor) && (
                <Section>
                  <SectionHeader>
                    <FiUsers />
                    <SectionTitle>Organización y patrocinio</SectionTitle>
                  </SectionHeader>
                  <OrganizationContent>
                    {activity.coOrganizador && (
                      <OrgItem>
                        <OrgLabel>Co-organizador</OrgLabel>
                        <OrgValue>{activity.coOrganizador}</OrgValue>
                      </OrgItem>
                    )}
                    {activity.sponsor && (
                      <OrgItem>
                        <OrgLabel>Patrocinadores</OrgLabel>
                        <OrgValue>{activity.sponsor}</OrgValue>
                      </OrgItem>
                    )}
                  </OrganizationContent>
                </Section>
              )}

              {/* Información de pago */}
              {activity.numeroYape && (
                <Section>
                  <SectionHeader>
                    <FiPhone />
                    <SectionTitle>Información de pago</SectionTitle>
                  </SectionHeader>
                  <PaymentInfo>
                    <PaymentLabel>Número Yape</PaymentLabel>
                    <PaymentValue>{activity.numeroYape}</PaymentValue>
                  </PaymentInfo>
                </Section>
              )}

              {/* Footer Button */}
              <FooterButton onClick={onClose}>Cerrar</FooterButton>
            </ModalContent>
          </ModalContainer>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default ActivityDetailModal;

/* ============================================
   🎨 STYLED COMPONENTS - DISEÑO LIMPIO
============================================ */

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
  max-width: 600px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 95%;
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
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    background: #1a1a2e;
    color: #ffffff;
  }
`;

const BannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px; /* antes 240px */
  overflow: hidden;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    height: 150px;
  }

  /* Overlay para bajar agresividad visual */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(15, 23, 42, 0.15),
      rgba(15, 23, 42, 0.35)
    );
    pointer-events: none;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02); /* micro zoom para recorte más pro */
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;

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

/* TITLE SECTION */
const TitleSection = styled.div`
  margin-bottom: 24px;
`;

const ActivityTitle = styled.h2`
  martin-top: 8px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
  line-height: 1.3;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TypeBadge = styled.div`
  display: inline-flex;
  padding: 6px 14px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
  padding: 4px 10px;
  opacity: 0.85;
`;

/* INFO CARDS */
const InfoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 10px;
  color: ${(props) => props.$color || "#5B7CFF"};
  flex-shrink: 0;

  svg {
    font-size: 1rem;
  }
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: 0.9375rem;
  font-weight: ${(p) => (p.$highlight ? 700 : 600)};
  color: ${(props) => props.$color || "#1a1a2e"};
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* SECTIONS */
const Section = styled.div`
  margin-bottom: 28px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;

  svg {
    font-size: 1.125rem;
    color: #5b7cff;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.7;
  margin: 0;
  max-width: 640px;
  white-space: pre-wrap;
`;

/* DATES GRID */
const DatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DateBox = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
`;

const DateLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
`;

const DateValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.9375rem;
  color: #475569;
  font-weight: 500;

  svg {
    font-size: 1rem;
    color: #5b7cff;
    flex-shrink: 0;
  }
`;

/* ORGANIZATION */
const OrganizationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrgItem = styled.div`
  background: #f9fafb; // un poco más claro
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
`;

const OrgLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
`;

const OrgValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
`;

/* PAYMENT INFO */
const PaymentInfo = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
`;

const PaymentLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
`;

const PaymentValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 0.3px;
`;

/* FOOTER BUTTON */
const FooterButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 24px;

  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;

  color: #0f172a;
  font-size: 0.9375rem;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  &:active {
    transform: scale(0.99);
  }
`;
