// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const jest = require('eslint-plugin-jest');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'arg',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          // Atributo permite componentes sobre elementos nativos: button[arg-button]
          type: ['element', 'attribute'],
          prefix: 'arg',
          style: 'kebab-case',
        },
      ],
    },
  },
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
  {
    files: ['**/*.spec.ts'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      // it.only esquecido roda só um teste no CI e esconde o resto
      'jest/no-focused-tests': 'error',
      'jest/no-disabled-tests': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // O arg-icon-button recebe o nome pelo label (vira aria-label): é vazio só no template
      '@angular-eslint/template/elements-content': ['error', { allowList: ['arg-icon-button'] }],
    },
  },
]);
