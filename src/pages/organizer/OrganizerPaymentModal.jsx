// src/pages/organizer/OrganizerPaymentModal.jsx
// Modal para que el organizador cree pagos con Yape (MercadoPago)

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
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.35);
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #111827;
`;

const Subtitle = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 18px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.25);
  }
`;

const TextArea = styled.textarea`
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 70px;
  outline: none;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.25);
  }
`;

const HelperText = styled.div`
  font-size: 0.78rem;
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
  border: 1px solid ${(p) => (p.$primary ? '#4f46e5' : '#e5e7eb')};
  background: ${(p) => (p.$primary ? '#4f46e5' : '#ffffff')};
  color: ${(p) => (p.$primary ? '#ffffff' : '#111827')};
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 120px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(p) => (p.$primary ? '#4338ca' : '#f9fafb')};
  }
`;

const OrganizerPaymentModal = ({ open, onClose, onSuccess, onError }) => {
  const [inscripcionId, setInscripcionId] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('PEN');
  const [estadoPagoId, setEstadoPagoId] = useState('');
  const [metodoPagoId, setMetodoPagoId] = useState('');
  const [referenciaExterna, setReferenciaExterna] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setInscripcionId('');
    setMonto('');
    setMoneda('PEN');
    setEstadoPagoId('');
    setMetodoPagoId('');
    setReferenciaExterna('');
    setDescripcion('Pago de inscripción');
    setSubmitting(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!inscripcionId.trim()) {
      onError?.('Ingresa el ID de la inscripción.');
      return;
    }

    const montoNumber = Number(monto);
    if (!monto || Number.isNaN(montoNumber) || montoNumber <= 0) {
      onError?.('Ingresa un monto válido mayor a 0.');
      return;
    }

    if (!estadoPagoId.trim() || !metodoPagoId.trim()) {
      onError?.('Completa el estado de pago y el método de pago.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        inscripcionId: inscripcionId.trim(),
        monto: montoNumber,
        estadoPagoId: estadoPagoId.trim(),
        moneda: moneda || 'PEN',
        metodoPagoId: metodoPagoId.trim(),
        referenciaExterna: referenciaExterna || '',
        descripcion: descripcion || 'Pago de inscripción',
      };

      const res = await paymentsApi.crearPagoYape(payload);

      onSuccess?.(
        res?.message ||
          'Pago creado correctamente y URL de MercadoPago generada.',
      );
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

  return (
    <Overlay>
      <Modal>
        <Title>Registrar pago</Title>
        <Subtitle>
          Completa los datos para generar el link de pago con Yape.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Inscripción ID</Label>
            <Input
              value={inscripcionId}
              onChange={(e) => setInscripcionId(e.target.value)}
              placeholder="ID de la inscripción asociada"
            />
            <HelperText>
              Copia el ID desde la sección de inscripciones del participante.
            </HelperText>
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
              placeholder="ID del estado de pago (ej. PENDIENTE)"
            />
            <HelperText>
              Usa el ID configurado para pagos pendientes en tu backend.
            </HelperText>
          </Field>

          <Field>
            <Label>Método de pago ID</Label>
            <Input
              value={metodoPagoId}
              onChange={(e) => setMetodoPagoId(e.target.value)}
              placeholder="ID del método configurado para Yape"
            />
            <HelperText>
              Usa el ID del método de pago Yape definido en tu backend.
            </HelperText>
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

export default OrganizerPaymentModal;

