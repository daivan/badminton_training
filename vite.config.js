import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: './', // Set base to relative path for GitHub Pages
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: 'docs', // Output to the docs directory for GitHub Pages
    // Removed: assetsInlineLimit: 1000000,
    // Removed: rollupOptions.output.assetFileNames,
    // Default behavior for public directory assets should now be preserved.
  },
})
