import styled from "styled-components";
import { Panel } from "../AdminLayout.styles";

/* --- Contenedores y Filtros --- */
export const Controls = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SearchBar = styled.div`
  height: 46px;
  background: #ffffff;
  border: 1px solid #e6e8ef;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;

  svg { opacity: 0.6; }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  height: 100%;
  font-size: 0.95rem;
  background: transparent;
`;

export const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const Select = styled.select`
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #ffffff;
  padding: 0 12px;
  font-weight: 700;
  color: #111827;
  cursor: pointer;

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

/* --- Tabla --- */
export const TablePanel = styled(Panel)`
  padding: 0;
  overflow: hidden;
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Th = styled.th`
  text-align: left;
  font-size: 0.78rem;
  color: #6b7280;
  padding: 14px 14px;
  border-bottom: 1px solid #e6e8ef;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 14px 14px;
  border-bottom: 1px solid #eef0f6;
  color: #111827;
  vertical-align: middle;
`;

/* --- Celdas --- */
export const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #1d4ed8;
  font-weight: 900;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const UserMeta = styled.div`
  min-width: 0;
  strong {
    display: block;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    display: block;
    font-size: 0.82rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const RolePills = styled.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const RolePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
`;

export const Muted = styled.span`
  color: #6b7280;
`;

export const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover { background: #f3f5fb; }
`;

export const ActionContainer = styled.div`
  position: relative; /* Para que el menú flote respecto a este botón */
`;

export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%; /* Justo debajo del botón */
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #e6e8ef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 140px;
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.$danger ? '#ef4444' : '#374151'};

  &:hover {
    background: ${props => props.$danger ? '#fef2f2' : '#f9fafb'};
  }
  
  svg {
    font-size: 1rem;
    opacity: 0.8;
  }
`;