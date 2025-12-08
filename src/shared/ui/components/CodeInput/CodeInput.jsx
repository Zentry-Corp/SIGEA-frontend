import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const CodeInputWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
`;

const DigitInput = styled.input`
  width: 50px;
  height: 60px;
  border: 2px solid ${props => 
    props.$error ? '#ff6b6b' : 
    props.$hasValue ? '#4f7cff' : 
    'rgba(255, 255, 255, 0.2)'
  };
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  transition: all 0.3s ease;
  caret-color: #4f7cff;

  &:focus {
    outline: none;
    border-color: #4f7cff;
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ocultar flechas en inputs numéricos */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

export const CodeInput = ({ value, onChange, disabled, error, autoFocus }) => {
  const inputRefs = useRef([]);
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, digitValue) => {
    // Solo permitir números
    if (digitValue && !/^\d$/.test(digitValue)) return;

    const newDigits = [...digits];
    newDigits[index] = digitValue;
    const newCode = newDigits.join('').replace(/ /g, '');
    
    onChange(newCode);

    // Auto-focus al siguiente input
    if (digitValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
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
    <CodeInputWrapper>
      {digits.map((digit, index) => (
        <DigitInput
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit === ' ' ? '' : digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          $hasValue={digit && digit !== ' '}
          $error={error}
        />
      ))}
    </CodeInputWrapper>
  );
};

export default CodeInput;