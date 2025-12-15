import React, { useState, useEffect } from "react"; // ✅ CRÍTICO: useEffect debe estar aquí
import styled from "styled-components";
import { 
  ModalOverlay, ModalCard, ModalHeader, ModalBody, ModalFooter, 
  FormGrid, Field, Label, Input, SecondaryButton, PrimaryButton, Alert 
} from "../AdminLayout.styles";
import { USER_FORM_FIELDS } from "../../constants/users.constants"; 
import { validateUserData, prepareUserPayload } from "../../services/userService";

const RolesBox = styled.div`
  border: 1px solid #e6e8ef;
  border-radius: 12px;
  padding: 16px;
  background: #fbfcff;
  display: grid; gap: 12px;
  max-height: 200px; overflow-y: auto;
`;
const RoleCheck = styled.label`
  display: flex; gap: 12px; cursor: pointer; align-items: center;
  font-size: 0.9rem; font-weight: 700;
`;

export const CreateUserModal = ({ isOpen, onClose, onSubmit, availableRoles = [], userToEdit = null }) => {
  const [form, setForm] = useState(USER_FORM_FIELDS);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setForm({
        nombres: userToEdit.firstName || userToEdit.nombres || "", 
        apellidos: userToEdit.lastName || userToEdit.apellidos || "",
        correo: userToEdit.email || userToEdit.correo || "",
        dni: userToEdit.dni || "",
        telefono: userToEdit.telefono || "",
        extensionTelefonica: userToEdit.extensionTelefonica || "",
        rolIds: userToEdit.roleIds || [],
        password: "" 
      });
    } else {
      setForm(USER_FORM_FIELDS);
    }
    setErrors([]);
  }, [userToEdit, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleRole = (roleId) => {
    setForm(prev => {
        const currentRoles = prev.rolIds || [];
        const exists = currentRoles.includes(roleId);
        return {
            ...prev,
            rolIds: exists 
                ? currentRoles.filter(id => id !== roleId)
                : [...currentRoles, roleId]
        };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    
    // Validación personalizada para edición (ignorar password vacío)
    const validation = validateUserData(form);
    
    if (userToEdit && !form.password) {
        // Filtramos error de contraseña si estamos editando
        const relevantErrors = validation.errors.filter(err => !err.toLowerCase().includes("contraseña"));
        if (relevantErrors.length > 0) {
            setErrors(relevantErrors);
            return;
        }
    } else if (!validation.isValid) {
        setErrors(validation.errors);
        return;
    }

    setSaving(true);
    try {
        const payload = prepareUserPayload(form);
        if (userToEdit && !payload.password) delete payload.password;
        
        await onSubmit(payload);
        onClose(); 
    } catch (err) {
        const msg = err.response?.data?.message || err.message || "Error al guardar";
        setErrors([msg]);
    } finally {
        setSaving(false);
    }
  };

  if (!isOpen) return null;
  const title = userToEdit ? "Editar Usuario" : "Crear Usuario";
  const btnLabel = saving ? "Guardando..." : "Guardar";

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard onMouseDown={e => e.stopPropagation()}>
        <ModalHeader>
          <h3>{title}</h3>
          <SecondaryButton onClick={onClose} disabled={saving}>Cerrar</SecondaryButton>
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {errors.length > 0 && (
                <Alert $variant="error">
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                </Alert>
            )}

            <FormGrid style={{ marginTop: 12 }}>
                <Field><Label>Nombres *</Label><Input value={form.nombres} onChange={e => handleChange("nombres", e.target.value)} /></Field>
                <Field><Label>Apellidos *</Label><Input value={form.apellidos} onChange={e => handleChange("apellidos", e.target.value)} /></Field>
                <Field><Label>Correo *</Label><Input type="email" value={form.correo} onChange={e => handleChange("correo", e.target.value)} /></Field>
                <Field>
                    <Label>{userToEdit ? "Nueva Contraseña (opcional)" : "Contraseña *"}</Label>
                    <Input type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} placeholder={userToEdit ? "Vacío para mantener actual" : ""} />
                </Field>
                <Field><Label>DNI *</Label><Input value={form.dni} onChange={e => handleChange("dni", e.target.value)} maxLength={8} /></Field>
                <Field><Label>Teléfono *</Label><Input value={form.telefono} onChange={e => handleChange("telefono", e.target.value)} maxLength={9} /></Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                    <Label>Roles asignados *</Label>
                    <RolesBox>
                        {availableRoles.map(r => (
                            <RoleCheck key={r.id}>
                                <input type="checkbox" checked={form.rolIds.includes(r.id)} onChange={() => toggleRole(r.id)} />
                                {r.nombreRol}
                            </RoleCheck>
                        ))}
                    </RolesBox>
                </Field>
            </FormGrid>
          </ModalBody>
          <ModalFooter>
             <SecondaryButton type="button" onClick={onClose} disabled={saving}>Cancelar</SecondaryButton>
             <PrimaryButton type="submit" disabled={saving}>{btnLabel}</PrimaryButton>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  );
};