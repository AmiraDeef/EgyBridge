// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://egy-backend.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});