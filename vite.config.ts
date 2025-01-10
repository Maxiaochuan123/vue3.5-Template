import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vitejs.cn/vite5-cn/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        multipass: true,
      },
    }),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    target: 'modules',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false, // 禁用 gzip 压缩大小报告，提高大型项目的构建性能
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['naive-ui', '@vicons/antd', '@vicons/carbon', '@vicons/ionicons5'],
          'utils-vendor': ['axios', 'echarts', 'crypto-js']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'naive-ui']
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  }
})
