// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Solución definitiva para base64-js (evita errores de módulo)
      'base64-js': resolve(__dirname, 'node_modules/base64-js/esm.js'),
    },
  },
});