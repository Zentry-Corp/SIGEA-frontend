// src/pages/participant/ParticipantEventsPage.jsx
import React, { useState } from "react";
import ParticipantLayout from "./ParticipantLayout";
import ActivityCard from "../../features/activities/ui/ActivityCard";
import ParticipantActivityDetailModal from "./ParticipantActivityDetailModal";

// ✅ nuevo hook sin endpoints prohibidos
import { usePublicActivities } from "../../features/activities/hooks/usePublicActivities";

const ParticipantEventsPage = () => {
  const { activities, loading, error, refetch } = usePublicActivities({
    allowedStates: ["PUBLICADO", "EN_CURSO"], // recomendado para participante
    onlyAllowedStates: true,
  });

  const [selectedActivity, setSelectedActivity] = useState(null);

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
          />
        ))}
      </div>

      <ParticipantActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onEnrolled={refetch}
      />
    </ParticipantLayout>
  );
};

export default ParticipantEventsPage;
