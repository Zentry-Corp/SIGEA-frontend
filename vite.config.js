import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // cualquier request que empiece con /api se reenvía al backend
      '/api': {
        target: 'https://sigeabackend.pautb.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
