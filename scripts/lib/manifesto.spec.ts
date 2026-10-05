import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ManifestError,
  buildManifest,
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
