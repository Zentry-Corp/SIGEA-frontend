import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiLink,
  FiInfo,
  FiVideo,
  FiHome,
  FiMonitor
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import OrganizerLayout from './OrganizerLayout';
import { AlertError, AlertSuccess, AlertWarning } from "@/shared/ui/components/Alert";
import { useCreateSession } from '../../features/sessions/hooks/useCreateSession';

const CrearSesionPage = () => {
  const navigate = useNavigate();
  const { actividadId } = useParams(); // ID de la actividad padre
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_sesion: '',
    horaInicio: '',
    horaFin: '',
    modalidad: '',
    ponente: '',
    lugarSesion: '',
    link_virtual: '',
    orden: 1,
    actividadId: actividadId || ''
  });

  const {
    loading: metadataLoading,
    error: metadataError,
    createSession,
  } = useCreateSession();

  const [errors, setErrors] = useState({});

  // Estados de modales
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });

  const [warningModal, setWarningModal] = useState({
    open: false,
    message: "",
  });

  // Opciones de modalidad
  const modalidades = [
    { value: 'PRESENCIAL', label: 'Presencial', icon: FiHome },
    { value: 'VIRTUAL', label: 'Virtual', icon: FiVideo },
    { value: 'HIBRIDA', label: 'Híbrida', icon: FiMonitor }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Si cambia la modalidad, limpiar campos relacionados
    if (name === 'modalidad') {
      if (value === 'VIRTUAL') {
        setFormData(prev => ({ ...prev, lugarSesion: '' }));
      } else if (value === 'PRESENCIAL') {
        setFormData(prev => ({ ...prev, link_virtual: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.fecha_sesion) {
      newErrors.fecha_sesion = 'La fecha de la sesión es obligatoria';
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es obligatoria';
    }

    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es obligatoria';
    }

    // Validar que hora fin sea posterior a hora inicio
    if (formData.horaInicio && formData.horaFin) {
      const [horaInicioH, horaInicioM] = formData.horaInicio.split(':');
      const [horaFinH, horaFinM] = formData.horaFin.split(':');
      const inicioMinutos = parseInt(horaInicioH) * 60 + parseInt(horaInicioM);
      const finMinutos = parseInt(horaFinH) * 60 + parseInt(horaFinM);

      if (finMinutos <= inicioMinutos) {
        newErrors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }

    if (!formData.modalidad) {
      newErrors.modalidad = 'La modalidad es obligatoria';
    }

    if (!formData.ponente.trim()) {
      newErrors.ponente = 'El ponente es obligatorio';
    }

    // Validaciones condicionales según modalidad
    if (formData.modalidad === 'PRESENCIAL' && !formData.lugarSesion.trim()) {
      newErrors.lugarSesion = 'El lugar de la sesión es obligatorio para modalidad presencial';
    }

    if (formData.modalidad === 'VIRTUAL' && !formData.link_virtual.trim()) {
      newErrors.link_virtual = 'El link virtual es obligatorio para modalidad virtual';
    }

    if (formData.modalidad === 'HIBRIDA') {
      if (!formData.lugarSesion.trim()) {
        newErrors.lugarSesion = 'El lugar de la sesión es obligatorio para modalidad híbrida';
      }
      if (!formData.link_virtual.trim()) {
        newErrors.link_virtual = 'El link virtual es obligatorio para modalidad híbrida';
      }
    }

    // Validar formato de URL si hay link virtual
    if (formData.link_virtual && formData.link_virtual.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.link_virtual)) {
        newErrors.link_virtual = 'El formato del link no es válido';
      }
    }

    if (!formData.orden || formData.orden < 1) {
      newErrors.orden = 'El orden debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorModal({
        open: true,
        message: "⚠️ Por favor completa todos los campos obligatorios correctamente",
      });
      return;
    }

    setLoading(true);

    // Construir payload
    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha_sesion: formData.fecha_sesion,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      modalidad: formData.modalidad,
      ponente: formData.ponente,
      orden: parseInt(formData.orden),
      actividadId: parseInt(formData.actividadId)
    };

    // Agregar campos opcionales según modalidad
    if (formData.modalidad === 'PRESENCIAL' || formData.modalidad === 'HIBRIDA') {
      payload.lugarSesion = formData.lugarSesion;
    }

    if (formData.modalidad === 'VIRTUAL' || formData.modalidad === 'HIBRIDA') {
      payload.link_virtual = formData.link_virtual;
    }

    console.log("📤 Payload sesión:", payload);

    try {
      const response = await createSession(payload);
      console.log("🧾 Respuesta del backend:", response);

      if (!response?.id) {
        throw new Error("La sesión no fue creada correctamente. Falta ID en la respuesta.");
      }

      setSuccessModal({
        open: true,
        message: "🎉 La sesión ha sido creada exitosamente.",
      });

      // Navegar después de cerrar el modal
      setTimeout(() => {
        navigate(`/organizador/actividades/${actividadId}/sesiones`);
      }, 1500);

    } catch (error) {
      console.error("❌ Error completo:", error);

      const errorMessage =
        error.response?.data?.descripcion ||
        error.response?.data?.message ||
        error.message ||
        "Error desconocido al crear la sesión";

      setErrorModal({
        open: true,
        message: errorMessage,
      });

    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setWarningModal({
      open: true,
      message: "¿Estás seguro? Los cambios no guardados se perderán.",
    });
  };

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Crear Nueva Sesión</Title>
            <Subtitle>Agrega una sesión a la actividad</Subtitle>
          </HeaderContent>
        </Header>

        <FormCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Form onSubmit={handleSubmit}>
            {/* Información Básica */}
            <SectionTitle>
              <SectionIcon><FiInfo /></SectionIcon>
              Información Básica
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>
                  Título de la sesión <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="titulo"
                  placeholder="Ej: Introducción a la Sostenibilidad Ambiental"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  $hasError={!!errors.titulo}
                />
                {errors.titulo && <ErrorMessage>{errors.titulo}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>
                  Descripción <Required>*</Required>
                </Label>
                <Textarea
                  name="descripcion"
                  placeholder="Describe el contenido de la sesión, objetivos y temas a tratar..."
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  $hasError={!!errors.descripcion}
                />
                {errors.descripcion && <ErrorMessage>{errors.descripcion}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow $columns={2}>
              <FormGroup>
                <Label>
                  <FiUser size={16} /> Ponente <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="ponente"
                  placeholder="Nombre completo del ponente"
                  value={formData.ponente}
                  onChange={handleInputChange}
                  $hasError={!!errors.ponente}
                />
                {errors.ponente && <ErrorMessage>{errors.ponente}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Orden de sesión <Required>*</Required>
                </Label>
                <Input
                  type="number"
                  name="orden"
                  min="1"
                  placeholder="1"
                  value={formData.orden}
                  onChange={handleInputChange}
                  $hasError={!!errors.orden}
                />
                {errors.orden && <ErrorMessage>{errors.orden}</ErrorMessage>}
                <HelpText>Número de orden de la sesión dentro de la actividad</HelpText>
              </FormGroup>
            </FormRow>

            {/* Fecha y Horario */}
            <SectionTitle>
              <SectionIcon><FiCalendar /></SectionIcon>
              Fecha y Horario
            </SectionTitle>

            <FormRow $columns={3}>
              <FormGroup>
                <Label>
                  <FiCalendar size={16} /> Fecha <Required>*</Required>
                </Label>
                <Input
                  type="date"
                  name="fecha_sesion"
                  value={formData.fecha_sesion}
                  onChange={handleInputChange}
                  $hasError={!!errors.fecha_sesion}
                />
                {errors.fecha_sesion && <ErrorMessage>{errors.fecha_sesion}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  <FiClock size={16} /> Hora Inicio <Required>*</Required>
                </Label>
                <Input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  $hasError={!!errors.horaInicio}
                />
                {errors.horaInicio && <ErrorMessage>{errors.horaInicio}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  <FiClock size={16} /> Hora Fin <Required>*</Required>
                </Label>
                <Input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  $hasError={!!errors.horaFin}
                />
                {errors.horaFin && <ErrorMessage>{errors.horaFin}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            {/* Modalidad y Ubicación */}
            <SectionTitle>
              <SectionIcon><FiMapPin /></SectionIcon>
              Modalidad y Ubicación
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>
                  Modalidad de la sesión <Required>*</Required>
                </Label>
                <ModalidadContainer>
                  {modalidades.map((mod) => (
                    <ModalidadCard
                      key={mod.value}
                      $selected={formData.modalidad === mod.value}
                      $hasError={!!errors.modalidad}
                      onClick={() => handleInputChange({
                        target: { name: 'modalidad', value: mod.value }
                      })}
                    >
                      <mod.icon size={24} />
                      <ModalidadLabel>{mod.label}</ModalidadLabel>
                    </ModalidadCard>
                  ))}
                </ModalidadContainer>
                {errors.modalidad && <ErrorMessage>{errors.modalidad}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            {/* Campos condicionales según modalidad */}
            {(formData.modalidad === 'PRESENCIAL' || formData.modalidad === 'HIBRIDA') && (
              <FormRow>
                <FormGroup>
                  <Label>
                    <FiMapPin size={16} /> Lugar de la sesión <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    name="lugarSesion"
                    placeholder="Ej: Auditorio Principal - Pabellón A"
                    value={formData.lugarSesion}
                    onChange={handleInputChange}
                    $hasError={!!errors.lugarSesion}
                  />
                  {errors.lugarSesion && <ErrorMessage>{errors.lugarSesion}</ErrorMessage>}
                </FormGroup>
              </FormRow>
            )}

            {(formData.modalidad === 'VIRTUAL' || formData.modalidad === 'HIBRIDA') && (
              <FormRow>
                <FormGroup>
                  <Label>
                    <FiLink size={16} /> Link Virtual <Required>*</Required>
                  </Label>
                  <Input
                    type="url"
                    name="link_virtual"
                    placeholder="https://zoom.us/j/123456789 o https://meet.google.com/..."
                    value={formData.link_virtual}
                    onChange={handleInputChange}
                    $hasError={!!errors.link_virtual}
                  />
                  {errors.link_virtual && <ErrorMessage>{errors.link_virtual}</ErrorMessage>}
                  <HelpText>URL completa de Zoom, Google Meet, Teams, etc.</HelpText>
                </FormGroup>
              </FormRow>
            )}

            {/* Botones de Acción */}
            <FormActions>
              <CancelButton
                type="button"
                onClick={handleCancel}
                disabled={loading}
              >
                <FiX size={20} />
                Cancelar
              </CancelButton>

              <SubmitButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <FiSave size={20} />
                {loading ? 'Guardando...' : 'Crear Sesión'}
              </SubmitButton>
            </FormActions>
          </Form>
        </FormCard>
      </Container>

      {/* Modales de Alertas */}
      <AlertError
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />

      <AlertSuccess
        open={successModal.open}
        message={successModal.message}
        onClose={() => {
          setSuccessModal({ open: false, message: "" });
          navigate(`/organizador/actividades/${actividadId}/sesiones`);
        }}
      />

      <AlertWarning
        open={warningModal.open}
        message={warningModal.message}
        onCancel={() => setWarningModal({ open: false, message: "" })}
        onConfirm={() => {
          setWarningModal({ open: false, message: "" });
          navigate(`/organizador/actividades/${actividadId}/sesiones`);
        }}
      />
    </OrganizerLayout>
  );
};

/* ============================================
   STYLED COMPONENTS
============================================ */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 16px;
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f7cff;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.$columns === 2 ? 'repeat(2, 1fr)' :
      props.$columns === 3 ? 'repeat(3, 1fr)' :
        '1fr'};
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1a1a1a;
  transition: all 0.2s;
  background: ${props => props.disabled ? '#f9fafb' : 'white'};

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f7cff'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 124, 255, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1a1a1a;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f7cff'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 124, 255, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ModalidadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ModalidadCard = styled.div`
  padding: 20px;
  border: 2px solid ${props =>
    props.$hasError ? '#ef4444' :
      props.$selected ? '#4f7cff' : '#e5e7eb'};
  border-radius: 12px;
  background: ${props => props.$selected ? '#f0f5ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  svg {
    color: ${props => props.$selected ? '#4f7cff' : '#6b7280'};
    transition: all 0.2s;
  }

  &:hover {
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f7cff'};
    background: ${props => props.$selected ? '#f0f5ff' : '#f9fafb'};
    transform: translateY(-2px);
  }
`;

const ModalidadLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HelpText = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 2px solid #f3f4f6;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 32px;
  background: #4f7cff;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(79, 124, 255, 0.3);

  &:hover:not(:disabled) {
    background: #3b63e0;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default CrearSesionPage;