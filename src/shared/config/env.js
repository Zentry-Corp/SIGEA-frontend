export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'https://sigeabackend.zentrycorp.dev/api/v1',
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 10000,
  PAYMENT_URL: import.meta.env.VITE_PAYMENT_URL || '',
};
