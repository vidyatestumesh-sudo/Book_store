import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isLocal = process.env.NODE_ENV !== 'production';
const backendUrl = isLocal
  ? 'http://localhost:5000'
  : 'https://bookstore-backend-hshq.onrender.com';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backendUrl,
    },
  },
})
