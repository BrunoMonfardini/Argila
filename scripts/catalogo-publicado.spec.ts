import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

/**
 * Publicação do catálogo na Vercel (PR-20). O catálogo é uma SPA com rotas
 * por caminho: recarregar /componentes/agenda precisa abrir o index.html.
 */
describe('catálogo publicado', () => {
  it('toda rota que não é arquivo abre o index.html', () => {
    const config = JSON.parse(read('projects/docs/public/vercel.json'));
    expect(config.rewrites).toEqual([{ source: '/(.*)', destination: '/index.html' }]);
  });

  it('o vercel.json vai para dist/docs/browser junto com o catálogo', () => {
    const angular = JSON.parse(read('angular.json'));
    expect(angular.projects.docs.architect.build.options.assets).toContainEqual({
      glob: '**/*',
      input: 'projects/docs/public',
    });
  });

  it('a publicação usa a CLI da Vercel numa versão exata e sobe só o catálogo gerado', () => {
    const workflow = read('.github/workflows/catalogo.yml');
    expect(workflow).toMatch(/pnpm dlx vercel@\d+\.\d+\.\d+ deploy dist\/docs\/browser --prod/);
    expect(workflow).toContain('pnpm build:docs');
    expect(workflow).toMatch(/branches: \[main\]/);
  });

  it('sem os secrets, o job de publicação não roda', () => {
    const workflow = read('.github/workflows/catalogo.yml');
    expect(workflow).toContain("if: needs.configured.outputs.ok == 'true'");
    for (const secret of ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID']) {
      expect(workflow).toContain(`[ -n "$${secret}" ]`);
    }
  });
});
