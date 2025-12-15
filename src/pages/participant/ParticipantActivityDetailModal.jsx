// src/pages/participant/ParticipantActivityDetailModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ActivityDetailModal from '../../features/activities/ui/ActivityDetailModal';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { inscriptionsApi } from '../../features/participant/api/inscriptionsApi';
import { useEnrollmentStatus } from '../../features/participant/hooks/useEnrollmentStatus';
import { apiClient } from '../../shared/api/apiClient';

const ParticipantActivityDetailModal = ({ activity, isOpen, onClose, onEnrolled }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const usuarioId = user?.usuarioId || user?.id_usuario || user?.id || '';
  const actividadId = activity?.id || '';

  const enrollment = useEnrollmentStatus({
    usuarioId: usuarioId ? String(usuarioId) : '',
    actividadId: actividadId ? String(actividadId) : '',
  });

  const [estadoPendienteId, setEstadoPendienteId] = useState('');
  const [loadingEstadoPendiente, setLoadingEstadoPendiente] = useState(true);
  const [errorEstadoPendiente, setErrorEstadoPendiente] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchEstadoPendiente = async () => {
      setLoadingEstadoPendiente(true);
      setErrorEstadoPendiente('');

      try {
        const res = await apiClient.get('/estados-inscripcion/obtener/codigo/PENDIENTE');
        const data = res?.data || null;

        if (!isMounted) return;

        const id = data && typeof data === 'object' ? data.id || '' : '';
        setEstadoPendienteId(id);

        if (!id) {
          setErrorEstadoPendiente('No se encontró el estado de inscripción PENDIENTE.');
        }
      } catch (e) {
        if (!isMounted) return;

        setErrorEstadoPendiente(
          e?.message || 'No se pudo obtener el estado de inscripción PENDIENTE.',
        );
        setEstadoPendienteId('');
      } finally {
        if (isMounted) {
          setLoadingEstadoPendiente(false);
        }
      }
    };

    fetchEstadoPendiente();

    return () => {
      isMounted = false;
    };
  }, []);

  const disableReason = useMemo(() => {
    if (!activity) return 'No hay actividad';

    // 1) No permitir si terminó
    if (activity.finalizada) return 'Este evento ya finalizó';

    const estado = String(activity?.estado?.codigo || '').toUpperCase();

    // 2) Estados que NO deben permitir inscripción
    if (['CANCELADO', 'SUSPENDIDO', 'FINALIZADO'].includes(estado)) {
      return 'Este evento no permite inscripciones';
    }

    // 3) Bloqueo por "activa=false" SOLO si el estado NO es uno que normalmente permite
    // (evita el caso EN_CURSO + activa=false)
    if (activity.activa === false && !['EN_CURSO', 'PENDIENTE', 'PUBLICADO'].includes(estado)) {
      return 'Este evento está inactivo';
    }

    // 4) Estados del enrollment
    if (enrollment.loading) return 'Verificando inscripción...';
    if (enrollment.inscripcion) return `Ya estás inscrito (${enrollment.status.label})`;

    // 5) Estado PENDIENTE desde backend
    if (loadingEstadoPendiente) return 'Cargando estado de inscripción...';
    if (errorEstadoPendiente) return errorEstadoPendiente;
    if (!estadoPendienteId) return 'No se pudo determinar el estado de inscripción PENDIENTE.';

    // 6) Usuario
    if (!usuarioId) return 'No se pudo obtener usuarioId';

    return null;
  }, [
    activity,
    enrollment.loading,
    enrollment.inscripcion,
    enrollment.status?.label,
    errorEstadoPendiente,
    loadingEstadoPendiente,
    estadoPendienteId,
    usuarioId,
  ]);

  const canEnroll = !disableReason && !submitting;

  const handleEnroll = async () => {
    if (!activity) return;

    if (!estadoPendienteId) {
      alert(
        'No se pudo determinar el estado de inscripción PENDIENTE. Intenta nuevamente más tarde.',
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        usuarioId: String(usuarioId || ''),
        actividadId: String(activity?.id || ''),
        estadoId: String(estadoPendienteId || ''),
        fechaInscripcion: new Date().toISOString().slice(0, 10),
      };

      console.log('📩 payload inscripción:', payload);

      await inscriptionsApi.inscribirme(payload);

      // refrescar estado en el modal (y opcionalmente refrescar lista afuera)
      await enrollment.reload();

      if (typeof onEnrolled === 'function') {
        await onEnrolled();
      }

      alert('✅ Inscripción registrada (PENDIENTE/por confirmar)');
    } catch (e) {
      alert(`❌ No se pudo inscribir: ${e?.message || 'Error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ActivityDetailModal activity={activity} isOpen={isOpen} onClose={onClose} />

      {/* Dock flotante: se monta SOLO cuando el modal está abierto */}
      {isOpen && activity && (
        <Dock>
          <DockInner>
            <Left>
              <Title>Inscripción</Title>

              {enrollment.loading ? (
                <Meta>⏳ Verificando tu estado.</Meta>
              ) : enrollment.inscripcion ? (
                <Meta>
                  ✅ Estado: <b>{enrollment.status.label}</b>
                </Meta>
              ) : (
                <Meta>✅ Aún no estás inscrito</Meta>
              )}

              {disableReason && !enrollment.inscripcion && <Warn>⚠️ {disableReason}</Warn>}
            </Left>

            <Right>
              <PrimaryButton
                onClick={handleEnroll}
                disabled={!canEnroll}
                title={disableReason || ''}
              >
                {submitting
                  ? 'Inscribiendo...'
                  : enrollment.inscripcion
                  ? 'Ya inscrito'
                  : 'Inscribirme'}
              </PrimaryButton>

              <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
            </Right>
          </DockInner>
        </Dock>
      )}
    </>
  );
};

export default ParticipantActivityDetailModal;

/* ===================== styles ===================== */

const Dock = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 14px;
  z-index: 10020; /* mayor que el modal de activities */
  display: flex;
  justify-content: center;
  padding: 0 16px;
`;

const DockInner = styled.div`
  width: min(920px, 100%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.14);
  border-radius: 16px;
  padding: 14px 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Right = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 680px) {
    justify-content: stretch;
    width: 100%;
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-weight: 900;
  color: #0f172a;
`;

const Meta = styled.div`
  color: #475569;
  font-weight: 700;

  b {
    color: #0f172a;
  }
`;

const Warn = styled.div`
  color: #b45309;
  font-weight: 800;
  font-size: 0.9rem;
`;

const PrimaryButton = styled.button`
  background: #4f7cff;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  min-width: 160px;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #3b63e0;
  }

  @media (max-width: 680px) {
    width: 100%;
    min-width: unset;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }

  @media (max-width: 680px) {
    width: 100%;
  }
`;

