import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  ModalOverlay, ModalCard, ModalHeader, ModalBody, ModalFooter, 
  SecondaryButton, PrimaryButton, Alert 
} from "../AdminLayout.styles";

/* --- Estilos internos --- */
const RoleOption = styled.label`
  display: flex; align-items: center; gap: 12px; padding: 12px;
  border: 1px solid ${props => props.$checked ? '#bfdbfe' : '#e5e7eb'};
  background: ${props => props.$checked ? '#eff6ff' : '#fff'};
  border-radius: 8px; cursor: pointer; font-weight: 600;
  &:hover { background: #f9fafb; }
`;

export const ManageRolesModal = ({ isOpen, onClose, onSave, user, allRoles }) => {
  const [selectedRoles, setSelectedRoles] = useState([]); // Guardamos IDs
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && isOpen && allRoles.length > 0) {
      // MAGIA: Convertimos los Nombres (que trae el usuario) a IDs (que necesita el sistema)
      // Buscamos en 'allRoles' aquellos cuyo nombre esté en la lista 'user.nombresRoles'
      const currentIds = allRoles
        .filter(r => (user.nombresRoles || []).includes(r.nombreRol))
        .map(r => r.id);
        
      setSelectedRoles(currentIds);
    }
  }, [user, isOpen, allRoles]);

  const toggleRole = (roleId) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId) 
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    if (selectedRoles.length === 0) {
        setError("El usuario debe tener al menos un rol asignado.");
        return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(user.id, selectedRoles);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al guardar";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard style={{ maxWidth: "500px" }} onMouseDown={e => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <h3 style={{ margin: 0 }}>Gestionar Roles</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#6b7280" }}>
              Para: <strong>{user.fullName}</strong>
            </p>
          </div>
          <SecondaryButton onClick={onClose}>✕</SecondaryButton>
        </ModalHeader>

        <ModalBody>
          {error && <Alert $variant="error" style={{ marginBottom: 10 }}>{error}</Alert>}
          
          <p style={{ fontSize: "0.9rem", color: "#374151" }}>Asigna los roles correspondientes:</p>
          
          <div style={{display:'flex', flexDirection:'column', gap: 8}}>
            {allRoles.map(role => {
              const isChecked = selectedRoles.includes(role.id);
              return (
                <RoleOption key={role.id} $checked={isChecked}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => toggleRole(role.id)}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>{role.nombreRol}</span>
                </RoleOption>
              );
            })}
          </div>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton onClick={onClose} disabled={saving}>Cancelar</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Roles"}
          </PrimaryButton>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};