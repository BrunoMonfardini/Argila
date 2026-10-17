// @ts-check
import presets from 'jest-preset-angular/presets/index.js';

/**
 * Testes unitários do repositório: biblioteca (ui), catálogo (docs) e scripts.
 * Um único executor, com cobertura e relatório JUnit para o CI.
 *
 * Tudo roda como ESM (os scripts usam import.meta e imports com .ts, e o
 * Angular é publicado em ESM), por isso o Jest roda com
 * --experimental-vm-modules e cada spec importa `jest` de '@jest/globals'.
 */

/** @param {string} project */
function angular(project) {
  const preset = presets.createEsmPreset({
    tsconfig: `<rootDir>/projects/${project}/tsconfig.spec.json`,
  });
  return {
    ...preset,
    displayName: project,
    roots: [`<rootDir>/projects/${project}/src`],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      ...preset.moduleNameMapper,
      '^@brunomonfardini/ui$': '<rootDir>/projects/ui/src/public-api.ts',
    },
  };
}

/** @type {import('jest').Config} */
export default {
  projects: [
    angular('ui'),
    angular('docs'),
    {
      displayName: 'scripts',
      testEnvironment: 'node',
      roots: ['<rootDir>/scripts'],
      extensionsToTreatAsEsm: ['.ts'],
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          { useESM: true, tsconfig: '<rootDir>/scripts/tsconfig.jest.json' },
        ],
      },
    },
  ],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'projects/ui/src/**/*.ts',
    'projects/docs/src/**/*.ts',
    'scripts/lib/**/*.ts',
    '!**/*.spec.ts',
    '!**/public-api.ts',
    '!**/main.ts',
    '!**/__fixtures__/**',
  ],
  coverageReporters: ['text-summary', 'html', 'json-summary', 'lcov'],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'junit.xml',
        // "describe › describe" na suíte e só o título no nome: o relatório junta os dois
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        suiteNameTemplate: '{filepath}',
      },
    ],
  ],
  testTimeout: 30000,
};
