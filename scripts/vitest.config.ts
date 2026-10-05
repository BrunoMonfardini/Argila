import { defineConfig } from 'vitest/config';

// Testes dos scripts do repositório (geradores), fora do Angular.
export default defineConfig({
  test: {
    include: ['scripts/**/*.spec.ts'],
    environment: 'node',
    // O gerador de manifesto cria um programa TypeScript com os tipos do Angular
    testTimeout: 30000,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['scripts/lib/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/__fixtures__/**'],
      reporter: ['text-summary', 'html'],
      reportsDirectory: 'coverage/scripts',
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
