import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://bytebites-backend-alb-204151322.us-east-1.elb.amazonaws.com'
    }
  }
})
