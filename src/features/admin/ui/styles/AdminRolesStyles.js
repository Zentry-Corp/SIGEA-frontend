import styled from "styled-components";

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
  font-size: 0.85rem;
  color: #6b7280;
  padding: 12px 10px;
  border-bottom: 1px solid #e6e8ef;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 12px 10px;
  border-bottom: 1px solid #eef0f6;
  color: #111827;
  vertical-align: middle;
`;

export const RowActions = styled.div`
  display: inline-flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid ${({ $danger }) => $danger ? "rgba(239, 68, 68, 0.35)" : "#e6e8ef"};
  background: #ffffff;
  cursor: pointer;
  font-weight: 700;
  color: ${({ $danger }) => $danger ? "#ef4444" : "#111827"};
  
  &:hover {
    background: ${({ $danger }) => $danger ? "rgba(239, 68, 68, 0.08)" : "#f3f5fb"};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const IdCell = styled.code`
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 4px 8px;
  border-radius: 6px;
`;