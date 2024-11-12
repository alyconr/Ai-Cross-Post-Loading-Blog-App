// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  const env = loadEnv(mode, '.');
  
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api/v1': {
          target: env.VITE_API_URI,
          changeOrigin: true,
          secure: false,
        }
      },
      port: 5173,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  });
};