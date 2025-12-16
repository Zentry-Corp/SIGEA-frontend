import styled from "styled-components";

export const AdminShell = styled.div`
  height: 100vh;
  overflow: hidden;
  background: #f6f7fb;
  display: grid;
  grid-template-columns: 260px 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;


export const Sidebar = styled.aside`
  height: 100vh;
  padding: 18px 16px;
  background: linear-gradient(180deg, #0b1220 0%, #0a1628 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;

  @media (max-width: 900px) {
    display: none;
  }
`;



export const Content = styled.main`
  height: 100vh;
  overflow-y: auto;
  background: #f6f7fb;
  padding: 28px;

  @media (max-width: 768px) {
    padding: 18px;
  }
`;



export const LayoutTopbar = styled.header`
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e6e8ef;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 18px;
`;

export const SearchWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.55;
  display: inline-flex;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  outline: none;
  padding: 0 12px 0 38px;
  font-size: 0.95rem;
  background: #fbfcff;

  &:focus {
    border-color: #c7d2fe;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    background: #ffffff;
  }
`;

export const TopbarRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const IconButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f5fb;
  }
`;

export const AvatarButton = styled.button`
  border: 1px solid #e6e8ef;
  background: #ffffff;
  cursor: pointer;
  border-radius: 999px;
  padding: 6px 10px 6px 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f3f5fb;
  }
`;

export const AvatarCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  font-weight: 800;
  font-size: 0.78rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Page = styled.div`
  padding: 26px 28px;

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

/* =========================
   UI helpers (cards, grids)
========================= */

export const Breadcrumb = styled.div`
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 6px;
`;

export const PageHeader = styled.div`
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: 1.6rem;
    color: #111827;
    letter-spacing: -0.3px;
  }

  p {
    margin: 6px 0 0 0;
    color: #6b7280;
    font-size: 0.95rem;
  }
`;

export const Panel = styled.section`
  background: #ffffff;
  border: 1px solid #e6e8ef;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
`;

export const Grid = styled.div`
  display: grid;
  gap: 18px;
`;

export const WelcomeCard = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const WelcomeText = styled.div`
  small {
    display: block;
    color: #6b7280;
    margin-bottom: 6px;
  }

  h2 {
    margin: 0;
    font-size: 1.35rem;
    color: #111827;
    letter-spacing: -0.3px;
  }

  p {
    margin: 6px 0 0 0;
    color: #6b7280;
    font-size: 0.95rem;
  }
`;

export const PrimaryButton = styled.button`
  background: #2563eb;
  border: 1px solid #2563eb;
  color: white;
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background: #ffffff;
  border: 1px solid #e6e8ef;
  color: #111827;
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #f3f5fb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerTextButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  font-weight: 700;
  cursor: pointer;
  padding: 8px 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled(Panel)`
  padding: 16px;

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    background: ${({ $tone }) =>
      $tone === "green"
        ? "rgba(34,197,94,0.12)"
        : $tone === "amber"
        ? "rgba(245,158,11,0.14)"
        : $tone === "purple"
        ? "rgba(168,85,247,0.14)"
        : "rgba(37,99,235,0.12)"};
    color: ${({ $tone }) =>
      $tone === "green"
        ? "#16a34a"
        : $tone === "amber"
        ? "#d97706"
        : $tone === "purple"
        ? "#7c3aed"
        : "#2563eb"};
  }

  .label {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .value {
    font-size: 1.6rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.2px;
  }

  .hint {
    margin-top: 6px;
    color: #6b7280;
    font-size: 0.85rem;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
`;

export const QuickRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickAction = styled.button`
  text-align: left;
  border-radius: 16px;
  padding: 18px;
  cursor: pointer;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "green"
        ? "rgba(34,197,94,0.25)"
        : $tone === "purple"
        ? "rgba(168,85,247,0.25)"
        : "rgba(37,99,235,0.25)"};
  background: ${({ $tone }) =>
    $tone === "green"
      ? "rgba(34,197,94,0.10)"
      : $tone === "purple"
      ? "rgba(168,85,247,0.10)"
      : "rgba(37,99,235,0.10)"};

  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $tone }) =>
      $tone === "green"
        ? "rgba(34,197,94,0.14)"
        : $tone === "purple"
        ? "rgba(168,85,247,0.14)"
        : "rgba(37,99,235,0.14)"};
  }

  .icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: ${({ $tone }) =>
      $tone === "green"
        ? "rgba(34,197,94,0.18)"
        : $tone === "purple"
        ? "rgba(168,85,247,0.18)"
        : "rgba(37,99,235,0.18)"};
    color: ${({ $tone }) =>
      $tone === "green"
        ? "#16a34a"
        : $tone === "purple"
        ? "#7c3aed"
        : "#2563eb"};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 18px;
  }

  h4 {
    margin: 0 0 6px 0;
    color: #111827;
    font-size: 1rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .link {
    margin-top: 10px;
    color: ${({ $tone }) =>
      $tone === "green"
        ? "#16a34a"
        : $tone === "purple"
        ? "#7c3aed"
        : "#2563eb"};
    font-weight: 700;
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }
`;

/* =========================
   Alerts (errores backend visibles)
========================= */

export const Alert = styled.div`
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "success"
        ? "rgba(34,197,94,0.35)"
        : "rgba(239,68,68,0.35)"};
  background: ${({ $variant }) =>
    $variant === "success"
      ? "rgba(34,197,94,0.10)"
      : "rgba(239,68,68,0.10)"};
  color: ${({ $variant }) => ($variant === "success" ? "#166534" : "#991b1b")};
  font-weight: 600;
`;

/* =========================
   Modal simple (sin depender de tu Modal shared)
========================= */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e6e8ef;
  box-shadow: 0 14px 60px rgba(16, 24, 40, 0.20);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #e6e8ef;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    color: #111827;
    font-size: 1.05rem;
  }
`;

export const ModalBody = styled.div`
  padding: 18px;
`;

export const ModalFooter = styled.div`
  padding: 16px 18px;
  border-top: 1px solid #e6e8ef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: grid;
  gap: 6px;
`;

export const Label = styled.label`
  color: #374151;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const Input = styled.input`
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  padding: 0 12px;
  outline: none;
  background: #fbfcff;

  &:focus {
    border-color: #c7d2fe;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    background: #ffffff;
  }
`;

export const Textarea = styled.textarea`
  min-height: 90px;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  padding: 10px 12px;
  outline: none;
  background: #fbfcff;

  &:focus {
    border-color: #c7d2fe;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    background: #ffffff;
  }
`;
