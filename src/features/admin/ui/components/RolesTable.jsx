import React from "react";
import { TableWrap, Table, Th, Td, IdCell, RowActions, ActionButton } from "../styles/AdminRolesStyles";

export const RolesTable = ({ roles, loading, onEdit, onDelete }) => {
  if (loading) return <p style={{ padding: 20, color: "#6b7280" }}>Cargando roles...</p>;
  if (!roles.length) return <p style={{ padding: 20, color: "#6b7280" }}>No hay roles creados.</p>;

  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Descripción</Th>
            <Th>ID</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r, index) => {
             // Clave única segura
             const key = r.id || `role-${index}`;
             return (
              <tr key={key}>
                <Td><strong>{r.nombreRol}</strong></Td>
                <Td>{r.descripcion || "—"}</Td>
                <Td>
                    {r.id ? <IdCell>{r.id}</IdCell> : <span style={{color:'red'}}>⚠️ Sin ID</span>}
                </Td>
                <Td>
                  <RowActions>
                    <ActionButton onClick={() => onEdit(r)} disabled={!r.id}>
                      Editar
                    </ActionButton>
                    <ActionButton $danger onClick={() => onDelete(r)} disabled={!r.id}>
                      Eliminar
                    </ActionButton>
                  </RowActions>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrap>
  );
};