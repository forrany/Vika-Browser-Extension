import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// 创建统一的构建配置
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-manifest',
      closeBundle() {
        copyFileSync('manifest.json', 'dist/manifest.json')
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/pages/popup.html'),
        sidepanel: resolve(__dirname, 'src/pages/sidepanel.html'),
        content: resolve(__dirname, 'src/content/main.js'),
        background: resolve(__dirname, 'src/background/main.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // 根据不同的入口使用不同的输出配置
          if (chunkInfo.name === 'content') {
            return 'src/content/main.js'
          }
          if (chunkInfo.name === 'background') {
            return 'src/background/main.js'
          }
          return 'src/pages/[name].js'
        },
        chunkFileNames: 'src/chunks/[name].js',
        assetFileNames: 'src/assets/[name].[ext]',
        // 使用 ES 模块格式，这样可以支持代码分割
        format: 'es'
      }
    },
    // 禁用代码分割以确保 content 和 background scripts 是独立的
    modulePreload: {
      polyfill: false
    },
    // 确保生成独立的文件
    cssCodeSplit: true,
    minify: false,
    sourcemap: true
  }
}) 