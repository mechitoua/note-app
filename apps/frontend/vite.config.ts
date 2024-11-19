import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@pages': resolve(__dirname, './src/pages'),
      '@assets': resolve(__dirname, './src/assets'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@lib': resolve(__dirname, './src/lib'),
      '@styles': resolve(__dirname, './src/styles'),
      '@features': resolve(__dirname, './src/features')
    }
  },
  server: {
    port: 3000
  }
});
