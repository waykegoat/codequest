import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// GitHub Pages деплой ставится в подпапку с именем репозитория.
// Локально base = '/', в проде можно переопределить через переменную окружения.
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  worker: {
    format: 'es',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
  },
})
