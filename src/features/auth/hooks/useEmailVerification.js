import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

export const useEmailVerification = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendError, setSendError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const maxAttempts = 2;

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const handleCodeChange = useCallback((value) => {
    setCode(value);
    setError('');
    setSuccess('');
  }, []);

  // Enviar código
  const sendCode = useCallback(async (email, nombres) => {
    setLoading(true);
    setSendError('');
    
    try {
      console.log('📤 Enviando código a:', email);
      const result = await authApi.sendVerificationCode(email, nombres);
      
      if (result.status === true || result.status === 'true') {
        console.log('✅ Código enviado');
        setTimeLeft(600); // Reiniciar timer
        setCanResend(false);
      } else {
        throw new Error(result.message || 'Error al enviar código');
      }
    } catch (err) {
      console.error('❌ Error al enviar código:', err);
      setSendError(err.message || 'No se pudo enviar el código de verificación');
    } finally {
      setLoading(false);
    }
  }, []);

  // Validar código
  const validateCode = useCallback(async (email, verificationCode) => {
    if (verificationCode.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return { success: false };
    }

    if (attempts >= maxAttempts) {
      setError('Has alcanzado el máximo de intentos. Solicita un nuevo código.');
      return { success: false };
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔍 Validando código:', verificationCode);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/usuarios/validar-correo/validar-codigo-verificacion?correo=${encodeURIComponent(email)}&codigo=${verificationCode}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
);


      const data = await response.json();

      if (!response.ok || data.status === false) {
        throw new Error(data.message || 'Código incorrecto');
      }

      console.log('✅ Código verificado correctamente');
      setSuccess('¡Código verificado! Completando registro...');
      return { success: true };

    } catch (err) {
      console.error('❌ Error al validar código:', err);
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setError('Has alcanzado el máximo de intentos. Solicita un nuevo código.');
      } else {
        const attemptsLeft = maxAttempts - newAttempts;
        setError(`Código incorrecto. Te ${attemptsLeft === 1 ? 'queda' : 'quedan'} ${attemptsLeft} ${attemptsLeft === 1 ? 'intento' : 'intentos'}.`);
      }

      setCode('');
      return { success: false };

    } finally {
      setLoading(false);
    }
  }, [attempts, maxAttempts]);

  // Reenviar código
  const resendCode = useCallback(async (email, nombres) => {
    setLoading(true);
    setError('');
    setSendError('');
    
    try {
      console.log('📤 Reenviando código...');
      const result = await authApi.sendVerificationCode(email, nombres);
      
      if (result.status === true || result.status === 'true') {
        console.log('✅ Código reenviado');
        setAttempts(0);
        setCode('');
        setTimeLeft(600);
        setCanResend(false);
        setSuccess('Nuevo código enviado a tu correo');
      } else {
        throw new Error(result.message || 'Error al reenviar código');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('No se pudo reenviar el código');
    } finally {
      setLoading(false);
    }
  }, []);

  const attemptsLeft = maxAttempts - attempts;

  return {
    code,
    loading,
    error,
    success,
    sendError,
    attempts,
    maxAttempts,
    attemptsLeft,
    canResend,
    timeLeft,
    handleCodeChange,
    sendCode,
    validateCode,
    resendCode,
    formatTime,
  };
};

export default useEmailVerification;