import React, { useMemo } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { FiGrid, FiUsers, FiShield, FiAward, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";

const Wrap = styled.div`
  height: calc(100vh - 36px);
  display: flex;
  flex-direction: column;
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 18px;
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
`;

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
`;

const UserMeta = styled.div`
  min-width: 0;

  strong {
    display: block;
    color: white;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.85rem;
  }
`;

const SectionLabel = styled.div`
  margin: 6px 0 10px 6px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const Menu = styled.div`
  display: grid;
  gap: 8px;
`;

const Item = styled(NavLink)`
  position: relative;
  text-decoration: none;
  padding: 12px 12px 12px 14px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 700;
  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.90);
  }

  &[aria-current="page"] {
    background: rgba(37, 99, 235, 0.16);
    color: white;
  }

  &[aria-current="page"]::before {
    content: "";
    position: absolute;
    left: 6px;
    top: 10px;
    bottom: 10px;
    width: 3px;
    border-radius: 6px;
    background: #3b82f6;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const LogoutButton = styled.button`
  width: 100%;
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(239, 68, 68, 0.28);
  background: rgba(239, 68, 68, 0.10);
  color: #ff6b6b;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;

  &:hover {
    background: rgba(239, 68, 68, 0.14);
  }
`;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = useMemo(() => {
    const n = (user?.nombres || "U").trim();
    const a = (user?.apellidos || "").trim();
    const i1 = n ? n[0] : "U";
    const i2 = a ? a[0] : "A";
    return (i1 + i2).toUpperCase();
  }, [user?.nombres, user?.apellidos]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Wrap>
      {/* Usuario SOLO a la izquierda (como la referencia) */}
      <UserCard>
        <Avatar>{initials}</Avatar>
        <UserMeta>
          <strong>{user?.nombres || "Usuario"}</strong>
          <span>{user?.rol?.nombre_rol || "Administrador"}</span>
        </UserMeta>
      </UserCard>

      <SectionLabel>Panel</SectionLabel>
      <Menu>
        <Item to="/admin/dashboard">
          <FiGrid /> Dashboard
        </Item>
        <Item to="/admin/usuarios">
          <FiUsers /> Usuarios
        </Item>
        <Item to="/admin/roles">
          <FiShield /> Roles y permisos
        </Item>
      </Menu>

      <Spacer />

      {/* Quitamos “Vista previa del sitio” */}
      <LogoutButton type="button" onClick={handleLogout}>
        <FiLogOut /> Cerrar sesión
      </LogoutButton>
    </Wrap>
  );
};

export default AdminSidebar;
