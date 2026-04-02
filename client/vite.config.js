import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards all /api requests to Express so we don't hit CORS in dev
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
