import tailwindcss from '@tailwindcss/vite';

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html','lcov'], // puedes agregar lcov si quieres integrarlo a CI
      include: ['src/components/**/*.{js,jsx}'], // solo componentes
      exclude: [
        'src/main.jsx',
        'src/App.jsx',
        'src/context/**',
        'src/pages/**',
        'src/utils/**',
        'src/api/**'
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      }
    }
  }
})
