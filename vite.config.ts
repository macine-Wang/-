import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/marc.github.io/' : '/', // 生产环境使用GitHub Pages路径，开发环境使用根路径
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
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
    }
  }
})