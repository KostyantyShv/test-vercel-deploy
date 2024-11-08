import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        format: 'esm'
      }
    }
  },
  server: {
    port: 3000,
  }
}) 