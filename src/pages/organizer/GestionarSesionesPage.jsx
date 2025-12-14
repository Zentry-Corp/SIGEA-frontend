// src/pages/organizer/GestionarSesionesPage.jsx
// Página completa para gestionar sesiones de una actividad

import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
    { value: "HIBRIDA", label: "Híbrida", icon: FiMonitor }, // Backend usa HIBRIDA
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

  const getModalidadColor = (modalidad) => {
    const colors = {
      PRESENCIAL: "#1e40af",
      VIRTUAL: "#065f46",
      HIBRIDA: "#92400e",
    };
    return colors[modalidad] || "#475569";
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

        <SessionsListContainer>
          {sessionsLoading ? (
            <LoadingState>Cargando sesiones...</LoadingState>
          ) : sessions.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>No hay sesiones</EmptyText>
              <EmptySubtext>
                Haz clic en "Nueva Sesión" para comenzar
              </EmptySubtext>
            </EmptyState>
          ) : (
            sessions.map((session) => (
              <SessionCard key={session.id}>
                <SessionHeader>
                  <SessionNumber>Sesión {session.orden}</SessionNumber>
                  <ModalidadBadge $color={getModalidadColor(session.modalidad)}>
                    {session.modalidad}
                  </ModalidadBadge>
                  <SessionActions>
                    <ActionButton onClick={() => handleEdit(session)}>
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton
                      $delete
                      onClick={() => handleDelete(session.id)}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </SessionActions>
                </SessionHeader>

                <SessionTitle>{session.titulo}</SessionTitle>
                <SessionDescription>{session.descripcion}</SessionDescription>

                <SessionDetails>
                  <DetailItem>
                    <FiUser />
                    <span>{session.ponente}</span>
                  </DetailItem>
                  <DetailItem>
                    <FiCalendar />
                    <span>{formatDate(session.fechaSesion)}</span>
                  </DetailItem>
                  <DetailItem>
                    <FiClock />
                    <span>
                      {session.horaInicio} - {session.horaFin}
                    </span>
                  </DetailItem>
                  {session.lugarSesion && (
                    <DetailItem>
                      <FiMapPin />
                      <span>{session.lugarSesion}</span>
                    </DetailItem>
                  )}
                </SessionDetails>

                {session.linkVirtual && (
                  <VirtualLink>
                    <LinkLabel>Link:</LinkLabel>
                    <LinkValue href={session.linkVirtual} target="_blank">
                      {session.linkVirtual}
                    </LinkValue>
                  </VirtualLink>
                )}
              </SessionCard>
            ))
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

/* ============================================
   STYLED COMPONENTS
============================================ */

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

const SessionsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SessionCard = styled.div`
  padding: 20px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const SessionNumber = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #5b7cff;
  text-transform: uppercase;
`;

const ModalidadBadge = styled.div`
  padding: 4px 10px;
  background: ${(props) => `${props.$color}15`};
  border: 1px solid ${(props) => props.$color};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.$color};
  text-transform: uppercase;
`;

const SessionActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${(props) => (props.$delete ? "#FEE2E2" : "#ffffff")};
  border: 1px solid ${(props) => (props.$delete ? "#FCA5A5" : "#e5e7eb")};
  border-radius: 6px;
  color: ${(props) => (props.$delete ? "#DC2626" : "#6b7280")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$delete ? "#DC2626" : "#5B7CFF")};
    border-color: ${(props) => (props.$delete ? "#DC2626" : "#5B7CFF")};
    color: #ffffff;
  }
`;

const SessionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
`;

const SessionDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #374151;

  svg {
    color: #5b7cff;
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }
`;

const VirtualLink = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #e0e7ff;
  border-radius: 8px;
`;

const LinkLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #3730a3;
  margin-bottom: 4px;
`;

const LinkValue = styled.a`
  font-size: 0.85rem;
  color: #4f46e5;
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingState = styled.div`
  padding: 48px;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.7;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

const EmptySubtext = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

export default GestionarSesionesPage;
