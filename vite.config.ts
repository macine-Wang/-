import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel部署使用根路径
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
    exclude: ['pdfjs-dist/build/pdf.worker.min.js']
  },
  assetsInclude: ['**/*.worker.js', '**/*.worker.min.js'],
  worker: {
    format: 'es'
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境不需要sourcemap
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['date-fns', 'zustand']
        }
      }
    },
    copyPublicDir: true
  }
})