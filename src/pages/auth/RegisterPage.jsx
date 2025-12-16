import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PublicLayout } from "../../shared/ui/layouts";
import { LoginModal } from "../../features/auth";
import EmailVerificationModal from "../../features/auth/ui/EmailVerificationModal";
import { useNavigate } from "react-router-dom";
import { AlertError } from "@/shared/ui/components/Alert";
import LoadingModal from "@/shared/ui/components/Loader/LoadingModal";
import { useAuth } from "../../features/auth/hooks/useAuth";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredUserData, setRegisteredUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  const paisesLatam = [
    { label: "🇵🇪 Perú (+51)", value: "+51" },
    { label: "🇲🇽 México (+52)", value: "+52" },
    { label: "🇨🇴 Colombia (+57)", value: "+57" },
    { label: "🇨🇱 Chile (+56)", value: "+56" },
    { label: "🇦🇷 Argentina (+54)", value: "+54" },
    { label: "🇧🇴 Bolivia (+591)", value: "+591" },
    { label: "🇪🇨 Ecuador (+593)", value: "+593" },
    { label: "🇵🇾 Paraguay (+595)", value: "+595" },
    { label: "🇺🇾 Uruguay (+598)", value: "+598" },
  ];

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // ✅ Cuando la verificación es exitosa
  const handleVerificationSuccess = async () => {
    console.log("✅ Verificación exitosa, registrando usuario...");
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

      console.log("📤 Registrando usuario:", registrationData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/usuarios/participante/registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            "⚠️ El correo ya está registrado. Intenta iniciar sesión."
          );
        } else {
          throw new Error(data.message || "Error al registrar");
        }
      }

      console.log("🔥 Usuario registrado y verificado:", data);

      // 🟩 Hacer login inmediato y redirigir
      await login({
        email: formData.correo.trim().toLowerCase(),
        password: formData.password,
        rememberMe: false,
      });

      // esperar a que useAuth actualice el estado
      await new Promise((resolve) => setTimeout(resolve, 300));

      navigate("/participante/dashboard");
    } catch (error) {
      console.error("❌ Error al registrar/verificar:", error);
      setErrorModal({
        open: true,
        message: error.message || "Ocurrió un error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cuando el usuario cierra el modal sin verificar
  const handleVerificationSkip = () => {
    setShowVerificationModal(false);
    setErrorModal({
      open: true,
      message: "Debe verificar su correo para completar el registro.",
    });
  };

  const validateForm = () => {
    const {
      nombres,
      apellidos,
      dni,
      correo,
      telefono,
      password,
      confirmPassword,
      extensionTelefonica,
    } = formData;

    // Nombres
    if (!nombres.trim()) return "El campo Nombres es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombres))
      return "Los nombres solo deben contener letras.";

    // Apellidos
    if (!apellidos.trim()) return "El campo Apellidos es obligatorio.";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos))
      return "Los apellidos solo deben contener letras.";

    // DNI
    if (!dni.trim()) return "El DNI es obligatorio.";
    if (!/^\d{8}$/.test(dni)) return "El DNI debe tener exactamente 8 dígitos.";

    // Correo
    if (!correo.trim()) return "El correo electrónico es obligatorio.";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo))
      return "Correo electrónico inválido.";

    // Código telefónico
    if (!extensionTelefonica) return "Debe seleccionar un código telefónico.";

    // Teléfono
    if (!telefono.trim()) return "El teléfono es obligatorio.";
    if (!/^\d{9}$/.test(telefono))
      return "El número telefónico debe tener 9 dígitos.";
    if (!telefono.startsWith("9"))
      return "El teléfono peruano debe empezar con 9.";

    // Contraseña
    if (!password) return "La contraseña es obligatoria.";
    if (password.length < 6)
      return "La contraseña debe tener mínimo 6 caracteres.";

    // Confirmar contraseña
    if (!confirmPassword) return "Debe confirmar su contraseña.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";

    return null; // sin errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const validationError = validateForm();
    if (validationError) {
      setErrorModal({
        open: true,
        message: validationError,
      });
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
              <Title>
                Bienvenido a <Highlight>SIGEA</Highlight>
              </Title>
              <Subtitle>
                Descubre talleres, cursos y eventos diseñados para acompañar tu aprendizaje
              </Subtitle>
            </Header>

            <Divider />

            <Form onSubmit={handleSubmit}>
              <FormRow>
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
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>
                    DNI <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    name="dni"
                    placeholder="73403856"
                    maxLength="8"
                    value={formData.dni}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, dni: value });
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    Correo electrónico <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    name="correo"
                    placeholder="usuario@unas.edu.pe"
                    value={formData.correo}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>
                  Teléfono <Required>*</Required>
                </Label>

                <PhoneRow>
                  <CountrySelect
                    value={formData.extensionTelefonica}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        extensionTelefonica: e.target.value,
                      })
                    }
                  >
                    <option value="">Código</option>
                    {paisesLatam.map((pais) => (
                      <option key={pais.value} value={pais.value}>
                        {pais.label}
                      </option>
                    ))}
                  </CountrySelect>

                  <Input
                    type="tel"
                    name="telefono"
                    placeholder="999888777"
                    value={formData.telefono}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, telefono: value });
                    }}
                    maxLength="9"
                  />
                </PhoneRow>

                <Hint>Debe empezar con 9</Hint>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>
                    Contraseña <Required>*</Required>
                  </Label>
                  <PasswordWrapper>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </PasswordToggle>
                  </PasswordWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Confirmar contraseña <Required>*</Required>
                  </Label>
                  <PasswordWrapper>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </PasswordToggle>
                  </PasswordWrapper>
                </FormGroup>
              </FormRow>

              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                Registrarse
              </SubmitButton>

              <LoginLink>
                ¿Ya tienes cuenta?{" "}
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

      {showVerificationModal && registeredUserData && (
        <EmailVerificationModal
          email={registeredUserData.email}
          nombres={registeredUserData.nombres}
          onVerificationSuccess={handleVerificationSuccess}
          onClose={handleVerificationSkip}
        />
      )}

      <AlertError
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />

      <LoadingModal
        isOpen={loading}
        message="Registrando cuenta..."
        submessage="Esto puede tomar unos segundos"
      />
    </PublicLayout>
  );
};

// Styled Components - Diseño Moderno y Limpio
const PageContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

  @media (max-width: 768px) {
    padding: 60px 20px 40px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 680px;
`;

const FormCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    padding: 36px 28px;
    border-radius: 20px;
  }

  @media (max-width: 580px) {
    padding: 32px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
  border-radius: 20px;
  margin-bottom: 20px;
  color: white;
  box-shadow: 0 8px 24px rgba(79, 124, 255, 0.25);
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;

  @media (max-width: 580px) {
    font-size: 1.625rem;
  }
`;

const Highlight = styled.span`
  color: #4f7cff;
  background: linear-gradient(135deg, #4f7cff 0%, #6b92ff 100%);
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

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
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
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.01em;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  width: 100%;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  box-sizing: border-box;
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
    border-color: #4f7cff;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.08);
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 12px;
`;

const CountrySelect = styled.select`
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    border-color: #cbd5e1;
    background: #ffffff;
  }

  &:focus {
    outline: none;
    border-color: #4f7cff;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(79, 124, 255, 0.08);
  }
`;

const Hint = styled.span`
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: -5px;
  font-weight: 500;
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
    color: #4f7cff;
    background: #f1f5f9;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #4f7cff 0%, #3b63e0 100%);
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

const LoginLink = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  text-align: center;
  margin-top: 4px;
  font-weight: 400;
`;

const Link = styled.span`
  color: #4f7cff;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #3b63e0;
    text-decoration: underline;
  }
`;

export default RegisterPage;
