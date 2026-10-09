import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ManifestError,
  buildManifest,
  checkCatalog,
  registeredPages,
  componentCssTokens,
  parseSemanticTokens,
} from './manifesto.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const FIXTURES = resolve(import.meta.dirname, '__fixtures__/manifesto');

function build(...files: string[]) {
  return buildManifest({
    root: ROOT,
    docsFiles: files.map((file) => resolve(FIXTURES, file)),
    semanticCss: '',
  });
}

describe('buildManifest', () => {
  const manifest = build('sample.docs.ts');
  const sample = manifest.pages['Componentes/sample'];
  const input = (name: string) => sample.component!.inputs.find((i) => i.name === name);

  it('cria uma página por DocPage exportado, pela categoria e pelo slug', () => {
    expect(Object.keys(manifest.pages).sort()).toEqual([
      'Componentes/no-style',
      'Componentes/sample',
      'Padrões/padrao',
    ]);
    expect(sample.file).toBe('scripts/lib/__fixtures__/manifesto/sample.docs.ts');
  });

  it('lê classe, seletor e arquivo do componente', () => {
    expect(sample.component).toMatchObject({
      className: 'ArgSample',
      selector: 'arg-sample',
      file: 'scripts/lib/__fixtures__/manifesto/sample.ts',
    });
  });

  it('lê só as inputs, na ordem da classe', () => {
    expect(sample.component!.inputs.map((i) => i.name)).toEqual([
      'tone',
      'compact',
      'label',
      'count',
      'name',
      'size',
      'items',
    ]);
  });

  it('transforma união de strings em opções, com padrão e descrição', () => {
    expect(input('tone')).toEqual({
      name: 'tone',
      type: "'calm' | 'loud'",
      control: 'options',
      options: ['calm', 'loud'],
      defaultValue: "'calm'",
      required: false,
      description: 'Tom da amostra.',
    });
  });

  it('reconhece boolean (com transform), string e number', () => {
    expect(input('compact')).toMatchObject({
      type: 'boolean',
      control: 'boolean',
      defaultValue: 'false',
    });
    expect(input('label')).toMatchObject({ type: 'string', control: 'string', description: '' });
    expect(input('count')).toMatchObject({ type: 'number', control: 'number', defaultValue: '3' });
  });

  it('marca input.required sem valor padrão', () => {
    expect(input('name')).toMatchObject({
      required: true,
      defaultValue: undefined,
      options: ['a', 'b'],
    });
  });

  it('mostra undefined em inputs opcionais e usa "other" para tipos sem controle', () => {
    expect(input('size')).toMatchObject({ type: "'sm' | 'lg' | undefined", control: 'options' });
    expect(input('items')).toMatchObject({ type: 'string[]', control: 'other' });
  });

  it('lê os tokens do componente do CSS, ignorando comentários e outros componentes', () => {
    expect(sample.component!.cssTokens).toEqual([
      { name: '--arg-sample-bg', value: 'var(--arg-color-surface)' },
      { name: '--arg-sample-gap', value: 'var(--arg-space-2)' },
    ]);
    expect(manifest.pages['Componentes/no-style'].component!.cssTokens).toEqual([]);
  });

  it('guarda o código-fonte de cada exemplo pelo nome', () => {
    const code = readFileSync(resolve(FIXTURES, 'examples/sample-basic.example.ts'), 'utf8');

    expect(sample.examples).toEqual({ Básico: code });
    expect(manifest.pages['Padrões/padrao']).toMatchObject({
      component: undefined,
      examples: { Uso: code },
    });
  });

  it('explica o erro quando o DocPage não pode ser lido', () => {
    expect(() => build('bad-slug.docs.ts')).toThrow('slug precisa ser um texto literal');
    expect(() => build('bad-examples.docs.ts')).toThrow('examples precisa ser uma lista');
    expect(() => build('bad-example-item.docs.ts')).toThrow('cada exemplo precisa ser um objeto');
    expect(() => build('bad-example-component.docs.ts')).toThrow(
      'o exemplo "Sem componente" não tem component',
    );
    expect(() => build('bad-component.docs.ts')).toThrow(ManifestError);
    expect(() => build('nao-existe.docs.ts')).toThrow('arquivo não encontrado');
  });
});

describe('componentCssTokens', () => {
  it('não repete token redefinido em outro seletor', () => {
    const css = ':host { --arg-x-a: 1; } :host(.b) { --arg-x-a: 2; --arg-xy-c: 3; }';

    expect(componentCssTokens(css, 'x')).toEqual([{ name: '--arg-x-a', value: '1' }]);
  });
});

describe('parseSemanticTokens', () => {
  it('agrupa pelo comentário de uma linha e ignora redefinições e comentários longos', () => {
    const css = `/*
 * Cabeçalho com --arg-falso: 1;
 */
:root {
  /* Marca: cor principal */
  --arg-color-primary: light-dark(
    #a24c24,
    #d27a4c
  );
  /* Espaçamento */
  --arg-space-1: 0.25rem;
}
@media (prefers-reduced-motion: reduce) {
  :root { --arg-space-1: 0; }
}`;

    expect(parseSemanticTokens(css)).toEqual([
      { name: '--arg-color-primary', value: 'light-dark(#a24c24, #d27a4c)', group: 'Marca' },
      { name: '--arg-space-1', value: '0.25rem', group: 'Espaçamento' },
    ]);
  });

  it('lê os tokens reais do Argila', () => {
    const css = readFileSync(resolve(ROOT, 'projects/ui/tokens/semantic.css'), 'utf8');

    const tokens = parseSemanticTokens(css);

    expect(tokens.find((t) => t.name === '--arg-color-primary')?.group).toBe('Marca');
    expect(tokens.find((t) => t.name === '--arg-motion-fast')?.value).toBe(
      'var(--arg-core-duration-100)',
    );
  });
});

describe('checkCatalog', () => {
  function check(docsFiles: string[]) {
    return checkCatalog({
      root: ROOT,
      publicApi: resolve(FIXTURES, 'public-api.ts'),
      docsFiles: docsFiles.map((file) => resolve(FIXTURES, file)),
      registryFile: resolve(FIXTURES, 'registry.ts'),
    });
  }

  it('lista página fora do registro, componente sem página e input sem JSDoc', () => {
    const dir = 'scripts/lib/__fixtures__/manifesto';

    expect(check(['sample.docs.ts'])).toEqual([
      `PATTERN_DOCS (${dir}/sample.docs.ts) não está no registro: inclua em ${dir}/registry.ts`,
      `ArgSample.label (${dir}/sample.ts) sem JSDoc: descreva a input num comentário /** … */`,
      `ArgSample.items (${dir}/sample.ts) sem JSDoc: descreva a input num comentário /** … */`,
      `ArgOrphan (${dir}/orphan.ts) não tem página no catálogo: crie o *.docs.ts ao lado e inclua em ${dir}/registry.ts`,
      `ArgOrphan.size (${dir}/orphan.ts) sem JSDoc: descreva a input num comentário /** … */`,
    ]);
  });

  it('aceita componente auxiliar no mesmo arquivo de um componente documentado', () => {
    const problems = check(['sample.docs.ts']);

    expect(problems.some((p) => p.includes('ArgSampleItem'))).toBe(false);
    expect(problems.some((p) => p.includes('ArgNoStyle'))).toBe(false);
  });

  it('acusa arquivo que não existe', () => {
    expect(() => check(['nao-existe.docs.ts'])).toThrow('arquivo não encontrado');
    expect(() =>
      checkCatalog({
        root: ROOT,
        publicApi: resolve(FIXTURES, 'nao-existe.ts'),
        docsFiles: [],
        registryFile: resolve(FIXTURES, 'registry.ts'),
      }),
    ).toThrow('arquivo não encontrado');
  });
});

describe('registeredPages', () => {
  it('lê os nomes do array ALL_DOC_PAGES, mesmo tipado e em várias linhas', () => {
    const source = `
      import { A_DOCS } from './a';
      export const ALL_DOC_PAGES: readonly DocPage[] = [
        A_DOCS,
        B_DOCS,
      ];
      const OUTRA = [C_DOCS];
    `;

    expect([...registeredPages(source)]).toEqual(['A_DOCS', 'B_DOCS']);
    expect(registeredPages('sem registro').size).toBe(0);
  });
});
