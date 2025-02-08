import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import archiver from 'archiver'

// https://vitejs.cn/vite5-cn/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const desktopPath = resolve(process.env.USERPROFILE || process.env.HOME || '', 'Desktop', '广告平台')
  const zipPath = resolve(process.env.USERPROFILE || process.env.HOME || '', 'Desktop', '广告平台.zip')

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: [
      vue(),
      svgLoader({
        svgoConfig: {
          multipass: true,
        },
      }),
      vueJsx(),
      vueDevTools(),
      {
        name: 'zip-build',
        closeBundle: async () => {
          const output = fs.createWriteStream(zipPath)
          const archive = archiver('zip', {
            zlib: { level: 9 }
          })

          output.on('close', () => {
            console.log('Build has been zipped successfully!')
            // 删除原始构建文件夹
            fs.rmSync(desktopPath, { recursive: true, force: true })
          })

          archive.on('error', (err: Error) => {
            throw err
          })

          archive.pipe(output)
          archive.directory(desktopPath, false)
          await archive.finalize()
        }
      }
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
      reportCompressedSize: false,
      outDir: desktopPath,
      emptyOutDir: true,
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
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none'
    }
  }
}
