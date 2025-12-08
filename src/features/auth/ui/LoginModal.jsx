import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Modal } from '../../../shared/ui/components/modal';
import { useLogin } from '../hooks/useLogin';

const LoginModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, loading, error } = useLogin();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({
      email: formData.email,
      password: formData.password,
      rememberMe,
    });

    if (result.success) {
      // Redirigir según el rol que venga del backend
      const user = result.data.extradata?.user;
      const roleRoutes = {
        participante: '/participante/dashboard',
        organizador: '/organizador/dashboard',
        admin: '/admin/dashboard',
      };

      const redirectTo = roleRoutes[user?.rol] || '/';
      window.location.href = redirectTo;
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
              required
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
                required
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

          {error && <ErrorMessage>{error}</ErrorMessage>}

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
      </Container>
    </Modal>
  );
};

// Styled Components
const Container = styled.div`
  padding: 40px;
  color: white;

  @media (max-width: 580px) {
    padding: 30px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: white;

  @media (max-width: 580px) {
    font-size: 1.75rem;
  }
`;

const Highlight = styled.span`
  color: #4F7CFF;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #8b9dc3;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
`;

const Required = styled.span`
  color: #ff6b6b;
`;

const Input = styled.input`
  background: white;
  width: 100%;
  padding-right: 50px;
  box-sizing: border-box;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  color: #1a1a1a;
  transition: all 0.3s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #4F7CFF;
    box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  &:hover {
    color: #4F7CFF;
  }
`;

const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #8b9dc3;
  cursor: pointer;
`;

const ForgotPassword = styled.a`
  font-size: 0.9rem;
  color: #4F7CFF;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
`;

const SubmitButton = styled(motion.button)`
  background: #4F7CFF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #3b63e0;
  }
`;

const RegisterLink = styled.p`
  font-size: 0.9rem;
  color: #8b9dc3;
  text-align: center;
  margin-top: 8px;
`;

const Link = styled.span`
  color: #4F7CFF;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export default LoginModal;