import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { DESIGN_SYSTEMS_TOKENS, designSystemIds, loadDesignSystems } from './lib/design-systems.ts';
import { cssImports, declaredTokens, requiredTokens, topLevelSelectors } from './lib/temas.ts';

/**
 * Estrutura dos temas: cada design system tem manifesto, forma e paleta
 * nativa, e está no `temas.css`; formas só mudam forma, paletas só mudam cor,
 * e todo token que um componente lê está definido. Um design system esquecido
 * em um desses lugares "não muda nada" na tela; aqui falha.
 */

const ROOT = resolve(import.meta.dirname, '..');
const TOKENS = resolve(ROOT, 'projects/ui/tokens');
const DS_TOKENS = resolve(ROOT, DESIGN_SYSTEMS_TOKENS);
const read = (path: string) => readFileSync(resolve(ROOT, path), 'utf8');

function cssFiles(dir: string, recursive = true): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive, encoding: 'utf8' })
    .filter((file) => file.endsWith('.css'))
    .map((file) => resolve(dir, file));
}

const designSystems = await loadDesignSystems(ROOT);
/** O Argila é o padrão: a forma e a paleta dele são os próprios tokens semânticos. */
const withFiles = designSystems.filter((ds) => ds.id !== 'argila');
const formFile = (id: string) => resolve(DS_TOKENS, id, 'forma.css');
const nativeFile = (id: string) => resolve(DS_TOKENS, id, 'paletas/nativa.css');
/** Paletas compartilhadas: os arquivos soltos em tokens/palettes/. */
const sharedPalettes = cssFiles(resolve(TOKENS, 'palettes'), false);

describe('manifestos', () => {
  it('cada pasta de design-systems/ tem um manifesto com o id da pasta', () => {
    expect(designSystems.map((ds) => ds.id)).toEqual(designSystemIds(ROOT));
  });

  it('o CSS de cada design system tem manifesto, e todo manifesto (menos o Argila) tem CSS', () => {
    const folders = readdirSync(DS_TOKENS, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(folders).toEqual(withFiles.map((ds) => ds.id).sort());
  });

  it('toda paleta aceita existe: a nativa, a Terrosa (padrão) ou um arquivo de palettes/', () => {
    const shared = sharedPalettes.map((file) => relative(resolve(TOKENS, 'palettes'), file));
    const missing = designSystems.flatMap((ds) =>
      ds.paletas
        .filter((palette) => palette !== 'nativa' && palette !== 'terrosa')
        .filter((palette) => !shared.includes(`${palette}.css`))
        .map((palette) => `${ds.id}: ${palette}`),
    );

    expect(missing).toEqual([]);
  });
});

describe('temas.css', () => {
  it('importa a forma e a paleta nativa de cada design system e as paletas compartilhadas', () => {
    const imported = cssImports(read('projects/ui/tokens/temas.css')).map((path) =>
      resolve(TOKENS, path),
    );
    const expected = [
      ...withFiles.flatMap((ds) => [formFile(ds.id), nativeFile(ds.id)]),
      ...sharedPalettes,
    ];

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

describe('caminhos antigos (styles/ e palettes/nativas/)', () => {
  const shims = [
    ...cssFiles(resolve(TOKENS, 'styles')),
    ...cssFiles(resolve(TOKENS, 'palettes/nativas')),
  ];

  it.each(shims.map((file) => [relative(TOKENS, file), file]))(
    '%s só reencaminha para o arquivo novo, que existe',
    (_, file) => {
      const css = readFileSync(file, 'utf8');
      const imports = cssImports(css).map((path) => resolve(file, '..', path));

      expect(imports).toHaveLength(1);
      expect(existsSync(imports[0])).toBe(true);
      expect(relative(DS_TOKENS, imports[0]).startsWith('..')).toBe(false);
      expect([...declaredTokens(css)]).toEqual([]);
    },
  );
});

describe.each(withFiles.map((ds) => [ds.id]))('design system %s', (id) => {
  const form = readFileSync(formFile(id), 'utf8');

  it('a forma vale pelo data-arg-style com o id', () => {
    expect(topLevelSelectors(form)).toContain(`:root[data-arg-style='${id}']`);
  });

  it('a forma só muda forma: nenhuma cor da paleta', () => {
    const colors = [...declaredTokens(form)].filter((token) => token.startsWith('--arg-color-'));
    expect(colors).toEqual([]);
  });

  it('a paleta nativa vale sem data-arg-palette ou com "nativa"', () => {
    const selectors = topLevelSelectors(readFileSync(nativeFile(id), 'utf8'));
    expect(selectors).toContain(`:root[data-arg-style='${id}']:not([data-arg-palette])`);
    expect(selectors).toContain(`:root[data-arg-style='${id}'][data-arg-palette='nativa']`);
  });
});

describe.each(
  [...sharedPalettes, ...withFiles.map((ds) => nativeFile(ds.id))].map((file) => [
    relative(TOKENS, file),
    file,
  ]),
)('paleta %s', (_, file) => {
  it('só muda cor: nenhum token de forma', () => {
    const css = readFileSync(file, 'utf8');
    const shape = [...declaredTokens(css)].filter((token) => !token.startsWith('--arg-color-'));
    expect(shape).toEqual([]);
  });
});

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
