import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /worldcup2/, so production
  // builds need that prefix; dev server stays at the root.
  base: command === 'build' ? '/worldcup2/' : '/',
  plugins: [react()],
}))
