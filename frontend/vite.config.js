import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  
        changeOrigin: true,
        // secure: false, // only if you run backend under HTTPS locally
      },
    },
  },
})
