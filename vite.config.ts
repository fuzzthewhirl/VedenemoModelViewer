import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __API_HOST__: JSON.stringify(process.env.VITE_API_HOST || 'localhost'),
    __API_PORT__: JSON.stringify(process.env.VITE_API_PORT || '8080'),
  },
})
