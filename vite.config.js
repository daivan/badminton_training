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
  base: '/badminton_training/', // Updated to reflect the subdirectory on GitHub Pages
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: 'docs', // Output to the docs directory for GitHub Pages
    rollupOptions: {
      output: {
        // Ensure JS files go into 'assets/' folder with specific naming
        entryFileNames: 'assets/[name].js', // Example: index.js -> assets/index.js
        chunkFileNames: 'assets/[name].js', // Example: SomeChunk.js -> assets/SomeChunk.js
        assetFileNames: 'assets/[name].[ext]', // Example: style.css -> assets/style.css
        inlineDynamicImports: true, // Keep dynamic imports inlined
      },
    },
  },
})
