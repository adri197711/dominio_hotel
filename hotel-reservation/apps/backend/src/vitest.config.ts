import { defineConfig } from 'vitest/config';
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
  plugins: [
    tsconfigPaths(),
  ],
    test: {
    globals: true,
    environment: 'node',
       include: ['tests/**/*.test.ts', 'domain/src/**/*.test.ts'],
  }
});