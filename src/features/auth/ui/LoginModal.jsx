import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Modal } from '../../../shared/ui/components/Modal';
import { useLogin } from '../hooks/useLogin';
import { parseJwt } from "../../../shared/utils/jwtUtils";
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { AlertError } from "@/shared/ui/components/Alert";

const LoginModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const [errorModal, setErrorModal] = useState({
  open: false,
  message: "",
});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🚨 VALIDACIONES DE CAMPOS VACÍOS
  if (!formData.email.trim() || !formData.password.trim()) {
    setErrorModal({
      open: true,
      message: "Debe ingresar correo y contraseña.",
    });
    return;
  }

  authApi.logout(); // Limpiar posibles sesiones previas
  console.log('🚀 [LOGIN] Iniciando proceso de login...');

  try {
    const result = await login({
      email: formData.email,
      password: formData.password,
      rememberMe,
    });

    console.log("📊 [LOGIN] Result completo:", result);

    // ❌ LOGIN FALLÓ (backend o hook devuelve error)
    if (!result.success) {
      setErrorModal({
        open: true,
        message: result.error || "Credenciales incorrectas",
      });
      return;
    }

    // ✅ LOGIN EXITOSO
    console.log("🎉 Login exitoso");

    const token = sessionStorage.getItem("sigea_token");
    if (!token) {
      setErrorModal({
        open: true,
        message: "Error inesperado: no se recibió el token.",
      });
      return;
    }

    const payload = parseJwt(token);
    const rol =
      payload?.roles?.[0] ||
      payload?.rol ||
      payload?.authorities?.[0] ||
      "";

    if (!rol) {
      setErrorModal({
        open: true,
        message: "No se encontró un rol válido en el token",
      });
      return;
    }

    console.log("🎭 Rol:", rol);

    // cerrar modal
    onClose();

    // pequeño delay
    setTimeout(() => {
      switch (rol.toUpperCase()) {
        case "ADMINISTRADOR":
          navigate("/admin/dashboard");
          break;
        case "ORGANIZADOR":
          navigate("/organizador/dashboard");
          break;
        case "PARTICIPANTE":
          navigate("/participante/dashboard");
          break;
        default:
          setErrorModal({
            open: true,
            message: `Rol no reconocido: ${rol}`,
          });
          navigate("/");
      }
    }, 150);
  } catch (err) {
    console.error("❌ Error en login:", err);

    setErrorModal({
      open: true,
      message: err.message || "Error inesperado. Intente nuevamente.",
    });
  }
};


  const handleRegisterClick = () => {
    onClose();
    window.location.href = '/register';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="480px">
      <Container>
        <Header>
          <Title>
            Bienvenido a <Highlight>SIGEA</Highlight>
          </Title>
          <Subtitle>
            Inicia sesión para gestionar tus eventos y certificados.
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              Correo electrónico <Required>*</Required>
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="usuario@unas.edu.pe"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Contraseña <Required>*</Required>
            </Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </PasswordToggle>
            </PasswordWrapper>
          </FormGroup>

          <OptionsRow>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <CheckboxLabel htmlFor="rememberMe">
                Recordarme
              </CheckboxLabel>
            </CheckboxContainer>

            <ForgotPassword href="/forgot-password">
              ¿Olvidaste tu contraseña?
            </ForgotPassword>
          </OptionsRow>

          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </SubmitButton>

          <RegisterLink>
            ¿No tienes cuenta?{' '}
            <Link onClick={handleRegisterClick}>Regístrate aquí</Link>
          </RegisterLink>
        </Form>
         <AlertError
  open={errorModal.open}
  message={errorModal.message}
  onClose={() => setErrorModal({ open: false, message: "" })}
/>
      </Container>
     

    </Modal>
  );
};

// Styled Components
const Container = styled.div`
  padding: 48px;
  background: #ffffff;
  color: #1a1a1a;

  @media (max-width: 580px) {
    padding: 32px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  @media (max-width: 580px) {
    font-size: 1.75rem;
  }
`;

const Highlight = styled.span`
  color: #4F7CFF;
  background: linear-gradient(135deg, #4F7CFF 0%, #6B92FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  font-weight: 400;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.01em;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  background: #f8fafc;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover {
    border-color: #cbd5e1;
    background: #ffffff;
  }

  &:focus {
    outline: none;
    border-color: #4F7CFF;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.08);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #4F7CFF;
    background: #f1f5f9;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: -8px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4F7CFF;
  border-radius: 4px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;

  &:hover {
    color: #1e293b;
  }
`;

const ForgotPassword = styled.a`
  font-size: 0.875rem;
  color: #4F7CFF;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #3b63e0;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 14px 16px;
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #4F7CFF 0%, #3b63e0 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 124, 255, 0.2);
  margin-top: 8px;

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(79, 124, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const RegisterLink = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  text-align: center;
  margin-top: 12px;
  font-weight: 400;
`;

const Link = styled.span`
  color: #4F7CFF;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #3b63e0;
    text-decoration: underline;
  }
`;

export default LoginModal;