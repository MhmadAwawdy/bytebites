import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // avoids eval usage that triggers CSP errors
    }),
  ],
  build: {
    target: 'es2015',
    sourcemap: false,
  },
  base: '/', // required for S3 static hosting
})
