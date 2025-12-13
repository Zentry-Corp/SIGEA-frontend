// src/features/activities/ui/SessionModal.jsx
// Modal para crear sesiones dentro de una actividad

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiSave,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiLink,
  FiInfo,
} from 'react-icons/fi';

const CreateSessionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ponente: '',
    modalidad: 'PRESENCIAL',
    link_virtual: '',
    orden: '',
    fecha_sesion: '',
    horaInicio: '',
    horaFin: '',
    lugarSesion: '',
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.ponente.trim()) {
      newErrors.ponente = 'El ponente es obligatorio';
    }

    if (!formData.fecha_sesion) {
      newErrors.fecha_sesion = 'La fecha es obligatoria';
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es obligatoria';
    }

    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es obligatoria';
    }

    if (formData.modalidad === 'PRESENCIAL' && !formData.lugarSesion.trim()) {
      newErrors.lugarSesion = 'El lugar es obligatorio para sesiones presenciales';
    }

    if (formData.modalidad === 'VIRTUAL' && !formData.link_virtual.trim()) {
      newErrors.link_virtual = 'El link virtual es obligatorio para sesiones virtuales';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convertir horas al formato esperado por el backend
    const [horaInicioHour, horaInicioMinute] = formData.horaInicio.split(':');
    const [horaFinHour, horaFinMinute] = formData.horaFin.split(':');

    const sessionData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      ponente: formData.ponente,
      modalidad: formData.modalidad,
      link_virtual: formData.link_virtual || '',
      orden: formData.orden || '1',
      fecha_sesion: `${formData.fecha_sesion}T00:00:00.000Z`,
      horaInicio: {
        hour: parseInt(horaInicioHour),
        minute: parseInt(horaInicioMinute),
        second: 0,
        nano: 0
      },
      horaFin: {
        hour: parseInt(horaFinHour),
        minute: parseInt(horaFinMinute),
        second: 0,
        nano: 0
      },
      lugarSesion: formData.lugarSesion || ''
    };

    onSave(sessionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      ponente: '',
      modalidad: 'PRESENCIAL',
      link_virtual: '',
      orden: '',
      fecha_sesion: '',
      horaInicio: '',
      horaFin: '',
      lugarSesion: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalWrapper>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <ModalContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <ModalHeader>
              <ModalTitle>Agregar Sesión</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            {/* Body */}
            <ModalBody>
              <Form onSubmit={handleSubmit}>
                {/* Información Básica */}
                <FormGroup>
                  <Label>
                    Título de la Sesión <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    name="titulo"
                    placeholder="Ej: Introducción al tema"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    $hasError={!!errors.titulo}
                  />
                  {errors.titulo && <ErrorMessage>{errors.titulo}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    Descripción <Required>*</Required>
                  </Label>
                  <Textarea
                    name="descripcion"
                    placeholder="Describe el contenido de la sesión..."
                    rows={3}
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    $hasError={!!errors.descripcion}
                  />
                  {errors.descripcion && <ErrorMessage>{errors.descripcion}</ErrorMessage>}
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label>
                      <FiUser /> Ponente <Required>*</Required>
                    </Label>
                    <Input
                      type="text"
                      name="ponente"
                      placeholder="Nombre del ponente"
                      value={formData.ponente}
                      onChange={handleInputChange}
                      $hasError={!!errors.ponente}
                    />
                    {errors.ponente && <ErrorMessage>{errors.ponente}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      Orden
                    </Label>
                    <Input
                      type="number"
                      name="orden"
                      placeholder="1"
                      min="1"
                      value={formData.orden}
                      onChange={handleInputChange}
                    />
                    <HelpText>Orden de la sesión en el evento</HelpText>
                  </FormGroup>
                </FormRow>

                {/* Modalidad */}
                <FormGroup>
                  <Label>
                    Modalidad <Required>*</Required>
                  </Label>
                  <Select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleInputChange}
                  >
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="VIRTUAL">Virtual</option>
                    <option value="HIBRIDA">Híbrida</option>
                  </Select>
                </FormGroup>

                {/* Campos condicionales según modalidad */}
                {(formData.modalidad === 'VIRTUAL' || formData.modalidad === 'HIBRIDA') && (
                  <FormGroup>
                    <Label>
                      <FiLink /> Link Virtual <Required>*</Required>
                    </Label>
                    <Input
                      type="url"
                      name="link_virtual"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={formData.link_virtual}
                      onChange={handleInputChange}
                      $hasError={!!errors.link_virtual}
                    />
                    {errors.link_virtual && <ErrorMessage>{errors.link_virtual}</ErrorMessage>}
                  </FormGroup>
                )}

                {(formData.modalidad === 'PRESENCIAL' || formData.modalidad === 'HIBRIDA') && (
                  <FormGroup>
                    <Label>
                      <FiMapPin /> Lugar de la Sesión <Required>*</Required>
                    </Label>
                    <Input
                      type="text"
                      name="lugarSesion"
                      placeholder="Ej: Aula 201 - Edificio FIIS"
                      value={formData.lugarSesion}
                      onChange={handleInputChange}
                      $hasError={!!errors.lugarSesion}
                    />
                    {errors.lugarSesion && <ErrorMessage>{errors.lugarSesion}</ErrorMessage>}
                  </FormGroup>
                )}

                {/* Fecha y Horarios */}
                <FormGroup>
                  <Label>
                    <FiCalendar /> Fecha de la Sesión <Required>*</Required>
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

                <FormRow>
                  <FormGroup>
                    <Label>
                      <FiClock /> Hora de Inicio <Required>*</Required>
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
                      <FiClock /> Hora de Fin <Required>*</Required>
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
              </Form>
            </ModalBody>

            {/* Footer */}
            <ModalFooter>
              <CancelButton type="button" onClick={handleClose}>
                Cancelar
              </CancelButton>
              <SaveButton
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSave />
                Agregar Sesión
              </SaveButton>
            </ModalFooter>
          </ModalContainer>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default CreateSessionModal;

/* ============================================
   STYLED COMPONENTS
============================================ */

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  z-index: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid #f3f4f6;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f9fafb;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

  svg {
    font-size: 1rem;
  }
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  padding: 11px 14px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1a1a1a;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#5B7CFF'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(91, 124, 255, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  padding: 11px 14px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1a1a1a;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#5B7CFF'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(91, 124, 255, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 11px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1a1a1a;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #5B7CFF;
    box-shadow: 0 0 0 3px rgba(91, 124, 255, 0.1);
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
`;

const HelpText = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  border-top: 2px solid #f3f4f6;
`;

const CancelButton = styled.button`
  padding: 11px 22px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const SaveButton = styled(motion.button)`
  padding: 11px 22px;
  background: #5B7CFF;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: #4a6ae8;
  }
`;