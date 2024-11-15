import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/pages/popup.html'),
        content: resolve(__dirname, 'src/content/main.js'),
        background: resolve(__dirname, 'src/background/main.js')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  }
}) 