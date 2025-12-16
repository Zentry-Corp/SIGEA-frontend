import React, { useState, useEffect } from "react";
import { 
  ModalOverlay, ModalCard, ModalHeader, ModalBody, ModalFooter, 
  Field, Label, Input, Textarea, SecondaryButton, PrimaryButton, Alert 
} from "../adminLayout.styles";

// INTEGRACIÓN: Constants y Services
import { MODAL_TITLES, ROLE_FORM_FIELDS } from "../../constants/roles.constants"; // [cite: 436-438]
import { validateRoleData, prepareRolePayload } from "../../services/roleService"; // [cite: 440-444]

export const RoleModal = ({ isOpen, onClose, onSubmit, mode = "create", initialData = null }) => {
  const [form, setForm] = useState(ROLE_FORM_FIELDS);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isOpen && mode === "edit" && initialData) {
      setForm({
        nombreRol: initialData.nombreRol || "",
        descripcion: initialData.descripcion || ""
      });
    } else {
      setForm(ROLE_FORM_FIELDS); // Resetear al abrir en modo create
    }
    setErrors([]);
  }, [isOpen, mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // 1. Validar (Service)
    const validation = validateRoleData(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      // 2. Preparar Payload (Service)
      const payload = prepareRolePayload(form);
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors([err.message || "Error al guardar rol"]);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard onMouseDown={e => e.stopPropagation()}>
        <ModalHeader>
          <h3>{MODAL_TITLES[mode]}</h3>
          <SecondaryButton onClick={onClose} disabled={saving}>Cerrar</SecondaryButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {errors.length > 0 && (
                <Alert $variant="error">
                    <ul style={{margin:0, paddingLeft:20}}>
                        {errors.map((e,i) => <li key={i}>{e}</li>)}
                    </ul>
                </Alert>
            )}
            
            <div style={{ display: 'grid', gap: 12, marginTop: 10 }}>
                <Field>
                  <Label>Nombre del rol *</Label>
                  <Input 
                    value={form.nombreRol} 
                    onChange={e => setForm({...form, nombreRol: e.target.value})} 
                    placeholder="Ej: Administrador, Editor"
                  />
                </Field>

                <Field>
                  <Label>Descripción</Label>
                  <Textarea 
                    value={form.descripcion} 
                    onChange={e => setForm({...form, descripcion: e.target.value})} 
                    rows={4}
                    placeholder="Describe los permisos..."
                  />
                </Field>
            </div>
          </ModalBody>

          <ModalFooter>
            <SecondaryButton type="button" onClick={onClose} disabled={saving}>Cancelar</SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
            </PrimaryButton>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  );
};