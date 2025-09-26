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
    assetsInlineLimit: 1000000, // Inline all assets
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Inline dynamic imports
        entryFileNames: 'assets/[name].js', // Keep original entry file names
        chunkFileNames: 'assets/[name].js', // Keep original chunk file names
        assetFileNames: 'assets/[name].[ext]', // Keep original asset file names
      },
    },
    cssCodeSplit: false, // Ensure CSS is inlined
  },
})
