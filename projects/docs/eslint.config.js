// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'doc',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'doc',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    // Componentes falsos dos testes imitam os da biblioteca (button[arg-x], arg-x)
    files: ['**/*.spec.ts'],
    rules: { '@angular-eslint/component-selector': 'off' },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
]);
