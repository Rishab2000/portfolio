import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
//
export default defineConfig(() => ({
  base: '/',
  plugins: [
    react(),
    {
      // GitHub Pages serves 404.html for unknown paths. Shipping a copy of
      // index.html lets client-side routes deep-link and survive a refresh.
      name: 'spa-404-fallback',
      closeBundle() {
        try {
          copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
        } catch {
          /* no dist/index.html (non-build command) — nothing to copy */
        }
      },
    },
  ],
}))
