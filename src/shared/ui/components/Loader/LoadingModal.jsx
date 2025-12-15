// src/shared/ui/components/Loader/LoadingModal.jsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LoadingModal - Modal de carga profesional para SIGEA
 * 
 * @param {boolean} isOpen - Controla la visibilidad del modal
 * @param {string} message - Mensaje principal a mostrar (default: "Procesando...")
 * @param {string} submessage - Mensaje secundario opcional
 * @param {string} variant - Variante de color: 'primary' | 'success' | 'warning' (default: 'primary')
 */
const LoadingModal = ({ 
  isOpen, 
  message = "Procesando...", 
  submessage = "",
  variant = "primary" 
}) => {
  const colors = {
    primary: {
      main: '#4F7CFF',
      light: '#EEF3FF',
      gradient: 'linear-gradient(135deg, #4F7CFF 0%, #3b63e0 100%)'
    },
    success: {
      main: '#10b981',
      light: '#ECFDF5',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    warning: {
      main: '#f59e0b',
      light: '#FEF3E2',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  };

  const currentColor = colors[variant] || colors.primary;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalContainer
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Spinner animado */}
            <SpinnerWrapper>
              <SpinnerOuter $color={currentColor.main}>
                <SpinnerInner $gradient={currentColor.gradient} />
              </SpinnerOuter>
              
              {/* Dots animados */}
              <DotsContainer>
                {[0, 1, 2].map((i) => (
                  <Dot
                    key={i}
                    as={motion.div}
                    $color={currentColor.main}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </DotsContainer>
            </SpinnerWrapper>

            {/* Mensaje principal */}
            <Message>{message}</Message>

            {/* Submensaje opcional */}
            {submessage && <SubMessage>{submessage}</SubMessage>}

            {/* Barra de progreso indeterminada */}
            <ProgressBar>
              <ProgressFill $gradient={currentColor.gradient} />
            </ProgressBar>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

// Animaciones
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const progress = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  min-width: 320px;
  max-width: 400px;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerOuter = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #f3f4f6;
  border-top-color: ${props => props.$color};
  animation: ${spin} 1s linear infinite;
  position: absolute;
`;

const SpinnerInner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$gradient};
  opacity: 0.1;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 6px;
  position: absolute;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const Message = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin: 0;
  letter-spacing: -0.01em;
`;

const SubMessage = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  margin-top: -8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  width: 40%;
  height: 100%;
  background: ${props => props.$gradient};
  border-radius: 2px;
  animation: ${progress} 1.5s ease-in-out infinite;
`;

export default LoadingModal;