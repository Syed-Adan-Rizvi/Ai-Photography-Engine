import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'force-close-vercel-build',
      apply: 'build',
      closeBundle() {
        process.exit(0)
      }
    }
  ]
})