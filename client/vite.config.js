
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ⚡ Build optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime (cached separately)
          'vendor-react': ['react', 'react-dom'],
          // Router (cached separately)
          'vendor-router': ['react-router-dom'],
          // UI libs
          'vendor-ui': ['react-hot-toast'],
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'es2020',
  },

  // Strip console.log and debugger in production
  esbuild: {
    drop: ['console', 'debugger'],
  },

  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})