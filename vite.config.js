import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Porta padrão do Vite (evita conflito com backend na porta 8080)
    host: true, // Permite acesso de outros dispositivos na rede
  },
  preview: {
    port: 4173, // Porta para preview da build
    host: true,
  },
})

