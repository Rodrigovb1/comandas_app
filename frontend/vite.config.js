import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    // Configuração do Proxy Vite para evitar problemas de SSL/TLS
    server: {
      proxy: {
        '/api': {
          // endereço da api - lido exclusivamente do .env
          target: env.VITE_PROXY_TARGET,
          // muda o host para o target
          changeOrigin: true,
          // ignora ou não a verificação SSL/TLS - lido exclusivamente do .env (útil para desenvolvimento local com HTTPS)
          secure: env.VITE_PROXY_SECURE === 'true', // booleano para converter string para boolean
          rewrite: (path) => path.replace(/^\/api/, ''), // opcional: reescreve o caminho removendo o prefixo /api
        },
      },
    },
  }
})
