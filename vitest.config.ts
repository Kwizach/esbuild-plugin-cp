import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    passWithNoTests: true,
    include: ['tests/**/*.{spec,test}.ts'],
    pool: 'threads',
    coverage: {
      enabled: true,
      reporter: ['html', 'json', 'text'],
    },
  },
});
