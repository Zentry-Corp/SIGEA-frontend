// src/features/activities/hooks/useDeleteActivity.js
import { useState } from 'react';
import { activitiesApi } from '../api/activitiesApi';

export const useDeleteActivity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteActivity = async (activityId) => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🗑️ Eliminando actividad ${activityId}...`);
            const result = await activitiesApi.eliminar(activityId);
            console.log('✅ Actividad eliminada:', result);
            return result;
        } catch (err) {
            console.error('❌ Error al eliminar actividad:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteActivity,
        loading,
        error
    };
};
