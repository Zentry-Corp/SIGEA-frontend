// src/features/participant/api/paymentsApi.js
import { apiClient } from '../../../shared/api/apiClient';

export const paymentsApi = {
  // Crear pago con Yape (MercadoPago)
  crearPagoYape: async (payload) => {
    const res = await apiClient.post('/pagos/crear-pago-yape', payload);
    return res.data;
  },

  // Listar estados de pago
  listarEstadosPago: async () => {
    const res = await apiClient.get('/estado-pago/listar-estados-pago');
    return res.data;
  },

  // Listar métodos de pago
  listarMetodosPago: async () => {
    const res = await apiClient.get('/metodo-pago/listar-metodos-pago');
    return res.data;
  },
};

export default paymentsApi;
