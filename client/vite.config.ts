import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:3001', // ✅ use IPv4 to fix ENOBUFS
        secure: false,
        changeOrigin: true
      }
    }
  }
})
