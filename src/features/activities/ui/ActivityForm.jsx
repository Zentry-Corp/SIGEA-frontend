import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiImage,
  FiUser,
  FiUpload,
  FiInfo,
  FiList
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import OrganizerLayout from '../../../pages/organizer/OrganizerLayout';
import { AlertError, AlertSuccess, AlertWarning } from "@/shared/ui/components/Alert";
import { useCreateActivity } from '../../../features/activities/hooks/useCreateActivity';
import { bannersApi } from '../../../features/activities/api';



const CrearActividadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false); // ← AGREGADO


  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    estadoId: '',
    organizadorId: '',
    tipoActividadId: '',
    ubicacion: '',
    coOrganizador: '',
    sponsor: '',
    bannerUrl: '',
    numeroYape: ''
  });

  const {
    tipos,
    estados,
    loading: metadataLoading,
    error: metadataError,
    createActivity,
  } = useCreateActivity();

  useEffect(() => {
    if (user?.usuarioId) {
      setFormData((prev) => ({
        ...prev,
        organizadorId: user.usuarioId,
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",


  });

  const [successBannerModal, setSuccessBannerModal] = useState({
    open: false,
    message: "",
  });

  const [successActivityModal, setSuccessActivityModal] = useState({
    open: false,
    message: "",
  });


  const [warningModal, setWarningModal] = useState({
    open: false,
    message: "",
  });


  // Cargar tipos de actividad y estados

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
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorModal({
        open: true,
        message: 'Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'
      });

      return;
    }

    // Validar tamaño (10MB = 10485760 bytes)
    if (file.size > 10485760) {
      setErrorModal({
        open: true,
        message: 'El tamaño del archivo no puede exceder 10MB'
      });

      return;
    }

    setUploadingBanner(true);

    try {
      // Usar el servicio de API de banners
      const data = await bannersApi.subir(file);

      if (data.url) {
        // Construir la URL completa usando la variable de entorno
        const bannerUrl = bannersApi.obtenerUrl(data.url.split('/').pop());

        setFormData(prev => ({
          ...prev,
          bannerUrl: bannerUrl
        }));

        setSuccessBannerModal({
          open: true,
          message: 'Banner subido exitosamente'
        });
      } else {
        throw new Error('No se recibió URL del banner');
      }
    } catch (error) {
      console.error('❌ Error al subir banner:', error);

      const errorMessage = error.response?.data?.message
        || error.message
        || 'Error al subir el banner. Por favor, inténtalo de nuevo';

      setErrorModal({
        open: true,
        message: errorMessage
      });
    } finally {
      setUploadingBanner(false);
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

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    }

    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es obligatoria';
    }

    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es obligatoria';
    }

    if (!formData.tipoActividadId) {
      newErrors.tipoActividadId = 'El tipo de actividad es obligatorio';
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const payload = buildPayload(formData);

  onSubmit(payload);
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
            <Title>Crear Nueva Actividad</Title>
            <Subtitle>Configura y publica un nuevo evento o curso</Subtitle>

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
                  Título de la actividad <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="titulo"
                  placeholder="Ej: Curso Avanzado de Sostenibilidad"
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
                  placeholder="Describe los objetivos, contenido y requisitos de la actividad..."
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
                  Tipo de Actividad <Required>*</Required>
                </Label>
                <Select
                  name="tipoActividadId"
                  value={formData.tipoActividadId}
                  onChange={handleInputChange}
                  $hasError={!!errors.tipoActividadId}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombreActividad}
                    </option>
                  ))}
                </Select>
                {errors.tipoActividadId && <ErrorMessage>{errors.tipoActividadId}</ErrorMessage>}
                {tipos.length === 0 && (
                  <HelpText>Cargando tipos de actividad...</HelpText>
                )}
              </FormGroup>

              <FormGroup> <Label> Estado </Label> <Select name="estadoId" value={formData.estadoId} onChange={handleInputChange} > <option value="">Seleccionar estado (opcional)</option> {estados.map((estado) => (<option key={estado.id} value={estado.id}> {estado.etiqueta} </option>))} </Select> {estados.length === 0 && (<HelpText>Cargando estados...</HelpText>)} </FormGroup>
            </FormRow>

            {/* Fechas y Horarios */}
            <SectionTitle>
              <SectionIcon><FiCalendar /></SectionIcon>
              Fechas y Horarios
            </SectionTitle>

            <FormRow $columns={2}>
              <FormGroup>
                <Label>
                  <FiCalendar size={16} /> Fecha de Inicio <Required>*</Required>
                </Label>
                <Input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  $hasError={!!errors.fechaInicio}
                />
                {errors.fechaInicio && <ErrorMessage>{errors.fechaInicio}</ErrorMessage>}
                <HelpText>Formato: YYYY-MM-DD</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>
                  <FiCalendar size={16} /> Fecha de Fin <Required>*</Required>
                </Label>
                <Input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  $hasError={!!errors.fechaFin}
                />
                {errors.fechaFin && <ErrorMessage>{errors.fechaFin}</ErrorMessage>}
                <HelpText>Formato: YYYY-MM-DD</HelpText>
              </FormGroup>
            </FormRow>

            <FormRow $columns={2}>
              <FormGroup>
                <Label>
                  <FiClock size={16} /> Hora de Inicio <Required>*</Required>
                </Label>
                <Input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  $hasError={!!errors.horaInicio}
                />
                {errors.horaInicio && <ErrorMessage>{errors.horaInicio}</ErrorMessage>}
                <HelpText>Formato: HH:MM (24 horas)</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>
                  <FiClock size={16} /> Hora de Fin <Required>*</Required>
                </Label>
                <Input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  $hasError={!!errors.horaFin}
                />
                {errors.horaFin && <ErrorMessage>{errors.horaFin}</ErrorMessage>}
                <HelpText>Formato: HH:MM (24 horas)</HelpText>
              </FormGroup>
            </FormRow>

            {/* Ubicación y Detalles */}
            <SectionTitle>
              <SectionIcon><FiMapPin /></SectionIcon>
              Ubicación y Detalles
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>
                  <FiMapPin size={16} /> Ubicación <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="ubicacion"
                  placeholder="Ej: Auditorio Principal - FIIS"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  $hasError={!!errors.ubicacion}
                />
                {errors.ubicacion && <ErrorMessage>{errors.ubicacion}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow $columns={2}>
              <FormGroup>
                <Label>
                  <FiUser size={16} /> Organizador
                </Label>
                <Input
                  type="text"
                  name="organizadorNombre"
                  value={user?.nombres || user?.correo || 'Usuario'}
                  disabled
                  style={{ fontWeight: '600' }}
                />
                <HelpText>Organizador asignado automáticamente</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>
                  Co-Organizador
                </Label>
                <Input
                  type="text"
                  name="coOrganizador"
                  placeholder="Nombre del co-organizador (opcional)"
                  value={formData.coOrganizador}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>
                  Sponsor
                </Label>
                <Input
                  type="text"
                  name="sponsor"
                  placeholder="Ej: Empresa X, Institución Y"
                  value={formData.sponsor}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>

            {/* Recursos Adicionales */}
            <SectionTitle>
              <SectionIcon><FiImage /></SectionIcon>
              Recursos Adicionales
            </SectionTitle>

            <FormRow $columns={2}>
              {/* Banner */}
              <FormGroup>
                <Label>
                  <FiImage size={16} /> Banner de la Actividad
                </Label>
                <UploadArea>
                  <FileInputWrapper>
                    <FileInput
                      type="file"
                      id="bannerUpload"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleBannerUpload}
                      disabled={uploadingBanner}
                    />
                    <UploadButton
                      as="label"
                      htmlFor="bannerUpload"
                      $uploading={uploadingBanner}
                    >
                      <FiUpload size={20} />
                      {uploadingBanner ? 'Subiendo...' : 'Subir Banner'}
                    </UploadButton>
                  </FileInputWrapper>

                  {formData.bannerUrl && (
                    <BannerPreview>
                      <PreviewImage src={formData.bannerUrl} alt="Banner preview" />
                      <PreviewUrl>{formData.bannerUrl}</PreviewUrl>
                    </BannerPreview>
                  )}
                </UploadArea>
                <HelpText>JPG, PNG, GIF o WEBP. Máximo 10MB</HelpText>
              </FormGroup>

              {/* NUMERO YAPE */}
              <FormGroup>
                <Label>
                  <FiDollarSign size={16} /> Número Yape (Pagos)
                </Label>
                <Input
                  type="text"
                  name="numeroYape"
                  placeholder="Ej: 987654321"
                  maxLength={9}
                  value={formData.numeroYape}
                  onChange={(e) => {
                    const value = e.target.value;
                    const onlyNumbers = value.replace(/\D/g, "");
                    handleInputChange({
                      target: {
                        name: "numeroYape",
                        value: onlyNumbers.slice(0, 9)
                      }
                    });
                  }}
                />
                <HelpText>Debe contener 9 dígitos (solo números)</HelpText>
              </FormGroup>
            </FormRow>


            <FormRow>
            </FormRow>


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
                disabled={loading || uploadingBanner}
                whileHover={{ scale: (loading || uploadingBanner) ? 1 : 1.02 }}
                whileTap={{ scale: (loading || uploadingBanner) ? 1 : 0.98 }}
              >
                <FiSave size={20} />
                {loading ? 'Guardando...' : 'Crear Actividad'}
              </SubmitButton>
            </FormActions>
          </Form>
        </FormCard>
      </Container>
      <AlertError
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />
      <AlertSuccess
        open={successBannerModal.open}
        message={successBannerModal.message}
        onClose={() => setSuccessBannerModal({ open: false, message: "" })}
      />

      <AlertSuccess
        open={successActivityModal.open}
        message={successActivityModal.message}
        onClose={() => {
          setSuccessActivityModal({ open: false, message: "" });
          navigate("/organizador/actividades");
        }}
      />

      <AlertWarning
        open={warningModal.open}
        message={warningModal.message}
        onCancel={() => setWarningModal({ open: false, message: "" })}
        onConfirm={() => {
          setWarningModal({ open: false, message: "" });
          navigate("/organizador/actividades");
        }}
      />


    </OrganizerLayout>
  );
};

// Styled Components
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
  margin-bottom: 4px;
`;

const Breadcrumb = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
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
  grid-template-columns: ${props => props.$columns === 2 ? 'repeat(2, 1fr)' : '1fr'};
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

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f7cff'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 124, 255, 0.1)'};
  }
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

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.$uploading ? '#9ca3af' : '#4f7cff'};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: ${props => props.$uploading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$uploading ? '#9ca3af' : '#3b63e0'};
  }
`;

const BannerPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const PreviewUrl = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  word-break: break-all;
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

export default CrearActividadPage;