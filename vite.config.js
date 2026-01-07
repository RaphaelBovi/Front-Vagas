import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuração apenas para desenvolvimento local
  server: {
    port: 5173, // Porta apenas para desenvolvimento local
    host: true,
  },
  preview: {
    port: 4173, // Porta apenas para preview local
    host: true,
  },
  // Configuração de build para produção
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Usa esbuild (padrão do Vite, mais rápido e não requer dependência extra)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})

