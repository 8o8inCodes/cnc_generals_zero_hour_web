import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/Code/GameEngine/Source/Common/__tests__/setup.ts',
      './src/Code/GameLogic/__tests__/setup.ts'
    ],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/Code/GameEngine/Source/Common/**/*.ts']
    }
  }
});