import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',      // Acepta conexiones externas
    port: 5173,           // Puerto de dev server Vite
    strictPort: true,     // Falla si el puerto está ocupado
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001', // Forzar IPv4 localhost
        changeOrigin: true,
        secure: false,
        // No usamos rewrite: dejamos el prefijo /api para que Express lo gestione
      },
    },
    hmr: {
      overlay: false,     // Deshabilita el overlay de errores HMR
    },
  },
})
