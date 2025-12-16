// src/pages/participant/ParticipantEventsPage.jsx
import React, { useEffect, useState } from "react";
import ParticipantLayout from "./ParticipantLayout";
import ActivityCard from "../../features/activities/ui/ActivityCard";
import ParticipantActivityDetailModal from "./ParticipantActivityDetailModal";

// nuevo hook sin endpoints prohibidos
import { usePublicActivities } from "../../features/activities/hooks/usePublicActivities";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../shared/api/apiClient";
import { inscriptionsApi } from "../../features/participant/api/inscriptionsApi";
import { AlertSuccess, AlertError } from "@/shared/ui/components/Alert";

const ParticipantEventsPage = () => {
  const { user } = useAuth();

  const { activities, loading, error, refetch } = usePublicActivities({
    allowedStates: ["PUBLICADO", "EN_CURSO"], // recomendado para participante
    onlyAllowedStates: true,
  });

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [estadoPendienteId, setEstadoPendienteId] = useState("");
  const [loadingEstadoPendiente, setLoadingEstadoPendiente] = useState(true);
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    let mounted = true;

    const fetchEstadoPendiente = async () => {
      setLoadingEstadoPendiente(true);
      try {
        const res = await apiClient.get(
          "/estados-inscripcion/obtener/codigo/PENDIENTE",
        );
        const data = res?.data || null;
        if (!mounted) return;
        const id = data && typeof data === "object" ? data.id || "" : "";
        setEstadoPendienteId(id);
      } catch (e) {
        if (!mounted) return;
        console.error(
          "Error al obtener estado de inscripción PENDIENTE:",
          e?.message,
        );
        setEstadoPendienteId("");
      } finally {
        if (mounted) setLoadingEstadoPendiente(false);
      }
    };

    fetchEstadoPendiente();

    return () => {
      mounted = false;
    };
  }, []);

  const handleEnrollFromCard = async (activity) => {
    if (!activity) return;

    if (loadingEstadoPendiente) {
      alert(
        "Estamos cargando la configuración de inscripciones. Intenta en unos segundos.",
      );
      return;
    }

    if (!estadoPendienteId) {
      alert("No se pudo determinar el estado de inscripción PENDIENTE.");
      return;
    }

    const usuarioId =
      user?.usuarioId || user?.id_usuario || user?.id || "";

    if (!usuarioId) {
      alert("No se pudo obtener tu usuario. Vuelve a iniciar sesión.");
      return;
    }

    try {
      const payload = {
        usuarioId: String(usuarioId),
        actividadId: String(activity.id),
        estadoId: String(estadoPendienteId),
        fechaInscripcion: new Date().toISOString().slice(0, 10),
      };

      console.log("Inscribir desde card:", payload);

      await inscriptionsApi.inscribirme(payload);

      setSuccessModal({
        open: true,
        message:
          "Tu inscripción se registró correctamente (pendiente/por confirmar).",
      });
      await refetch();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo completar la inscripción.";
      setErrorModal({ open: true, message: msg });
    }
  };

  return (
    <ParticipantLayout>
      {loading && <p>Cargando actividades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: 24,
        }}
      >
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onViewDetail={() => {
              console.log("selectedActivity:", activity);
              setSelectedActivity(activity);
            }}
            onEnroll={() => handleEnrollFromCard(activity)}
          />
        ))}
      </div>

      <ParticipantActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => {
          setSelectedActivity(null);
        }}
        onEnrolled={refetch}
      />

      <AlertSuccess
        open={successModal.open}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: "" })}
      />

      <AlertError
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />
    </ParticipantLayout>
  );
};

export default ParticipantEventsPage;
