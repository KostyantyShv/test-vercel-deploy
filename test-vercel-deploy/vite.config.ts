import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'terser',
  },
  server: {
    port: 3000,
  }
}) 