import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['apps/frontend/**/*.test.{ts,tsx}', 'jsdom'],
      ['apps/frontend/**/*.test.{js,jsx}', 'jsdom'],
    ],
  },
});