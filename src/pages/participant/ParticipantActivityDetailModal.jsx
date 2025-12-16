// src/pages/participant/ParticipantActivityDetailModal.jsx
import React from 'react';
import ActivityDetailModal from '../../features/activities/ui/ActivityDetailModal';

// Para el participante ahora el detalle de la actividad
// solo muestra información, la inscripción se maneja
// directamente desde la tarjeta de actividad.

const ParticipantActivityDetailModal = ({ activity, isOpen, onClose }) => {
  return (
    <ActivityDetailModal
      activity={activity}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default ParticipantActivityDetailModal;

