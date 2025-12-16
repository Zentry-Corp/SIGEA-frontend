// src/pages/participant/ParticipantPaymentModal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { paymentsApi } from '../../features/participant/api/paymentsApi';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10030;
`;

const Modal = styled.div`
  width: min(480px, 100%);
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.35);
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #111827;
`;

const Subtitle = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
`;

const Input = styled.input`
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: #4f7cff;
    box-shadow: 0 0 0 1px rgba(79, 124, 255, 0.3);
  }
`;

const TextArea = styled.textarea`
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
  outline: none;

  &:focus {
    border-color: #4f7cff;
    box-shadow: 0 0 0 1px rgba(79, 124, 255, 0.3);
  }
`;

const HelperText = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$primary ? '#4f7cff' : '#e5e7eb')};
  background: ${(p) => (p.$primary ? '#4f7cff' : '#ffffff')};
  color: ${(p) => (p.$primary ? '#ffffff' : '#111827')};
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 110px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(p) => (p.$primary ? '#3b63e0' : '#f9fafb')};
  }
`;

const ParticipantPaymentModal = ({ open, inscription, onClose, onSuccess, onError }) => {
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('PEN');
  const [estadoPagoId, setEstadoPagoId] = useState('');
  const [metodoPagoId, setMetodoPagoId] = useState('');
  const [referenciaExterna, setReferenciaExterna] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !inscription) return;

    const defaultDescription = inscription?.actividad?.titulo
      ? `Pago de inscripción a "${inscription.actividad.titulo}"`
      : 'Pago de inscripción';

    setMonto('');
    setMoneda('PEN');
    setEstadoPagoId('');
    setMetodoPagoId('');
    setReferenciaExterna('');
    setDescripcion(defaultDescription);
    setSubmitting(false);
  }, [open, inscription]);

  if (!open || !inscription) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const inscripcionId = inscription.id;
    if (!inscripcionId) {
      onError?.('No se encontró el ID de la inscripción.');
      return;
    }

    const montoNumber = Number(monto);
    if (!monto || Number.isNaN(montoNumber) || montoNumber <= 0) {
      onError?.('Ingresa un monto válido mayor a 0.');
      return;
    }

    if (!estadoPagoId || !metodoPagoId) {
      onError?.('Completa el estado de pago y el método de pago.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        inscripcionId,
        monto: montoNumber,
        estadoPagoId,
        moneda: moneda || 'PEN',
        metodoPagoId,
        referenciaExterna: referenciaExterna || '',
        descripcion: descripcion || 'Pago de inscripción',
      };

      await paymentsApi.crearPagoYape(payload);

      onSuccess?.('Pago creado correctamente (Yape/MercadoPago).');
      onClose?.();
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        'No se pudo crear el pago.';
      onError?.(message);
    } finally {
      setSubmitting(false);
    }
  };

  const actividadTitulo =
    inscription?.actividad?.titulo || `Inscripción ${inscription.id}`;

  return (
    <Overlay>
      <Modal>
        <Title>Registrar pago</Title>
        <Subtitle>{actividadTitulo}</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Inscripción ID</Label>
            <Input value={inscription.id} readOnly />
            <HelperText>Este valor viene de la inscripción seleccionada.</HelperText>
          </Field>

          <Field>
            <Label>Monto</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ej: 150.00"
            />
          </Field>

          <Field>
            <Label>Moneda</Label>
            <Input
              value={moneda}
              onChange={(e) => setMoneda(e.target.value.toUpperCase())}
              placeholder="Ej: PEN"
            />
          </Field>

          <Field>
            <Label>Estado de pago ID</Label>
            <Input
              value={estadoPagoId}
              onChange={(e) => setEstadoPagoId(e.target.value)}
              placeholder="ID del estado de pago (por ejemplo, PENDIENTE)"
            />
            <HelperText>Usa el ID configurado para pagos pendientes en tu backend.</HelperText>
          </Field>

          <Field>
            <Label>Método de pago ID</Label>
            <Input
              value={metodoPagoId}
              onChange={(e) => setMetodoPagoId(e.target.value)}
              placeholder="ID del método configurado para Yape"
            />
            <HelperText>Usa el ID del método de pago Yape definido en tu backend.</HelperText>
          </Field>

          <Field>
            <Label>Referencia externa</Label>
            <Input
              value={referenciaExterna}
              onChange={(e) => setReferenciaExterna(e.target.value)}
              placeholder="Ej: número de operación, referencia interna, etc."
            />
          </Field>

          <Field>
            <Label>Descripción</Label>
            <TextArea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Field>

          <Actions>
            <Button type="button" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" $primary disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar pago'}
            </Button>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default ParticipantPaymentModal;

