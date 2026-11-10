import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build.
// `base` must stay absolute: the app has real routes now, so relative asset
// URLs would resolve against /book-a-demo/ and 404. The host must also serve
// index.html for unknown paths — see deploy/nginx.conf.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2019',
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
    open: false,
    // Same-origin /api in development, matching how nginx proxies it in
    // production, so the frontend never needs an API base URL.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
})
