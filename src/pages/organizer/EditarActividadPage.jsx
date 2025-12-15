// src/pages/organizer/EditarActividadPage.jsx

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
  FiInfo
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import OrganizerLayout from './OrganizerLayout';
import { AlertError, AlertSuccess, AlertWarning } from "@/shared/ui/components/Alert";
import { useUpdateActivity } from '../../features/activities/hooks/useUpdateActivity';
import { activitiesApi, bannersApi } from '../../features/activities/api';
import LoadingModal from '@/shared/ui/components/Loader/LoadingModal';

const EditarActividadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);

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

  const { updateActivity } = useUpdateActivity();

  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const [successModal, setSuccessModal] = useState({ open: false, message: "" });
  const [warningModal, setWarningModal] = useState({ open: false, message: "" });

  // Cargar datos de la actividad
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [actividadData, tiposData, estadosData] = await Promise.all([
          activitiesApi.obtener(id),
          activitiesApi.listarTipos(),
          activitiesApi.listarEstados()
        ]);

        setTipos(tiposData || []);
        setEstados(estadosData || []);

        // Mapear datos de la actividad al formulario
        setFormData({
          titulo: actividadData.titulo || '',
          descripcion: actividadData.descripcion || '',
          fechaInicio: actividadData.fechaInicio?.split('T')[0] || '',
          fechaFin: actividadData.fechaFin?.split('T')[0] || '',
          horaInicio: actividadData.horaInicio || '',
          horaFin: actividadData.horaFin || '',
          estadoId: actividadData.estado?.id || '',
          organizadorId: actividadData.organizador?.id || user?.usuarioId || '',
          tipoActividadId: actividadData.tipoActividad?.id || '',
          ubicacion: actividadData.ubicacion || '',
          coOrganizador: actividadData.coOrganizador || '',
          sponsor: actividadData.sponsor || '',
          bannerUrl: actividadData.bannerUrl || '',
          numeroYape: actividadData.numeroYape || ''
        });

      } catch (error) {
        console.error('❌ Error al cargar actividad:', error);
        setErrorModal({
          open: true,
          message: 'Error al cargar los datos de la actividad'
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (id) fetchData();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorModal({ open: true, message: 'Tipo de archivo no válido. Solo imágenes.' });
      return;
    }

    if (file.size > 10485760) {
      setErrorModal({ open: true, message: 'El archivo no puede exceder 10MB' });
      return;
    }

    setUploadingBanner(true);
    try {
      const data = await bannersApi.subir(file);
      if (data.url) {
        const bannerUrl = bannersApi.obtenerUrl(data.url.split('/').pop());
        setFormData(prev => ({ ...prev, bannerUrl }));
      }
    } catch (error) {
      setErrorModal({ open: true, message: 'Error al subir el banner' });
    } finally {
      setUploadingBanner(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    if (!formData.fechaFin) newErrors.fechaFin = 'La fecha de fin es obligatoria';
    if (!formData.horaInicio) newErrors.horaInicio = 'La hora de inicio es obligatoria';
    if (!formData.horaFin) newErrors.horaFin = 'La hora de fin es obligatoria';
    if (!formData.tipoActividadId) newErrors.tipoActividadId = 'El tipo es obligatorio';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es obligatoria';

    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateActivity(id, formData);
      setSuccessModal({
        open: true,
        message: '✅ Actividad actualizada correctamente'
      });
    } catch (error) {
      setErrorModal({
        open: true,
        message: error.response?.data?.message || 'Error al actualizar la actividad'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setWarningModal({
      open: true,
      message: "¿Estás seguro? Los cambios no guardados se perderán."
    });
  };

  if (loadingData) {
    return (
      <OrganizerLayout>
        <LoadingModal isOpen={true} message="Cargando actividad..." />
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Editar Actividad</Title>
            <Subtitle>Modifica los datos de tu actividad</Subtitle>
          </HeaderContent>
        </Header>

        <FormCard as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Form onSubmit={handleSubmit}>
            
            {/* Información Básica */}
            <SectionTitle>
              <SectionIcon><FiInfo /></SectionIcon>
              Información Básica
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>Título <Required>*</Required></Label>
                <Input
                  type="text"
                  name="titulo"
                  placeholder="Título de la actividad"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  $hasError={!!errors.titulo}
                />
                {errors.titulo && <ErrorText>{errors.titulo}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Descripción <Required>*</Required></Label>
                <Textarea
                  name="descripcion"
                  placeholder="Descripción de la actividad"
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  $hasError={!!errors.descripcion}
                />
                {errors.descripcion && <ErrorText>{errors.descripcion}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow $columns={2}>
              <FormGroup>
                <Label>Tipo de Actividad <Required>*</Required></Label>
                <Select
                  name="tipoActividadId"
                  value={formData.tipoActividadId}
                  onChange={handleInputChange}
                  $hasError={!!errors.tipoActividadId}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombreActividad}</option>
                  ))}
                </Select>
                {errors.tipoActividadId && <ErrorText>{errors.tipoActividadId}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Estado</Label>
                <Select name="estadoId" value={formData.estadoId} onChange={handleInputChange}>
                  <option value="">Seleccionar estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>{estado.etiqueta}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>

            {/* Fechas y Horarios */}
            <SectionTitle>
              <SectionIcon><FiCalendar /></SectionIcon>
              Fechas y Horarios
            </SectionTitle>

            <FormRow $columns={2}>
              <FormGroup>
                <Label><FiCalendar size={16} /> Fecha de Inicio <Required>*</Required></Label>
                <Input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  $hasError={!!errors.fechaInicio}
                />
                {errors.fechaInicio && <ErrorText>{errors.fechaInicio}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label><FiCalendar size={16} /> Fecha de Fin <Required>*</Required></Label>
                <Input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  $hasError={!!errors.fechaFin}
                />
                {errors.fechaFin && <ErrorText>{errors.fechaFin}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow $columns={2}>
              <FormGroup>
                <Label><FiClock size={16} /> Hora de Inicio <Required>*</Required></Label>
                <Input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  $hasError={!!errors.horaInicio}
                />
                {errors.horaInicio && <ErrorText>{errors.horaInicio}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label><FiClock size={16} /> Hora de Fin <Required>*</Required></Label>
                <Input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  $hasError={!!errors.horaFin}
                />
                {errors.horaFin && <ErrorText>{errors.horaFin}</ErrorText>}
              </FormGroup>
            </FormRow>

            {/* Ubicación */}
            <SectionTitle>
              <SectionIcon><FiMapPin /></SectionIcon>
              Ubicación y Detalles
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label><FiMapPin size={16} /> Ubicación <Required>*</Required></Label>
                <Input
                  type="text"
                  name="ubicacion"
                  placeholder="Ej: Auditorio Principal"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  $hasError={!!errors.ubicacion}
                />
                {errors.ubicacion && <ErrorText>{errors.ubicacion}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow $columns={2}>
              <FormGroup>
                <Label>Co-Organizador</Label>
                <Input
                  type="text"
                  name="coOrganizador"
                  placeholder="Nombre del co-organizador"
                  value={formData.coOrganizador}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Sponsor</Label>
                <Input
                  type="text"
                  name="sponsor"
                  placeholder="Nombre del sponsor"
                  value={formData.sponsor}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>

            {/* Recursos */}
            <SectionTitle>
              <SectionIcon><FiImage /></SectionIcon>
              Recursos Adicionales
            </SectionTitle>

            <FormRow $columns={2}>
              <FormGroup>
                <Label><FiImage size={16} /> Banner</Label>
                <UploadArea>
                  <FileInput
                    type="file"
                    id="bannerUpload"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner}
                  />
                  <UploadButton as="label" htmlFor="bannerUpload" $uploading={uploadingBanner}>
                    <FiUpload size={20} />
                    {uploadingBanner ? 'Subiendo...' : 'Cambiar Banner'}
                  </UploadButton>

                  {formData.bannerUrl && (
                    <BannerPreview>
                      <PreviewImage src={formData.bannerUrl} alt="Banner" />
                    </BannerPreview>
                  )}
                </UploadArea>
              </FormGroup>

              <FormGroup>
                <Label><FiDollarSign size={16} /> Número Yape</Label>
                <Input
                  type="text"
                  name="numeroYape"
                  placeholder="987654321"
                  maxLength={9}
                  value={formData.numeroYape}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                    handleInputChange({ target: { name: "numeroYape", value } });
                  }}
                />
              </FormGroup>
            </FormRow>

            {/* Acciones */}
            <FormActions>
              <CancelButton type="button" onClick={handleCancel} disabled={loading}>
                <FiX size={20} /> Cancelar
              </CancelButton>

              <SubmitButton
                type="submit"
                disabled={loading || uploadingBanner}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <FiSave size={20} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </SubmitButton>
            </FormActions>
          </Form>
        </FormCard>
      </Container>

      <LoadingModal isOpen={loading} message="Actualizando actividad..." />

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
          navigate("/organizador/actividades");
        }}
      />

      <AlertWarning
        open={warningModal.open}
        message={warningModal.message}
        onCancel={() => setWarningModal({ open: false, message: "" })}
        onConfirm={() => navigate("/organizador/actividades")}
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
`;

const SectionIcon = styled.span`
  display: flex;
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

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f7cff'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 124, 255, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
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
    border-color: #4f7cff;
  }
`;

const ErrorText = styled.span`
  font-size: 0.85rem;
  color: #ef4444;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  width: fit-content;

  &:hover {
    background: ${props => props.$uploading ? '#9ca3af' : '#3b63e0'};
  }
`;

const BannerPreview = styled.div`
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

export default EditarActividadPage;