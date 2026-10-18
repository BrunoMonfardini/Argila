/**
 * Regras de dependência entre as camadas do Argila (seção 5 da especificação
 * dos design systems). Rode com `pnpm arch:check`; o CI falha em qualquer erro.
 *
 *   tokens → design systems → núcleo (componentes) → tema → catálogo
 */
const LIB = '^projects/ui/src/lib/';
const DESIGN_SYSTEMS = `${LIB}design-systems/`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'nucleo-nao-conhece-design-systems',
      comment:
        'Os componentes do núcleo só leem tokens semânticos. Quem conhece os design systems é o ArgTheme.',
      severity: 'error',
      from: { path: LIB, pathNot: `${LIB}(design-systems|theme)/` },
      to: { path: DESIGN_SYSTEMS },
    },
    {
      name: 'design-system-nao-importa-outro',
      comment: 'Um design system nunca importa outro. O que dois precisam sobe para o núcleo.',
      severity: 'error',
      from: { path: `${DESIGN_SYSTEMS}([^/]+)/` },
      to: { path: `${DESIGN_SYSTEMS}[^/]+/`, pathNot: `${DESIGN_SYSTEMS}$1/` },
    },
    {
      name: 'design-system-nao-importa-o-tema',
      comment: 'O tema lê os design systems, nunca o contrário.',
      severity: 'error',
      from: { path: DESIGN_SYSTEMS },
      to: { path: `${LIB}theme/` },
    },
    {
      name: 'catalogo-nao-importa-o-interior-dos-componentes',
      comment:
        'O catálogo usa a API pública, as páginas (*.docs.ts), os exemplos e os utilitários de teste.',
      severity: 'error',
      from: { path: '^projects/docs/' },
      to: {
        path: '^projects/ui/src/',
        pathNot: [
          '^projects/ui/src/public-api\\.ts$',
          '\\.docs\\.ts$',
          '/examples/',
          '^projects/ui/src/(docs|patterns|templates|testing)/',
        ],
      },
    },
    {
      name: 'biblioteca-nao-importa-o-catalogo',
      severity: 'error',
      from: { path: '^projects/ui/' },
      to: { path: '^projects/docs/' },
    },
    {
      name: 'ninguem-importa-spec',
      severity: 'error',
      from: { pathNot: '\\.spec\\.ts$' },
      to: { path: '\\.spec\\.ts$' },
    },
    {
      name: 'sem-ciclos',
      comment: 'Ciclos só de tipos (import type) somem na compilação e são aceitos.',
      severity: 'error',
      from: {},
      to: { circular: true, viaOnly: { dependencyTypesNot: ['type-only'] } },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)(node_modules|dist|coverage|out-tsc|\\.angular)/' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { extensions: ['.ts', '.js', '.mjs', '.json'] },
  },
};
