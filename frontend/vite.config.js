import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  const backendUrl = isProduction
    ? 'https://backend-trading-sinergico.vercel.app' // producción
    : 'http://localhost:5000' // desarrollo

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        }
      }
    },
    define: {
      // La exponemos como variable global de entorno
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(`${backendUrl}/api`)
    }
  }
})
