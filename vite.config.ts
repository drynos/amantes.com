import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      '@': path.resolve('./'),
    },
  },
  define: {
    // IMPORTANTE: Não definir 'process.env': {} aqui, pois quebra o polyfill do index.html
    // Apenas garantimos que global aponte para window
    global: 'window', 
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});