import { readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  arrayItems,
  cssImports,
  declaredTokens,
  objectKeys,
  requiredTokens,
  topLevelSelectors,
} from './lib/temas.ts';

/**
 * Estrutura dos temas: cada estilo e paleta existe nos três lugares que o
 * produto usa (arquivo, `temas.css` e `ArgTheme`), estilos só mudam forma,
 * paletas só mudam cor, e todo token que um componente lê está definido.
 * Um estilo esquecido em um desses lugares "não muda nada" na tela; aqui falha.
 */

const ROOT = resolve(import.meta.dirname, '..');
const TOKENS = resolve(ROOT, 'projects/ui/tokens');
const read = (path: string) => readFileSync(resolve(ROOT, path), 'utf8');

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.css'))
    .map((file) => resolve(dir, file));
}

const name = (file: string) => file.replace(/\\/g, '/').split('/').pop()!.slice(0, -'.css'.length);
const styleFiles = cssFiles(resolve(TOKENS, 'styles'));
const nativeFiles = cssFiles(resolve(TOKENS, 'palettes/nativas'));
const paletteFiles = cssFiles(resolve(TOKENS, 'palettes')).filter(
  (file) => !nativeFiles.includes(file),
);
const theme = read('projects/ui/src/lib/theme/theme.ts');

describe('temas.css', () => {
  it('importa cada estilo e cada paleta, e nada que não exista', () => {
    const imported = cssImports(read('projects/ui/tokens/temas.css')).map((path) =>
      resolve(TOKENS, path),
    );
    const expected = [...styleFiles, ...paletteFiles, ...nativeFiles];

    expect([...imported].sort()).toEqual([...expected].sort());
  });

  it('é carregado pelo catálogo, depois dos tokens base', () => {
    const angular = JSON.parse(read('angular.json'));
    const styles: string[] = angular.projects.docs.architect.build.options.styles;

    expect(styles.indexOf('projects/ui/tokens/temas.css')).toBeGreaterThan(
      styles.indexOf('projects/ui/tokens/argila.css'),
    );
  });
});

describe('ArgTheme', () => {
  it('ARG_STYLES lista o Argila e cada arquivo de styles/', () => {
    expect(objectKeys(theme, 'ARG_STYLES').sort()).toEqual(
      ['argila', ...styleFiles.map(name)].sort(),
    );
  });

  it('ARG_PALETTES lista nativa, terrosa e cada arquivo de palettes/', () => {
    expect(arrayItems(theme, 'ARG_PALETTES').sort()).toEqual(
      ['nativa', 'terrosa', ...paletteFiles.map(name)].sort(),
    );
  });

  it('os tipos ArgStyle e ArgPalette batem com as listas', () => {
    const union = (type: string) =>
      [...new RegExp(`export type ${type} =([^;]+);`).exec(theme)![1].matchAll(/'([^']+)'/g)]
        .map((match) => match[1])
        .sort();

    expect(union('ArgStyle')).toEqual(objectKeys(theme, 'ARG_STYLES').sort());
    expect(union('ArgPalette')).toEqual(arrayItems(theme, 'ARG_PALETTES').sort());
  });
});

describe.each(styleFiles.map((file) => [relative(TOKENS, file), file]))('estilo %s', (_, file) => {
  const css = readFileSync(file, 'utf8');
  const style = name(file);

  it('vale pelo data-arg-style com o nome do arquivo', () => {
    expect(topLevelSelectors(css)).toContain(`:root[data-arg-style='${style}']`);
  });

  it('só muda forma: nenhuma cor da paleta', () => {
    const colors = [...declaredTokens(css)].filter((token) => token.startsWith('--arg-color-'));
    expect(colors).toEqual([]);
  });

  it('tem paleta nativa, que vale sem data-arg-palette ou com "nativa"', () => {
    const native = nativeFiles.find((candidate) => name(candidate) === style);
    expect(native, `falta palettes/nativas/${style}.css`).toBeDefined();

    const selectors = topLevelSelectors(readFileSync(native!, 'utf8'));
    expect(selectors).toContain(`:root[data-arg-style='${style}']:not([data-arg-palette])`);
    expect(selectors).toContain(`:root[data-arg-style='${style}'][data-arg-palette='nativa']`);
  });
});

describe.each([...paletteFiles, ...nativeFiles].map((file) => [relative(TOKENS, file), file]))(
  'paleta %s',
  (_, file) => {
    it('só muda cor: nenhum token de forma', () => {
      const css = readFileSync(file, 'utf8');
      const shape = [...declaredTokens(css)].filter((token) => !token.startsWith('--arg-color-'));
      expect(shape).toEqual([]);
    });
  },
);

describe('tokens dos componentes', () => {
  it('todo token lido sem valor reserva está definido em algum lugar', () => {
    const files = [
      ...cssFiles(TOKENS),
      ...cssFiles(resolve(ROOT, 'projects/ui/src')),
      ...cssFiles(resolve(ROOT, 'projects/docs/src')),
    ];
    const declared = new Set<string>();
    const required = new Map<string, string>();
    for (const file of files) {
      const css = readFileSync(file, 'utf8');
      declaredTokens(css).forEach((token) => declared.add(token));
      requiredTokens(css).forEach((token) => required.set(token, relative(ROOT, file)));
    }

    // Tokens que o template escreve no elemento: [style.--arg-agenda-days]="…"
    const templates = readdirSync(resolve(ROOT, 'projects/ui/src'), {
      recursive: true,
      encoding: 'utf8',
    })
      .filter((file) => file.endsWith('.html'))
      .map((file) => readFileSync(resolve(ROOT, 'projects/ui/src', file), 'utf8'));
    for (const html of templates) {
      for (const [, token] of html.matchAll(/\[style\.(--[\w-]+)\]/g)) declared.add(token);
    }

    const missing = [...required]
      .filter(([token]) => !declared.has(token))
      .map(([token, file]) => `${token} (${file})`);

    expect(missing).toEqual([]);
  });
});
