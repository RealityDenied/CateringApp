import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      // allowedHosts: ['.ngrok-free.app'],
      allowedHosts: 'all',

      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
          // secure: false, // only if you run backend under HTTPS locally
        },
      },
    },
  }
})
