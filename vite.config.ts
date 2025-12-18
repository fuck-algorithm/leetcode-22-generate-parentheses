import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/leetcode-22-generate-parentheses/',
  server: {
    port: 37871
  }
})
