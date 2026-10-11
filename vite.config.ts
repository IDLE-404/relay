import fs from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// GitHub Pages has no SPA routing: it serves 404.html for unknown paths,
// so a copy of index.html there lets the router handle deep links like /relay/console.
const spaFallback = (): Plugin => ({
  name: 'spa-fallback',
  apply: 'build',
  closeBundle() {
    fs.copyFileSync('dist/index.html', 'dist/404.html')
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/relay/',
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
