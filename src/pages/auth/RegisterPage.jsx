import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { PublicLayout } from '../../shared/ui/layouts';
import { LoginModal } from '../../features/auth';
import EmailVerificationModal from '../../features/auth/ui/EmailVerificationModal';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredUserData, setRegisteredUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const paisesLatam = [
    { label: '🇵🇪 Perú (+51)', value: '+51' },
    { label: '🇲🇽 México (+52)', value: '+52' },
    { label: '🇨🇴 Colombia (+57)', value: '+57' },
    { label: '🇨🇱 Chile (+56)', value: '+56' },
    { label: '🇦🇷 Argentina (+54)', value: '+54' },
    { label: '🇧🇴 Bolivia (+591)', value: '+591' },
    { label: '🇪🇨 Ecuador (+593)', value: '+593' },
    { label: '🇵🇾 Paraguay (+595)', value: '+595' },
    { label: '🇺🇾 Uruguay (+598)', value: '+598' },
  ];


  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePhoneChange = (value, data) => {
    setFormData({
      ...formData,
      telefono: value.replace(data.dialCode, ''), // quita código del número
      extensionTelefonica: `+${data.dialCode}`,   // guarda el +51, +52, etc
    });
  };


  // ✅ Cuando la verificación es exitosa
  const handleVerificationSuccess = async () => {
    console.log('✅ Verificación exitosa, registrando usuario...');
    setLoading(true);

    try {
      const registrationData = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim().toLowerCase(),
        password: formData.password,
        dni: formData.dni,
        telefono: formData.telefono,
        extensionTelefonica: formData.extensionTelefonica,
      };

      console.log('📤 Registrando usuario:', registrationData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/usuarios/participante/registrar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      console.log('✅ Usuario registrado exitosamente:', data);

      // Cerrar modal de verificación
      setShowVerificationModal(false);

      // Mostrar éxito
      alert('🎉 ¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');

      // Reset form
      setFormData({
        nombres: '',
        apellidos: '',
        dni: '',
        correo: '',
        telefono: '',
        password: '',
        confirmPassword: '',
      });

      // Abrir modal de login
      setTimeout(() => {
        setIsLoginModalOpen(true);
      }, 500);

    } catch (error) {
      console.error('❌ Error al registrar:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cuando el usuario cierra el modal sin verificar
  const handleVerificationSkip = () => {
    setShowVerificationModal(false);
    alert('Puedes verificar tu correo más tarde desde tu perfil.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }

    if (formData.telefono.length > 10) {
      setError('Ingresa un número de teléfono válido');
      return;
    }
    

    // Guardar datos y abrir modal de verificación
    setRegisteredUserData({
      email: formData.correo,
      nombres: formData.nombres,
    });
    setShowVerificationModal(true);
  };

  return (
    <PublicLayout>
      <PageContainer>
        <ContentWrapper>
          <FormCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header>
              <IconWrapper>
                <FiUserPlus size={32} />
              </IconWrapper>
              <Title>Regístrate en SIGEA</Title>
              <Subtitle>
                Crea tu cuenta para gestionar eventos académicos
              </Subtitle>
            </Header>

            <Divider />

            <Form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormGroup>
                <Label>
                  Nombres <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="nombres"
                  placeholder="Juan Alberto"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Apellidos <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="apellidos"
                  placeholder="Rodriguez Pérez"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  DNI <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="dni"
                  placeholder="12345678"
                  maxLength="8"
                  pattern="[0-9]{8}"
                  value={formData.dni}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Correo electrónico <Required>*</Required>
                </Label>
                <Input
                  type="email"
                  name="correo"
                  placeholder="usuario@unas.edu.pe"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Teléfono <Required>*</Required>
                </Label>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={formData.extensionTelefonica}
                    onChange={(e) =>
                      setFormData({ ...formData, extensionTelefonica: e.target.value })
                    }
                    required
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      minWidth: '110px',
                    }}
                  >
                    <option value="">Código</option>
                    {paisesLatam.map((pais) => (
                      <option key={pais.value} value={pais.value}>
                        {pais.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="tel"
                    name="telefono"
                    placeholder="999888777"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    pattern="[0-9]{9}"
                    maxLength="9"
                    required
                  />
                </div>

                <Hint>Debe empezar con 9</Hint>
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
                    minLength="6"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </PasswordWrapper>
              </FormGroup>

              <FormGroup>
                <Label>
                  Confirmar contraseña <Required>*</Required>
                </Label>
                <PasswordWrapper>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </PasswordWrapper>
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Procesando...' : 'Registrarse'}
              </SubmitButton>

              <LoginLink>
                ¿Ya tienes cuenta?{' '}
                <Link onClick={() => setIsLoginModalOpen(true)}>
                  Inicia sesión aquí
                </Link>
              </LoginLink>
            </Form>
          </FormCard>
        </ContentWrapper>
      </PageContainer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* ✅ Modal de verificación */}
      {showVerificationModal && registeredUserData && (
        <EmailVerificationModal
          email={registeredUserData.email}
          nombres={registeredUserData.nombres}
          onVerificationSuccess={handleVerificationSuccess}
          onClose={handleVerificationSkip}
        />
      )}
    </PublicLayout>
  );
};

// Styled Components (sin cambios)
const PageContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  @media (max-width: 768px) { padding: 60px 20px 40px; }
`;

const ContentWrapper = styled.div`width: 100%; max-width: 500px;`;
const FormCard = styled(motion.div)`background: #1e2f4d; border-radius: 24px; padding: 48px 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); @media (max-width: 580px) { padding: 36px 28px; border-radius: 20px; }`;
const Header = styled.div`text-align: center; margin-bottom: 32px;`;
const IconWrapper = styled.div`display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: linear-gradient(135deg, #4F7CFF 0%, #3b63e0 100%); border-radius: 18px; margin-bottom: 20px; color: white; box-shadow: 0 8px 24px rgba(79, 124, 255, 0.3);`;
const Title = styled.h2`font-size: 1.75rem; font-weight: 700; color: white; margin-bottom: 12px;`;
const Subtitle = styled.p`font-size: 0.95rem; color: #b8c5d9; line-height: 1.5; max-width: 380px; margin: 0 auto;`;
const Divider = styled.div`height: 1px; background: rgba(255, 255, 255, 0.1); margin-bottom: 32px;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 24px;`;
const FormGroup = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const Label = styled.label`font-size: 0.95rem; font-weight: 600; color: white; display: flex; align-items: center; gap: 4px;`;
const Required = styled.span`color: #ff6b6b;`;
const Input = styled.input`width: 100%; background: white; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 16px 18px; font-size: 1rem; color: #1a1a1a; transition: all 0.3s ease; box-sizing: border-box; &::placeholder { color: #aaa; } &:focus { outline: none; border-color: #4F7CFF; box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.15); }`;
const PhoneInputWrapper = styled.div`width: 100%; .react-tel-input { width: 100%; } .react-tel-input .form-control { width: 100%; background: white; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 16px 18px 16px 58px; font-size: 1rem; color: #1a1a1a; height: auto; &:focus { outline: none; border-color: #4F7CFF; box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.15); } }`;
const Hint = styled.span`font-size: 0.85rem; color: #8b9dc3; margin-top: -5px;`;
const PasswordWrapper = styled.div`position: relative; width: 100%;`;
const PasswordToggle = styled.button`position: absolute; right: 18px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #666; cursor: pointer; &:hover { color: #4F7CFF; }`;
const ErrorMessage = styled.div`background: rgba(255, 107, 107, 0.15); border: 1px solid #ff6b6b; border-radius: 12px; padding: 14px 18px; color: #ff6b6b; font-size: 0.9rem; text-align: center;`;
const SubmitButton = styled(motion.button)`background: #4F7CFF; color: white; border: none; border-radius: 14px; padding: 18px 24px; font-size: 1.05rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 8px; &:disabled { background: #6b8ac7; cursor: not-allowed; } &:hover:not(:disabled) { background: #3b63e0; box-shadow: 0 6px 20px rgba(79, 124, 255, 0.4); }`;
const LoginLink = styled.p`font-size: 0.95rem; color: #b8c5d9; text-align: center; margin-top: 4px;`;
const Link = styled.span`color: #4F7CFF; cursor: pointer; font-weight: 600; &:hover { text-decoration: underline; }`;

export default RegisterPage;