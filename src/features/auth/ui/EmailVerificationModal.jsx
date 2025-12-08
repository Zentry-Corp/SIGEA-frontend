import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiX, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useEmailVerification } from '../hooks/useEmailVerification';

// ==================== CODE INPUT - VERSIÓN ULTRA SIMPLE ====================

const CodeInputComponent = ({ value = '', onChange, disabled, error, autoFocus }) => {
  const inputRefs = useRef([]);
  
  // ✅ SOLUCIÓN: Crear array de 6 elementos SIEMPRE
  const getDigits = () => {
    const arr = Array(6).fill(' ');
    for (let i = 0; i < value.length && i < 6; i++) {
      arr[i] = value[i];
    }
    return arr;
  };
  
  const digits = getDigits();

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, digitValue) => {
    if (digitValue && !/^\d$/.test(digitValue)) return;

    const newDigits = [...digits];
    newDigits[index] = digitValue;
    const newCode = newDigits.join('').replace(/ /g, '');
    
    onChange(newCode);

    if (digitValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      onChange(pastedData);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      margin: '20px 0',
      padding: '10px',
    }}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[index] === ' ' ? '' : digits[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          style={{
            width: '50px',
            height: '60px',
            border: `2px solid ${error ? '#ff6b6b' : (digits[index] !== ' ') ? '#4f7cff' : 'rgba(255, 255, 255, 0.2)'}`,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            fontSize: '24px',
            fontWeight: '700',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            caretColor: '#4f7cff',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4f7cff';
            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ff6b6b' : (digits[index] !== ' ') ? '#4f7cff' : 'rgba(255, 255, 255, 0.2)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.transform = 'scale(1)';
          }}
        />
      ))}
    </div>
  );
};

// ==================== STYLED COMPONENTS ====================

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: #1e2f4d;
  border-radius: 20px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  svg { font-size: 40px; }
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
`;

const EmailText = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  font-weight: 600;
  color: #e8efff;
`;

const Body = styled.form`
  padding: 40px 30px;
`;

const Alert = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;

  ${props => {
    switch (props.$variant) {
      case 'error':
        return `background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); color: #ff6b6b;`;
      case 'success':
        return `background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981;`;
      case 'warning':
        return `background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); color: #ffc107;`;
      default:
        return `background: rgba(79, 124, 255, 0.1); border: 1px solid rgba(79, 124, 255, 0.3); color: #4f7cff;`;
    }
  }}

  svg { flex-shrink: 0; margin-top: 2px; }
`;

const InputSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #e8efff;
  margin-bottom: 12px;
  text-align: center;
`;

const AttemptsText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #ffc107;
  margin: 10px 0 0 0;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #ff6b6b;
  margin: 10px 0 0 0;
`;

const ResendSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(79, 124, 255, 0.1);
  border-radius: 12px;
  color: #8b9dc3;
  font-size: 14px;
  svg { color: #4f7cff; }
`;

const ResendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(79, 124, 255, 0.1);
  border: 2px solid rgba(79, 124, 255, 0.3);
  color: #4f7cff;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(79, 124, 255, 0.2);
    border-color: rgba(79, 124, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
    color: white;
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 124, 255, 0.4);
    }
  ` : `
    background: transparent;
    color: #8b9dc3;
    border: 1px solid rgba(255, 255, 255, 0.1);
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  padding: 20px;
  background: rgba(79, 124, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(79, 124, 255, 0.1);
`;

const InfoText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #e8efff;
  margin: 0 0 12px 0;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #8b9dc3;
  font-size: 13px;
  li { margin-bottom: 8px; &:last-child { margin-bottom: 0; } }
`;

const WarningContent = styled.div`
  display: flex;
  gap: 12px;
  strong { display: block; margin-bottom: 4px; }
  p { margin: 0; font-size: 13px; }
`;

// ==================== MAIN COMPONENT ====================

export const EmailVerificationModal = ({ 
  email, 
  nombres,
  onVerificationSuccess,
  onClose 
}) => {
  const {
    loading,
    error,
    success,
    code,
    canResend,
    timeLeft,
    attempts,
    maxAttempts,
    attemptsLeft,
    sendError,
    sendCode,
    validateCode,
    resendCode,
    handleCodeChange,
    formatTime,
  } = useEmailVerification();

  const codeHasBeenSent = useRef(false);

  useEffect(() => {
    if (!codeHasBeenSent.current && email && nombres) {
      sendCode(email, nombres);
      codeHasBeenSent.current = true;
    }
  }, [email, nombres, sendCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await validateCode(email, code);
    if (result.success) {
      setTimeout(() => {
        onVerificationSuccess();
      }, 1500);
    }
  };

  const handleResend = async () => {
    await resendCode(email, nombres);
  };

  const handleClose = () => {
    if (sendError) {
      onClose();
    } else {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir sin verificar tu correo?'
      );
      if (confirmed) {
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <Modal
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>

          <Header>
            <IconWrapper>
              <FiMail />
            </IconWrapper>
            <Title>Verifica tu correo</Title>
            <Description>
              Hemos enviado un código de verificación a
            </Description>
            <EmailText>{email}</EmailText>
          </Header>

          <Body onSubmit={handleSubmit}>
            {error && (
              <Alert $variant="error">
                <FiAlertCircle size={20} />
                <span>{error}</span>
              </Alert>
            )}
            
            {success && (
              <Alert $variant="success">
                <FiCheckCircle size={20} />
                <span>{success}</span>
              </Alert>
            )}

            {sendError && (
              <Alert $variant="warning">
                <WarningContent>
                  <FiAlertCircle size={20} />
                  <div>
                    <strong>No se pudo enviar el código</strong>
                    <p>Verifica que tu correo sea válido.</p>
                  </div>
                </WarningContent>
              </Alert>
            )}

            <InputSection>
              <Label>Ingresa el código de 6 dígitos</Label>
              
              <CodeInputComponent
                value={code}
                onChange={handleCodeChange}
                disabled={loading || attempts >= maxAttempts || !!sendError}
                error={!!error}
                autoFocus={!sendError}
              />
              
              {attemptsLeft > 0 && attemptsLeft < maxAttempts && !sendError && (
                <AttemptsText>
                  {attemptsLeft} {attemptsLeft === 1 ? 'intento restante' : 'intentos restantes'}
                </AttemptsText>
              )}

              {attempts >= maxAttempts && (
                <ErrorText>
                  Has alcanzado el máximo de intentos. Solicita un nuevo código.
                </ErrorText>
              )}
            </InputSection>

            {!sendError && (
              <ResendSection>
                {!canResend ? (
                  <TimerContainer>
                    <FiClock size={16} />
                    <span>Reenviar código en {formatTime()}</span>
                  </TimerContainer>
                ) : (
                  <ResendButton
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                  >
                    <FiRefreshCw size={16} />
                    Reenviar código
                  </ResendButton>
                )}
              </ResendSection>
            )}

            <ButtonGroup>
              <Button
                type="submit"
                $variant="primary"
                disabled={loading || code.length !== 6 || attempts >= maxAttempts || !!sendError}
              >
                {loading ? 'Verificando...' : 'Verificar código'}
              </Button>
              
              <Button
                type="button"
                $variant="ghost"
                onClick={handleClose}
                disabled={loading}
              >
                {sendError ? 'Cerrar' : 'Verificar más tarde'}
              </Button>
            </ButtonGroup>

            <InfoBox>
              <InfoText>¿No recibiste el código?</InfoText>
              <InfoList>
                <li>Revisa tu carpeta de spam</li>
                <li>Verifica que el correo sea correcto</li>
                <li>El código expira en 10 minutos</li>
              </InfoList>
            </InfoBox>
          </Body>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default EmailVerificationModal;