// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    // Exemplos e páginas do catálogo não são publicados: usam o prefixo do catálogo
    files: ['**/examples/*.ts', '**/*.docs.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: 'doc', style: 'kebab-case' },
      ],
    },
  },
]);
