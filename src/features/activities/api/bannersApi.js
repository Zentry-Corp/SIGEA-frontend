// src/features/activities/api/bannersApi.js
import { apiClient } from '../../../shared/api/apiClient';

export const bannersApi = {
    /**
     * 📤 Subir imagen de banner
     * POST /actividad/banner
     * @param {File} file - Archivo de imagen a subir
     * @returns {Promise<{url: string}>} - URL del banner subido
     */
    subir: async (file) => {
        try {
            const formData = new FormData();
            formData.append('imagen', file);

            console.log('📤 [BANNER] Subiendo imagen...', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            });

            const response = await apiClient.post('/actividad/banner', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('📥 [BANNER] Respuesta:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al subir banner:', error);
            throw error;
        }
    },

    /**
     * 🗑️ Eliminar imagen de banner
     * DELETE /actividad/banner
     * @param {string} filename - Nombre del archivo a eliminar
     * @returns {Promise<void>}
     */
    eliminar: async (filename) => {
        try {
            console.log('🗑️ [BANNER] Eliminando:', filename);

            const response = await apiClient.delete('/actividad/banner', {
                params: { filename }
            });

            console.log('✅ [BANNER] Eliminado correctamente');
            return response.data;
        } catch (error) {
            console.error('❌ Error al eliminar banner:', error);
            throw error;
        }
    },

    /**
     * 📥 Obtener imagen de banner
     * GET /actividad/banner/imagen/{filename}
     * @param {string} filename - Nombre del archivo
     * @returns {string} - URL completa de la imagen
     */
    obtenerUrl: (filename) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        return `${baseUrl}/actividad/banner/imagen/${filename}`;
    }
};
