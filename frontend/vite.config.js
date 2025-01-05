import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const Isproduction = process.env.NODE_ENV === 'production';
const targetUrl = Isproduction ?  'https://quiz-game-tq1z.onrender.com':'http://localhost:4001'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  server: {
    proxy: {
      '/api': {
        target: targetUrl,  
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')  // Optional rewrite if necessary
      },
    },
  },
});
