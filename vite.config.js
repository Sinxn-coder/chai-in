import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          framer: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          lucide: ['lucide-react'],
          utils: ['date-fns']
        }
      }
    },
    // Enable code splitting for better performance
    chunkSizeWarningLimit: 1000,
    // Optimize assets
    assetsInlineLimit: 4096
  },
  // Development server optimizations
  server: {
    hmr: {
      overlay: false
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})
