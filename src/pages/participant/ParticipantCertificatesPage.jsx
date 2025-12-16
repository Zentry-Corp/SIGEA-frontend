// src/pages/participant/ParticipantCertificatesPage.jsx
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { FiSearch, FiDownload, FiCopy, FiInfo } from "react-icons/fi";
import ParticipantLayout from "./ParticipantLayout";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useMyCertificates } from "../../features/participant/hooks/useMyCertificates";
import { certificatesApi } from "../../features/participant/api/certificatesApi";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #111827;
  margin: 0 0 6px 0;
`;

const Subtitle = styled.div`
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 600;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  min-width: 320px;

  @media (max-width: 520px) {
    min-width: 100%;
    width: 100%;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.95rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0 18px;
`;

const Tab = styled.button`
  border: 1px solid ${(p) => (p.$active ? "#4f7cff" : "#e5e7eb")};
  background: ${(p) => (p.$active ? "rgba(79,124,255,0.10)" : "white")};
  color: ${(p) => (p.$active ? "#111827" : "#374151")};
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 800;
  cursor: pointer;
  font-size: 0.9rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
    border-color: rgba(79, 124, 255, 0.55);
  }
`;

const Banner = styled.div`
  height: 110px;
  position: relative;
  background: linear-gradient(135deg, rgba(79, 124, 255, 0.22), rgba(0, 0, 0, 0.03));
  display: flex;
  align-items: flex-end;
  padding: 12px;
`;

const BannerTitle = styled.div`
  font-weight: 900;
  color: #111827;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 8px 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Body = styled.div`
  padding: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  color: #374151;
  font-size: 0.9rem;

  b {
    color: #111827;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.78rem;
  border: 1px solid ${(p) => p.$border || "#e5e7eb"};
  background: ${(p) => p.$bg || "#f9fafb"};
  color: ${(p) => p.$color || "#111827"};
`;

const Actions = styled.div`
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border-top: 1px solid #f1f5f9;
`;

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$primary ? "transparent" : "#e5e7eb")};
  background: ${(p) => (p.$primary ? "#4f7cff" : "white")};
  color: ${(p) => (p.$primary ? "white" : "#111827")};
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(p) => (p.$primary ? "#3b63e0" : "#f9fafb")};
  }
`;

const Empty = styled.div`
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 22px;
  color: #475569;
`;

function estadoBadge(estado) {
  const st = String(estado || "").toUpperCase();
  if (st.includes("EMIT")) return { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", color: "#065f46", label: "EMITIDO" };
  if (st.includes("REV")) return { bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.25)", color: "#991b1b", label: "REVOCADO" };
  if (st.includes("SUSP")) return { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", color: "#92400e", label: "SUSPENDIDO" };
  return { bg: "#f9fafb", border: "#e5e7eb", color: "#111827", label: estado || "—" };
}

export const ParticipantCertificatesPage = () => {
  const { user } = useAuth();
  const usuarioId = user?.usuarioId || user?.id_usuario || user?.id || "";
  const { certificates, loading, error, confirmedCount } = useMyCertificates(String(usuarioId || ""));

  const [q, setQ] = useState("");
  const [tab, setTab] = useState("TODOS");
  const [busyCode, setBusyCode] = useState(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (certificates || []).filter((c) => {
      const estado = String(c?.estado || "").toUpperCase();
      if (tab !== "TODOS" && estado !== tab) return false;

      if (!query) return true;

      const titulo = String(c?.tituloActividad || "").toLowerCase();
      const codigo = String(c?.codigoValidacion || "").toLowerCase();
      const email = String(c?.emailUsuario || "").toLowerCase();
      return titulo.includes(query) || codigo.includes(query) || email.includes(query);
    });
  }, [certificates, q, tab]);

  const handleOpenPdf = (urlPdf) => {
    if (!urlPdf) return;
    window.open(urlPdf, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      alert("✅ Copiado al portapapeles.");
    } catch {
      alert("❌ No se pudo copiar.");
    }
  };

  const handleValidaciones = async (codigoValidacion) => {
    if (!codigoValidacion) return;
    try {
      setBusyCode(codigoValidacion);
      const rows = await certificatesApi.obtenerValidaciones(codigoValidacion);
      alert(`✅ Validaciones encontradas: ${Array.isArray(rows) ? rows.length : 0}`);
      console.log("Validaciones:", rows);
    } catch (e) {
      alert("❌ No se pudieron obtener validaciones.");
    } finally {
      setBusyCode(null);
    }
  };

  return (
    <ParticipantLayout>
      <Container>
        <Header>
          <div>
            <Title>Mis certificados</Title>
            <Subtitle>
              Certificados emitidos por tu participación. (Se generan cuando tu inscripción está confirmada y cumples asistencia)
            </Subtitle>
          </div>

          <Toolbar>
            <Search>
              <FiSearch />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por título / código / email…"
              />
            </Search>
          </Toolbar>
        </Header>

        <Tabs>
          <Tab $active={tab === "TODOS"} onClick={() => setTab("TODOS")}>Todos</Tab>
          <Tab $active={tab === "EMITIDO"} onClick={() => setTab("EMITIDO")}>Emitidos</Tab>
          <Tab $active={tab === "SUSPENDIDO"} onClick={() => setTab("SUSPENDIDO")}>Suspendidos</Tab>
          <Tab $active={tab === "REVOCADO"} onClick={() => setTab("REVOCADO")}>Revocados</Tab>
        </Tabs>

        {loading && <div style={{ color: "#6b7280", fontWeight: 800 }}>Cargando certificados…</div>}
        {error && <div style={{ color: "#ef4444", fontWeight: 900 }}>{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <Empty>
            <strong>No hay certificados para mostrar.</strong>
            <div style={{ marginTop: 6 }}>
              Nota: solo aparecen si tienes <b>{confirmedCount}</b> inscripciones confirmadas y el certificado fue emitido.
            </div>
          </Empty>
        )}

        {!loading && !error && filtered.length > 0 && (
          <Grid>
            {filtered.map((c) => {
              const st = estadoBadge(c?.estado);

              return (
                <Card key={c?.codigoValidacion || c?.idCertificado || Math.random()}>
                  <Banner>
                    <BannerTitle>{c?.tituloActividad || "Certificado"}</BannerTitle>
                  </Banner>

                  <Body>
                    <Row>
                      <div><b>Código</b></div>
                      <div style={{ fontWeight: 800 }}>{c?.codigoValidacion || "—"}</div>
                    </Row>

                    <Row>
                      <div><b>Fecha emisión</b></div>
                      <div>{c?.fechaEmision || "—"}</div>
                    </Row>

                    <Row>
                      <div><b>Estado</b></div>
                      <div>
                        <Badge $bg={st.bg} $border={st.border} $color={st.color}>{st.label}</Badge>
                      </div>
                    </Row>
                  </Body>

                  <Actions>
                    <Btn
                      $primary
                      onClick={() => handleOpenPdf(c?.urlPdf)}
                      disabled={!c?.urlPdf}
                      title={!c?.urlPdf ? "El backend no devolvió urlPdf para este certificado." : "Abrir PDF"}
                    >
                      <FiDownload /> Abrir PDF
                    </Btn>

                    <Btn onClick={() => handleCopy(c?.codigoValidacion)} disabled={!c?.codigoValidacion}>
                      <FiCopy /> Copiar código
                    </Btn>

                    <Btn
                      onClick={() => handleValidaciones(c?.codigoValidacion)}
                      disabled={!c?.codigoValidacion || busyCode === c?.codigoValidacion}
                      title="Ver validaciones (log en consola)"
                    >
                      <FiInfo /> Validaciones
                    </Btn>
                  </Actions>
                </Card>
              );
            })}
          </Grid>
        )}
      </Container>
    </ParticipantLayout>
  );
};

export default ParticipantCertificatesPage;
