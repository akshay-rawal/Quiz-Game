import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://quizgame-8.onrender.com',  // Your backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')  // Optional rewrite if necessary
      },
    },
  },
});
