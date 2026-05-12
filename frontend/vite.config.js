import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://bytebites-frontend-nosayba-2.s3-website-us-east-1.amazonaws.com'
    }
  }
})
