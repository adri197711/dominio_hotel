import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, '../../domain/src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@controllers': path.resolve(__dirname, './src/controllers')
    }
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',  
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.test.tsx'],
  }
});