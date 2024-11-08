import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'script-defer',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: false,
      useCredentials: true
    })
  ],
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