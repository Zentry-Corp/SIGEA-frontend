// src/pages/public/LandingPage/sections/EventsSection.jsx
// Sección de eventos con carrusel profesional - REDISEÑO UI/UX

import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
  FiVideo,
  FiHome,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePublicActivities } from "@/features/activities/hooks/usePublicActivities";
import EventDetailModal from "./EventDetailModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// ============================================
// HELPERS
// ============================================
const formatDateRange = (inicio, fin) => {
  if (!inicio) return "-";
  try {
    const startDate = new Date(inicio);
    const endDate = fin ? new Date(fin) : null;

    const startDay = startDate.getDate();
    const startMonth = format(startDate, "MMM", { locale: es });
    const startYear = startDate.getFullYear();

    if (endDate) {
      const endDay = endDate.getDate();
      const endMonth = format(endDate, "MMM", { locale: es });

      if (startMonth === endMonth) {
        return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
      }
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }

    return `${startDay} ${startMonth} ${startYear}`;
  } catch {
    return inicio;
  }
};

const formatTime = (timeValue) => {
  if (!timeValue) return "-";

  if (typeof timeValue === "object" && timeValue.hour !== undefined) {
    const hour = String(timeValue.hour).padStart(2, "0");
    const minute = String(timeValue.minute || 0).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  if (typeof timeValue === "string") {
    return timeValue.substring(0, 5);
  }

  return "-";
};

const getModalidadInfo = (modalidad) => {
  const modalidades = {
    PRESENCIAL: { icon: FiHome, label: "Presencial", color: "#0EA5E9" },
    VIRTUAL: { icon: FiVideo, label: "Virtual", color: "#8B5CF6" },
    HIBRIDO: { icon: FiGlobe, label: "Híbrido", color: "#F59E0B" },
  };
  return modalidades[modalidad] || modalidades.PRESENCIAL;
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const EventsSection = () => {
  const navigate = useNavigate();
  const { activities, loading, error, isEmpty, refetch } =
    usePublicActivities(12);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrusel state
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);

  // Calcular cards visibles según viewport
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1);
      } else if (width < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Actualizar estado de navegación
  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = clientWidth / visibleCards;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(newIndex);
  }, [visibleCards]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", updateScrollState);
    updateScrollState();

    return () => carousel.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState, activities]);

  // Navegación del carrusel
  const scrollTo = useCallback(
    (direction) => {
      if (!carouselRef.current) return;

      const carousel = carouselRef.current;
      const cardWidth = carousel.clientWidth / visibleCards;
      const scrollAmount = cardWidth * visibleCards;

      const newScrollLeft =
        direction === "left"
          ? carousel.scrollLeft - scrollAmount
          : carousel.scrollLeft + scrollAmount;

      carousel.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    },
    [visibleCards]
  );

  // Ir a un índice específico (para dots)
  const goToIndex = useCallback(
    (index) => {
      if (!carouselRef.current) return;

      const carousel = carouselRef.current;
      const cardWidth = carousel.clientWidth / visibleCards;

      carousel.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    },
    [visibleCards]
  );

  // Calcular número de páginas para los dots
  const totalPages = Math.ceil(activities.length / visibleCards);
  const currentPage = Math.floor(currentIndex / visibleCards);

  const handleVerEvento = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleRegisterRedirect = (activity) => {
    navigate("/register", {
      state: { activityId: activity.id },
    });
  };

  // Estado de carga
  if (loading) {
    return (
      <SectionContainer id="programas">
        <SectionHeader>
          <SectionTitle>Programas y eventos</SectionTitle>
          <SectionSubtitle>
            Explora nuestra oferta académica de cursos, talleres y conferencias.
          </SectionSubtitle>
        </SectionHeader>
        <LoadingContainer>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiRefreshCw size={32} />
          </LoadingSpinner>
          <LoadingText>Cargando eventos...</LoadingText>
        </LoadingContainer>
      </SectionContainer>
    );
  }

  // Estado de error
  if (error) {
    return (
      <SectionContainer id="programas">
        <SectionHeader>
          <SectionTitle>Programas y eventos</SectionTitle>
          <SectionSubtitle>
            Explora nuestra oferta académica de cursos, talleres y conferencias.
          </SectionSubtitle>
        </SectionHeader>
        <ErrorContainer>
          <FiAlertCircle size={48} color="#ef4444" />
          <ErrorText>No pudimos cargar los eventos</ErrorText>
          <RetryButton onClick={refetch}>
            <FiRefreshCw size={18} />
            Reintentar
          </RetryButton>
        </ErrorContainer>
      </SectionContainer>
    );
  }

  // Sin eventos
  if (isEmpty || !activities || activities.length === 0) {
    return (
      <SectionContainer id="programas">
        <SectionHeader
          as={motion.div}
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
        <EmptyContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EmptyIcon>📅</EmptyIcon>
          <EmptyText>Próximamente nuevos eventos</EmptyText>
          <EmptySubtext>
            Inicia sesión para ver los eventos disponibles o vuelve pronto para
            conocer nuestra oferta académica
          </EmptySubtext>
          <EmptyActions>
            <LoginButton onClick={() => navigate("/login")}>
              Iniciar sesión
            </LoginButton>
          </EmptyActions>
        </EmptyContainer>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="programas">
      <SectionHeader
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <TitleRow>
          <div>
            <SectionTitle>Programas y eventos</SectionTitle>
            <SectionSubtitle>
              Explora nuestra oferta académica de cursos, talleres y
              conferencias.
            </SectionSubtitle>
          </div>

          {/* Navegación del carrusel - Desktop */}
          {activities.length > visibleCards && (
            <NavButtons>
              <NavButton
                onClick={() => scrollTo("left")}
                disabled={!canScrollLeft}
                aria-label="Anterior"
              >
                <FiChevronLeft size={22} />
              </NavButton>
              <NavButton
                onClick={() => scrollTo("right")}
                disabled={!canScrollRight}
                aria-label="Siguiente"
              >
                <FiChevronRight size={22} />
              </NavButton>
            </NavButtons>
          )}
        </TitleRow>
      </SectionHeader>

      {/* Carrusel */}
      <CarouselWrapper>
        <CarouselTrack ref={carouselRef}>
          {activities.map((activity, index) => {
            const modalidadInfo = getModalidadInfo(activity.modalidad);
            const ModalidadIcon = modalidadInfo.icon;
            const isFree = !activity.precio || activity.precio === 0;

            return (
              <EventCard
                key={activity.id}
                as={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.1, 0.3),
                }}
              >
                <CardInner
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* IMAGEN CON OVERLAY Y BADGE FLOTANTE */}
                  <EventImageWrapper>
                    <EventImage>
                      {activity.imagen ? (
                        <img src={activity.imagen} alt={activity.titulo} />
                      ) : (
                        <ImagePlaceholder>
                          <FiCalendar size={40} />
                        </ImagePlaceholder>
                      )}
                      <ImageOverlay />
                    </EventImage>

                    {/* Badge de modalidad flotante */}
                    <ModalityBadgeFloating $color={modalidadInfo.color}>
                      <ModalidadIcon size={14} />
                      <span>{modalidadInfo.label}</span>
                    </ModalityBadgeFloating>
                  </EventImageWrapper>

                  {/* CONTENIDO */}
                  <EventContent>
                    {/* Título - Nivel 1 */}
                    <EventTitle>{activity.titulo}</EventTitle>

                    {/* Información clave - Nivel 2 y 3 */}
                    <EventMetadata>
                      <MetadataItem $primary>
                        <FiCalendar size={16} />
                        <span>
                          {formatDateRange(
                            activity.fechaInicio,
                            activity.fechaFin
                          )}
                        </span>
                      </MetadataItem>
                      <MetadataItem>
                        <FiClock size={16} />
                        <span>
                          {formatTime(activity.horaInicio)} -{" "}
                          {formatTime(activity.horaFin)}
                        </span>
                      </MetadataItem>
                    </EventMetadata>

                    {/* Precio - Nivel 4 */}
                    <PriceSection>
                      <PriceLabel>Inversión</PriceLabel>
                      <PriceValue $isFree={isFree}>
                        {isFree ? "Gratis" : `S/ ${activity.precio.toFixed(2)}`}
                      </PriceValue>
                    </PriceSection>

                    {/* CTA - Nivel 5 */}
                    <CTAButton
                      onClick={() => handleRegisterRedirect(activity)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ver detalles
                    </CTAButton>
                  </EventContent>
                </CardInner>
              </EventCard>
            );
          })}
        </CarouselTrack>

        {/* Gradient overlays */}
        <GradientLeft $visible={canScrollLeft} />
        <GradientRight $visible={canScrollRight} />
      </CarouselWrapper>

      {/* Indicadores (Dots) */}
      {totalPages > 1 && (
        <DotsContainer>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Dot
              key={index}
              $active={index === currentPage}
              onClick={() => goToIndex(index * visibleCards)}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </DotsContainer>
      )}

      {/* Navegación móvil */}
      {activities.length > visibleCards && (
        <MobileNavButtons>
          <MobileNavButton
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
          >
            <FiChevronLeft size={20} />
            Anterior
          </MobileNavButton>
          <PageIndicator>
            {currentPage + 1} / {totalPages}
          </PageIndicator>
          <MobileNavButton
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
          >
            Siguiente
            <FiChevronRight size={20} />
          </MobileNavButton>
        </MobileNavButtons>
      )}


      {/* Modal de detalle */}
      <EventDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </SectionContainer>
  );
};

// ============================================
// STYLED COMPONENTS - REDISEÑADOS
// ============================================

const SectionContainer = styled.section`
  padding: 100px 20px;
  background: #fafbff;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 48px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;

    & > div {
      width: 100%;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  max-width: 500px;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: white;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #4f7cff;
    border-color: #4f7cff;
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding: 10px 4px 20px;
  margin: -10px -4px -20px;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EventCard = styled.div`
  flex: 0 0 calc((100% - 48px) / 3);
  min-width: calc((100% - 48px) / 3);
  scroll-snap-align: start;

  @media (max-width: 1024px) {
    flex: 0 0 calc((100% - 24px) / 2);
    min-width: calc((100% - 24px) / 2);
  }

  @media (max-width: 640px) {
    flex: 0 0 100%;
    min-width: 100%;
  }
`;

const CardInner = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease-out;

  &:hover {
    box-shadow: 0 12px 48px rgba(15, 23, 42, 0.12);
  }
`;

const GradientLeft = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(to right, #fafbff 0%, transparent 100%);
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s;
  z-index: 2;

  @media (max-width: 640px) {
    width: 30px;
  }
`;

const GradientRight = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(to left, #fafbff 0%, transparent 100%);
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s;
  z-index: 2;

  @media (max-width: 640px) {
    width: 30px;
  }
`;

// ============================================
// NUEVA ESTRUCTURA DE IMAGEN CON OVERLAY
// ============================================

const EventImageWrapper = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
`;

const EventImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.4s ease-out;
  }

  ${CardInner}:hover & img {
    transform: scale(1.08);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0) 0%,
    rgba(15, 23, 42, 0.15) 100%
  );
  pointer-events: none;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.9;
`;

// Badge flotante con glassmorphism
const ModalityBadgeFloating = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${(props) => `${props.$color}15`};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${(props) => `${props.$color}20`};
  border-radius: 10px;
  color: ${(props) => props.$color};
  font-size: 0.8125rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;

  svg {
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
  }
`;

// ============================================
// CONTENIDO CON JERARQUÍA MEJORADA
// ============================================

const EventContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// NIVEL 1: Título dominante
const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;
`;

// NIVEL 2 y 3: Metadata agrupada sin iconos redundantes
const EventMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${(props) => (props.$primary ? "0.9375rem" : "0.875rem")};
  font-weight: ${(props) => (props.$primary ? "500" : "400")};
  color: ${(props) => (props.$primary ? "#475569" : "#64748b")};

  svg {
    color: #94a3b8;
    flex-shrink: 0;
    opacity: 0.7;
  }

  span {
    line-height: 1.4;
  }
`;

// NIVEL 4: Precio con sistema correcto
const PriceSection = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
`;

const PriceLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const PriceValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => (props.$isFree ? "#059669" : "#0f172a")};
  letter-spacing: -0.02em;

  /* Si es gratis, usar peso medio para balance visual */
  font-weight: ${(props) => (props.$isFree ? "600" : "700")};
`;

// NIVEL 5: CTA dominante y claro
const CTAButton = styled(motion.button)`
  width: 100%;
  padding: 14px 20px;
  background: #4f7cff;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease-out;
  box-shadow: 0 2px 8px rgba(79, 124, 255, 0.25);

  &:hover {
    background: #3b63e0;
    box-shadow: 0 4px 16px rgba(79, 124, 255, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ============================================
// RESTO DE COMPONENTES (SIN CAMBIOS MAYORES)
// ============================================

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;

  @media (max-width: 640px) {
    margin-top: 32px;
  }
`;

const Dot = styled.button`
  width: ${(props) => (props.$active ? "28px" : "10px")};
  height: 10px;
  border-radius: 5px;
  border: none;
  background: ${(props) => (props.$active ? "#4f7cff" : "#d1d5db")};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${(props) => (props.$active ? "#4f7cff" : "#94a3b8")};
  }
`;

const MobileNavButtons = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }
`;

const MobileNavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #4f7cff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f8faff;
    border-color: #4f7cff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: #94a3b8;
  }
`;

const PageIndicator = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
`;

const LoadingSpinner = styled(motion.div)`
  color: #4f7cff;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #64748b;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
`;

const ErrorText = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4f7cff;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3b63e0;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  margin: 0 auto;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
`;

const EmptySubtext = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 28px 0;
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
`;

const EmptyActions = styled.div`
  display: flex;
  gap: 12px;
`;

const LoginButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(79, 124, 255, 0.4);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 6px 20px rgba(79, 124, 255, 0.5);
    transform: translateY(-2px);
  }
`;

export default EventsSection;
