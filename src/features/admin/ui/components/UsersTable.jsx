import React from "react";
import { FiShield } from "react-icons/fi"; // Usaremos un escudo para "Roles"
import { TableWrap, Table, Th, Td, UserCell, Avatar, UserMeta, RolePills, RolePill, Muted, IconBtn } from "../styles/AdminUsersStyles";
import { formatDate, initialsFromName } from "../../utils/adminMappers";

export const UsersTable = ({ users, loading, onManageRoles }) => {
  if (loading) return <TableWrap><p style={{ padding: 20, color: "#6b7280" }}>Cargando...</p></TableWrap>;
  if (!users.length) return <TableWrap><p style={{ padding: 20, color: "#6b7280" }}>No hay usuarios.</p></TableWrap>;

  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>USUARIO</Th>
            <Th>ROLES ACTUALES</Th>
            <Th>REGISTRO</Th>
            <Th>ADMINISTRAR</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id || Math.random()}>
              <Td>
                <UserCell>
                  <Avatar>{initialsFromName(u.fullName, u.email)}</Avatar>
                  <UserMeta>
                    <strong>{u.fullName}</strong>
                    <span>{u.email}</span>
                  </UserMeta>
                </UserCell>
              </Td>
              
              <Td>
                <RolePills>
                  {(u.roleNames || []).map((rn, i) => (
                    <RolePill key={i}>{rn}</RolePill>
                  ))}
                </RolePills>
              </Td>

              <Td><Muted>{formatDate(u.createdAt)}</Muted></Td>
              
              <Td>
                <IconBtn 
                    onClick={() => onManageRoles(u)} 
                    title="Cambiar Roles"
                    style={{ color: "#2563eb", borderColor: "#bfdbfe", background: "#eff6ff" }}
                >
                  <FiShield /> 
                </IconBtn>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
};