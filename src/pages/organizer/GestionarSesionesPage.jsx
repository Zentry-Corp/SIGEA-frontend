// src/pages/organizer/GestionarSesionesPage.jsx
// Página completa para gestionar sesiones de una actividad

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiLink,
  FiList,
  FiX,
  FiSave,
  FiVideo,
  FiHome,
  FiMonitor,
  FiInfo,
  FiExternalLink,
} from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import OrganizerLayout from "./OrganizerLayout";
import {
  AlertError,
  AlertSuccess,
  AlertWarning,
  AlertConfirmDelete,
} from "@/shared/ui/components/Alert";
import { useCreateSession } from "../../features/sessions/hooks/useCreateSession";
import { useFetchSessions } from "../../features/sessions/hooks/useFetchSessions";
import { useDeleteSession } from "../../features/sessions/hooks/useDeleteSession";
import { useUpdateSession } from "../../features/sessions/hooks/useUpdateSession";

const GestionarSesionesPage = () => {
  const { actividadId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    sessions,
    loading: sessionsLoading,
    error: sessionsError,
    fetchSessions,
  } = useFetchSessions(actividadId);

  const { createSession } = useCreateSession();
  const { deleteSession } = useDeleteSession();
  const { updateSession } = useUpdateSession();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaSesion: "",
    horaInicio: "",
    horaFin: "",
    modalidad: "",
    ponente: "",
    lugarSesion: "",
    linkVirtual: "",
    orden: 1,
  });

  const [errors, setErrors] = useState({});

  // Modales
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });
  const [warningModal, setWarningModal] = useState({
    open: false,
    message: "",
  });
  const [deleteWarningModal, setDeleteWarningModal] = useState({
    open: false,
    message: "",
    sessionId: null,
  });

  const modalidades = [
    { value: "PRESENCIAL", label: "Presencial", icon: FiHome },
    { value: "VIRTUAL", label: "Virtual", icon: FiVideo },
    { value: "HIBRIDA", label: "Híbrida", icon: FiMonitor },
  ];

  useEffect(() => {
    if (actividadId) {
      fetchSessions();
    }
  }, [actividadId]);

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      fechaSesion: "",
      horaInicio: "",
      horaFin: "",
      modalidad: "",
      ponente: "",
      lugarSesion: "",
      linkVirtual: "",
      orden: sessions.length + 1,
    });
    setErrors({});
    setEditingSession(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "modalidad") {
      if (value === "VIRTUAL") {
        setFormData((prev) => ({ ...prev, lugarSesion: "" }));
      } else if (value === "PRESENCIAL") {
        setFormData((prev) => ({ ...prev, linkVirtual: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = "El título es obligatorio";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria";
    if (!formData.fechaSesion)
      newErrors.fechaSesion = "La fecha es obligatoria";
    if (!formData.horaInicio)
      newErrors.horaInicio = "La hora de inicio es obligatoria";
    if (!formData.horaFin) newErrors.horaFin = "La hora de fin es obligatoria";
    if (!formData.modalidad)
      newErrors.modalidad = "La modalidad es obligatoria";
    if (!formData.ponente.trim())
      newErrors.ponente = "El ponente es obligatorio";

    if (formData.horaInicio && formData.horaFin) {
      const [hI, mI] = formData.horaInicio.split(":");
      const [hF, mF] = formData.horaFin.split(":");
      if (
        parseInt(hF) * 60 + parseInt(mF) <=
        parseInt(hI) * 60 + parseInt(mI)
      ) {
        newErrors.horaFin = "La hora de fin debe ser posterior a la de inicio";
      }
    }

    if (formData.modalidad === "PRESENCIAL" && !formData.lugarSesion.trim()) {
      newErrors.lugarSesion =
        "El lugar es obligatorio para modalidad presencial";
    }

    if (formData.modalidad === "VIRTUAL" && !formData.linkVirtual.trim()) {
      newErrors.linkVirtual = "El link es obligatorio para modalidad virtual";
    }

    if (formData.modalidad === "HIBRIDA") {
      if (!formData.lugarSesion.trim())
        newErrors.lugarSesion = "El lugar es obligatorio";
      if (!formData.linkVirtual.trim())
        newErrors.linkVirtual = "El link es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorModal({
        open: true,
        message: "⚠️ Por favor completa todos los campos obligatorios",
      });
      return;
    }

    setLoading(true);

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fechaSesion: formData.fechaSesion,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      modalidad: formData.modalidad,
      ponente: formData.ponente,
      orden: String(formData.orden),
      actividadId: actividadId,
    };

    if (
      formData.modalidad === "PRESENCIAL" ||
      formData.modalidad === "HIBRIDA"
    ) {
      payload.lugarSesion = formData.lugarSesion;
    }

    if (formData.modalidad === "VIRTUAL" || formData.modalidad === "HIBRIDA") {
      payload.linkVirtual = formData.linkVirtual;
    }

    try {
      if (editingSession) {
        await updateSession(editingSession.id, payload);
        setSuccessModal({
          open: true,
          message: "✅ Sesión actualizada exitosamente",
        });
      } else {
        await createSession(payload);
        setSuccessModal({
          open: true,
          message: "🎉 Sesión creada exitosamente",
        });
      }

      resetForm();
      setShowForm(false);
      fetchSessions();
    } catch (error) {
      setErrorModal({
        open: true,
        message: error.message || "Error al guardar la sesión",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setFormData({
      titulo: session.titulo,
      descripcion: session.descripcion,
      fechaSesion: session.fechaSesion.split("T")[0],
      horaInicio: session.horaInicio,
      horaFin: session.horaFin,
      modalidad: session.modalidad,
      ponente: session.ponente,
      lugarSesion: session.lugarSesion || "",
      linkVirtual: session.linkVirtual || "",
      orden: session.orden,
    });
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDelete = async (sessionId) => {
    setDeleteWarningModal({
      open: true,
      message:
        "¿Estás seguro de eliminar esta sesión? Esta acción no se puede deshacer.",
      sessionId,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteSession(deleteWarningModal.sessionId);
      setSuccessModal({
        open: true,
        message: "🗑️ Sesión eliminada exitosamente",
      });
      fetchSessions();
    } catch (error) {
      setErrorModal({
        open: true,
        message: error.message || "Error al eliminar la sesión",
      });
    } finally {
      setDeleteWarningModal({ open: false, message: "", sessionId: null });
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  // Configuración de colores por modalidad
  const getModalidadConfig = (modalidad) => {
    const configs = {
      PRESENCIAL: {
        bgColor: "#d1fae5",
        color: "#059669",
        borderColor: "#6ee7b7",
      },
      VIRTUAL: {
        bgColor: "#dbeafe",
        color: "#2563eb",
        borderColor: "#93c5fd",
      },
      HIBRIDA: {
        bgColor: "#fef3c7",
        color: "#d97706",
        borderColor: "#fcd34d",
      },
    };
    return configs[modalidad] || configs.PRESENCIAL;
  };

  return (
    <OrganizerLayout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Gestión de Sesiones</Title>
            <Subtitle>Administra las sesiones de la actividad</Subtitle>
          </HeaderContent>
          <HeaderActions>
            {!showForm && (
              <AddButton
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={20} />
                Nueva Sesión
              </AddButton>
            )}
          </HeaderActions>
        </Header>

        <AnimatePresence mode="wait">
          {showForm && (
            <FormCard
              as={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FormHeader>
                <FormTitle>
                  <FiInfo />
                  {editingSession ? "Editar Sesión" : "Nueva Sesión"}
                </FormTitle>
                <CloseFormButton
                  onClick={() => {
                    setWarningModal({
                      open: true,
                      message:
                        "¿Cancelar? Los cambios no guardados se perderán.",
                    });
                  }}
                >
                  <FiX />
                </CloseFormButton>
              </FormHeader>

              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <Label>
                      Título <Required>*</Required>
                    </Label>
                    <Input
                      name="titulo"
                      placeholder="Ej: Introducción a la Sostenibilidad"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      $hasError={!!errors.titulo}
                    />
                    {errors.titulo && (
                      <ErrorMessage>{errors.titulo}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>
                      Descripción <Required>*</Required>
                    </Label>
                    <Textarea
                      name="descripcion"
                      rows={3}
                      placeholder="Describe el contenido de la sesión..."
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      $hasError={!!errors.descripcion}
                    />
                    {errors.descripcion && (
                      <ErrorMessage>{errors.descripcion}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormRow>

                <FormRow $columns={2}>
                  <FormGroup>
                    <Label>
                      <FiUser size={16} /> Ponente <Required>*</Required>
                    </Label>
                    <Input
                      name="ponente"
                      placeholder="Nombre del ponente"
                      value={formData.ponente}
                      onChange={handleInputChange}
                      $hasError={!!errors.ponente}
                    />
                    {errors.ponente && (
                      <ErrorMessage>{errors.ponente}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      Orden <Required>*</Required>
                    </Label>
                    <Input
                      type="number"
                      name="orden"
                      min="1"
                      value={formData.orden}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow $columns={3}>
                  <FormGroup>
                    <Label>
                      <FiCalendar size={16} /> Fecha <Required>*</Required>
                    </Label>
                    <Input
                      type="date"
                      name="fechaSesion"
                      value={formData.fechaSesion}
                      onChange={handleInputChange}
                      $hasError={!!errors.fechaSesion}
                    />
                    {errors.fechaSesion && (
                      <ErrorMessage>{errors.fechaSesion}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <FiClock size={16} /> Inicio <Required>*</Required>
                    </Label>
                    <Input
                      type="time"
                      name="horaInicio"
                      value={formData.horaInicio}
                      onChange={handleInputChange}
                      $hasError={!!errors.horaInicio}
                    />
                    {errors.horaInicio && (
                      <ErrorMessage>{errors.horaInicio}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <FiClock size={16} /> Fin <Required>*</Required>
                    </Label>
                    <Input
                      type="time"
                      name="horaFin"
                      value={formData.horaFin}
                      onChange={handleInputChange}
                      $hasError={!!errors.horaFin}
                    />
                    {errors.horaFin && (
                      <ErrorMessage>{errors.horaFin}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>
                      Modalidad <Required>*</Required>
                    </Label>
                    <ModalidadContainer>
                      {modalidades.map((mod) => (
                        <ModalidadCard
                          key={mod.value}
                          $selected={formData.modalidad === mod.value}
                          onClick={() =>
                            handleInputChange({
                              target: { name: "modalidad", value: mod.value },
                            })
                          }
                        >
                          <mod.icon size={20} />
                          {mod.label}
                        </ModalidadCard>
                      ))}
                    </ModalidadContainer>
                    {errors.modalidad && (
                      <ErrorMessage>{errors.modalidad}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormRow>

                {(formData.modalidad === "PRESENCIAL" ||
                  formData.modalidad === "HIBRIDA") && (
                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FiMapPin size={16} /> Lugar <Required>*</Required>
                      </Label>
                      <Input
                        name="lugarSesion"
                        placeholder="Ej: Auditorio Principal"
                        value={formData.lugarSesion}
                        onChange={handleInputChange}
                        $hasError={!!errors.lugarSesion}
                      />
                      {errors.lugarSesion && (
                        <ErrorMessage>{errors.lugarSesion}</ErrorMessage>
                      )}
                    </FormGroup>
                  </FormRow>
                )}

                {(formData.modalidad === "VIRTUAL" ||
                  formData.modalidad === "HIBRIDA") && (
                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FiLink size={16} /> Link Virtual <Required>*</Required>
                      </Label>
                      <Input
                        type="url"
                        name="linkVirtual"
                        placeholder="https://..."
                        value={formData.linkVirtual}
                        onChange={handleInputChange}
                        $hasError={!!errors.linkVirtual}
                      />
                      {errors.linkVirtual && (
                        <ErrorMessage>{errors.linkVirtual}</ErrorMessage>
                      )}
                    </FormGroup>
                  </FormRow>
                )}

                <FormActions>
                  <CancelButton
                    type="button"
                    onClick={() => {
                      setWarningModal({
                        open: true,
                        message:
                          "¿Cancelar? Los cambios no guardados se perderán.",
                      });
                    }}
                  >
                    <FiX size={18} />
                    Cancelar
                  </CancelButton>

                  <SubmitButton
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    <FiSave size={18} />
                    {loading
                      ? "Guardando..."
                      : editingSession
                      ? "Actualizar"
                      : "Crear"}
                  </SubmitButton>
                </FormActions>
              </Form>
            </FormCard>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════
            LISTA DE SESIONES - ESTILOS MEJORADOS
        ═══════════════════════════════════════════════════════════════════ */}
        <SessionsListContainer>
          {sessionsLoading ? (
            <LoadingContainer>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i}>
                  <SkeletonHeader>
                    <SkeletonBadge $width="100px" />
                    <SkeletonBadge $width="90px" />
                  </SkeletonHeader>
                  <SkeletonTitle />
                  <SkeletonText />
                  <SkeletonDetails>
                    <SkeletonBadge $width="120px" />
                    <SkeletonBadge $width="100px" />
                    <SkeletonBadge $width="110px" />
                  </SkeletonDetails>
                </SkeletonCard>
              ))}
            </LoadingContainer>
          ) : sessions.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>No hay sesiones</EmptyText>
              <EmptySubtext>
                Haz clic en "Nueva Sesión" para comenzar
              </EmptySubtext>
            </EmptyState>
          ) : (
            <SessionsList>
              {sessions.map((session) => {
                const modalidadConfig = getModalidadConfig(session.modalidad);

                return (
                  <SessionCard key={session.id}>
                    {/* ═══ HEADER: Orden + Modalidad + Acciones ═══ */}
                    <SessionCardHeader>
                      <SessionHeaderLeft>
                        <SessionOrderBadge>
                          <FiList />
                          <span>Sesión {session.orden}</span>
                        </SessionOrderBadge>
                        <ModalidadBadge {...modalidadConfig}>
                          {session.modalidad === "VIRTUAL" && <FiVideo />}
                          {session.modalidad === "PRESENCIAL" && <FiHome />}
                          {session.modalidad === "HIBRIDA" && <FiMonitor />}
                          <span>{session.modalidad}</span>
                        </ModalidadBadge>
                      </SessionHeaderLeft>

                      <SessionActions>
                        <ActionButton
                          onClick={() => handleEdit(session)}
                          title="Editar sesión"
                        >
                          <FiEdit2 />
                        </ActionButton>
                        <ActionButton
                          $variant="danger"
                          onClick={() => handleDelete(session.id)}
                          title="Eliminar sesión"
                        >
                          <FiTrash2 />
                        </ActionButton>
                      </SessionActions>
                    </SessionCardHeader>

                    {/* ═══ CONTENIDO PRINCIPAL ═══ */}
                    <SessionContent>
                      <SessionTitle>{session.titulo}</SessionTitle>
                      <SessionDescription>
                        {session.descripcion}
                      </SessionDescription>
                    </SessionContent>

                    {/* ═══ DETALLES: Fecha, Hora, Ponente, Lugar ═══ */}
                    <SessionDetailsGrid>
                      <DetailChip>
                        <FiCalendar />
                        <span>{formatDate(session.fechaSesion)}</span>
                      </DetailChip>

                      <DetailChip $highlight>
                        <FiClock />
                        <span>
                          {session.horaInicio} – {session.horaFin}
                        </span>
                      </DetailChip>

                      <DetailChip>
                        <FiUser />
                        <span>{session.ponente}</span>
                      </DetailChip>

                      {session.lugarSesion && (
                        <DetailChip $location>
                          <FiMapPin />
                          <span>{session.lugarSesion}</span>
                        </DetailChip>
                      )}
                    </SessionDetailsGrid>

                    {/* ═══ LINK VIRTUAL ═══ */}
                    {session.linkVirtual && (
                      <VirtualLinkContainer>
                        <VirtualLinkLabel>
                          <FiLink />
                          <span>Enlace virtual</span>
                        </VirtualLinkLabel>
                        <VirtualLinkAnchor
                          href={session.linkVirtual}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{session.linkVirtual}</span>
                          <FiExternalLink />
                        </VirtualLinkAnchor>
                      </VirtualLinkContainer>
                    )}
                  </SessionCard>
                );
              })}
            </SessionsList>
          )}
        </SessionsListContainer>
      </Container>

      <AlertError
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />

      <AlertSuccess
        open={successModal.open}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: "" })}
      />

      <AlertWarning
        open={warningModal.open}
        message={warningModal.message}
        onCancel={() => setWarningModal({ open: false, message: "" })}
        onConfirm={() => {
          resetForm();
          setShowForm(false);
          setWarningModal({ open: false, message: "" });
        }}
      />

      <AlertConfirmDelete
        open={deleteWarningModal.open}
        message={deleteWarningModal.message}
        onCancel={() =>
          setDeleteWarningModal({ open: false, message: "", sessionId: null })
        }
        onConfirm={confirmDelete}
      />
    </OrganizerLayout>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   STYLED COMPONENTS - FORMULARIO Y LAYOUT (sin cambios)
═══════════════════════════════════════════════════════════════════════════════ */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const AddButton = styled(motion.button)`
  padding: 12px 24px;
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

  &:hover {
    background: #3b63e0;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #4f7cff;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #4f7cff;
  }
`;

const CloseFormButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$columns === 2
      ? "repeat(2, 1fr)"
      : props.$columns === 3
      ? "repeat(3, 1fr)"
      : "1fr"};
  gap: 16px;

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
  font-size: 0.9rem;
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
  padding: 10px 14px;
  border: 2px solid ${(props) => (props.$hasError ? "#ef4444" : "#e5e7eb")};
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1a1a1a;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#4f7cff")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(79, 124, 255, 0.1)"};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  padding: 10px 14px;
  border: 2px solid ${(props) => (props.$hasError ? "#ef4444" : "#e5e7eb")};
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1a1a1a;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#4f7cff")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(79, 124, 255, 0.1)"};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ModalidadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ModalidadCard = styled.div`
  padding: 12px;
  border: 2px solid ${(props) => (props.$selected ? "#4f7cff" : "#e5e7eb")};
  border-radius: 8px;
  background: ${(props) => (props.$selected ? "#f0f5ff" : "white")};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;

  svg {
    color: ${(props) => (props.$selected ? "#4f7cff" : "#6b7280")};
  }

  &:hover {
    border-color: #4f7cff;
    background: ${(props) => (props.$selected ? "#f0f5ff" : "#f9fafb")};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 10px 24px;
  background: #4f7cff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
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
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   STYLED COMPONENTS - LISTA DE SESIONES (MEJORADOS)
═══════════════════════════════════════════════════════════════════════════════ */

const SessionsListContainer = styled.div`
  margin-top: 8px;
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ─── Tarjeta de Sesión ─── */
const SessionCard = styled.article`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

/* ─── Header de la Tarjeta ─── */
const SessionCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const SessionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

/* ─── Badge de Orden ─── */
const SessionOrderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-radius: 8px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  border: 1px solid #c7d2fe;

  svg {
    font-size: 0.9rem;
  }
`;

/* ─── Badge de Modalidad ─── */
const ModalidadBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  background: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  border: 1px solid ${({ borderColor }) => borderColor};

  svg {
    font-size: 0.8rem;
  }
`;

/* ─── Acciones (Editar / Eliminar) ─── */
const SessionActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    align-self: flex-end;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ $variant }) =>
    $variant === "danger" ? "#fef2f2" : "#f8fafc"};
  border: 1px solid
    ${({ $variant }) => ($variant === "danger" ? "#fecaca" : "#e2e8f0")};
  border-radius: 8px;
  color: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "#64748b")};
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: ${({ $variant }) =>
      $variant === "danger" ? "#dc2626" : "#4f46e5"};
    border-color: ${({ $variant }) =>
      $variant === "danger" ? "#dc2626" : "#4f46e5"};
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

/* ─── Contenido Principal ─── */
const SessionContent = styled.div`
  margin-bottom: 16px;
`;

const SessionTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const SessionDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ─── Grid de Detalles ─── */
const SessionDetailsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 4px;
`;

const DetailChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.15s ease;

  svg {
    font-size: 0.85rem;
    color: ${({ $highlight, $location }) =>
      $highlight ? "#4f46e5" : $location ? "#ef4444" : "#94a3b8"};
    flex-shrink: 0;
  }

  ${({ $highlight }) =>
    $highlight &&
    `
    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
    border-color: #c7d2fe;
    color: #4338ca;
    font-weight: 600;
  `}

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
`;

/* ─── Link Virtual ─── */
const VirtualLinkContainer = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 10px;
`;

const VirtualLinkLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1e40af;
  margin-bottom: 6px;

  svg {
    font-size: 0.85rem;
  }
`;

const VirtualLinkAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #2563eb;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.15s ease;

  svg {
    flex-shrink: 0;
    font-size: 0.85rem;
  }

  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   ESTADOS: LOADING & EMPTY
═══════════════════════════════════════════════════════════════════════════════ */

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
`;

const SkeletonHeader = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
`;

const SkeletonBadge = styled.div`
  width: ${({ $width }) => $width || "100px"};
  height: 28px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const SkeletonTitle = styled.div`
  width: 60%;
  height: 24px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const SkeletonText = styled.div`
  width: 85%;
  height: 16px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SkeletonDetails = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 16px;
  opacity: 0.8;
`;

const EmptyText = styled.div`
  font-size: 1.15rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

const EmptySubtext = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

export default GestionarSesionesPage;