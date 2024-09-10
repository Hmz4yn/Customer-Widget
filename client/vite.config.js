// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // Proxying requests to your Socket.io server
      '/socket.io': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
      }
    },
    cors: {
      origin: ['http://127.0.0.1:5173'], // Adjust this as needed
      methods: ['GET', 'POST'],
      credentials: true, // Allow cookies if required
    }
  }
})
