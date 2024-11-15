import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  const env = loadEnv(mode, '.');
  
  return defineConfig({
    plugins: [react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    })],
    server: {
      proxy: {
        '/api/v1': {
          target: mode === 'production' 
            ? 'http://backend:9000'  // Docker service name
            : env.VITE_API_URI,
          changeOrigin: true,
          secure: false,
        }
      },
      watch: {
        usePolling: true,
      },
      
      host: true,  // explicitly set host
      cors: true        // enable CORS
    },
    resolve: {
      alias: {
        'react': 'react',
        'react-dom': 'react-dom'
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment'
    }
  });
};