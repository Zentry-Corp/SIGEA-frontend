import React from 'react';
import styled from 'styled-components';
import { FiBell } from 'react-icons/fi';

const Wrap = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${p => (p.$dark ? 'rgba(255,255,255,0.10)' : '#e2e8f0')};
  background: ${p => (p.$dark ? 'rgba(255,255,255,0.06)' : '#f8fafc')};
  color: ${p => (p.$dark ? 'white' : '#1a1a2e')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s ease;

  &:hover{
    transform: translateY(-1px);
    background: ${p => (p.$dark ? 'rgba(255,255,255,0.10)' : '#f1f5f9')};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  font-weight: 900;
  font-size: 0.72rem;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${p => (p.$dark ? '#0f1419' : 'white')};
`;

export const NotificationBell = ({ count = 0, onClick, dark = false, title = 'Notificaciones' }) => {
  const show = Number(count) > 0;
  const label = show ? (count > 99 ? '99+' : String(count)) : '';

  return (
    <Wrap onClick={onClick} $dark={dark} title={title} aria-label={title}>
      <FiBell size={20} />
      {show && <Badge $dark={dark}>{label}</Badge>}
    </Wrap>
  );
};

export default NotificationBell;
