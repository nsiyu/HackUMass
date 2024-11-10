import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/loaders/GLTFLoader',
      'three/examples/jsm/utils/SkeletonUtils',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/three/, /node_modules/]
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
})
