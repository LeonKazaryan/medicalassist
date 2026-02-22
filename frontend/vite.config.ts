import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          // keep the /api prefix so requests reach the backend controller
          rewrite: (path) => path
        },
        '/diagnose': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path
        }
      }
    }
  }
})
