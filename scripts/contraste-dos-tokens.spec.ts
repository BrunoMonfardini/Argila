import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  checkContrast,
  contrastFailures,
  parseTokenBlocks,
  resolveColor,
  tokensForRoot,
  type ColorScheme,
  type RootAttributes,
  type TokenBlocks,
} from './lib/contraste.ts';
import { loadDesignSystems, rootAttributes } from './lib/design-systems.ts';
import { PAIRS, READING_PAIRS, pairsFor } from './lib/pares.ts';
import { ARG_ALLOWED_COLORS } from '../projects/ui/src/lib/design-systems/colors.generated.ts';

/**
 * Contraste dos tokens semânticos do Argila, em claro e escuro, em toda
 * combinação de estilo (`tokens/styles/`) e paleta (`tokens/palettes/`), e
 * nos temas antigos por `data-arg-brand`. Uma combinação que quebre o
 * contraste falha aqui, antes de chegar ao produto.
 */

const TOKENS = resolve(import.meta.dirname, '../projects/ui/tokens');

function css(file: string): string {
  return readFileSync(resolve(TOKENS, file), 'utf8');
}

const SCHEMES: ColorScheme[] = ['light', 'dark'];

/** Cada `.css` de uma pasta de tokens, inclusive subpastas: arquivo novo entra no teste sozinho. */
function tokenFiles(dir: string, recursive: boolean): TokenBlocks[] {
  if (!existsSync(resolve(TOKENS, dir))) return [];
  return readdirSync(resolve(TOKENS, dir), { recursive, encoding: 'utf8' })
    .filter((file) => file.endsWith('.css'))
    .map((file) => parseTokenBlocks(css(`${dir}/${file}`)));
}

const files = [
  parseTokenBlocks(css('primitives.css')),
  parseTokenBlocks(css('semantic.css')),
  ...tokenFiles('design-systems', true),
  ...tokenFiles('palettes', false),
];

/** Só as combinações que o manifesto de cada design system aceita. */
const designSystems = await loadDesignSystems(resolve(import.meta.dirname, '..'));
/** Temas antigos, ainda aceitos: cada `data-arg-brand` citado nos arquivos. */
const BRAND_NAMES = [
  ...new Set(
    files.flatMap((blocks) =>
      [...blocks.keys()].flatMap((selector) =>
        [...selector.matchAll(/data-arg-brand='([\w-]+)'/g)].map((match) => match[1]),
      ),
    ),
  ),
];

const COMBINATIONS: Record<string, RootAttributes> = {};
/** Modos de cada combinação: os que o design system declara (os temas antigos, os dois). */
const MODES: Record<string, readonly ColorScheme[]> = {};
for (const ds of designSystems) {
  for (const palette of ds.paletas) {
    COMBINATIONS[`estilo ${ds.id}, paleta ${palette}`] = rootAttributes(ds.id, palette);
    MODES[`estilo ${ds.id}, paleta ${palette}`] = ds.modos;
  }
}
for (const brand of BRAND_NAMES) {
  COMBINATIONS[`data-arg-brand="${brand}"`] = { 'data-arg-brand': brand };
  MODES[`data-arg-brand="${brand}"`] = SCHEMES;
}

const DEFAULT = 'estilo argila, paleta nativa';

/** Transparência mínima das superfícies: o pior caso para o texto sobre elas. */
const MIN_OPACITY = '0.4';

describe('cores de marca permitidas', () => {
  const withColors = [...files, parseTokenBlocks(css('colors.css'))];
  const cases = Object.entries(ARG_ALLOWED_COLORS).flatMap(([style, palettes]) =>
    Object.entries(palettes).flatMap(([palette, roles]) =>
      Object.entries(roles).flatMap(([role, colors]) =>
        colors.map((color) => ({ style, palette, role, color })),
      ),
    ),
  );

  it('a matriz cobre cada design system e paleta aceita', () => {
    const expected = designSystems.flatMap((ds) => ds.paletas.map((p) => `${ds.id}/${p}`));
    const covered = Object.entries(ARG_ALLOWED_COLORS).flatMap(([style, palettes]) =>
      Object.keys(palettes).map((palette) => `${style}/${palette}`),
    );

    expect(covered.sort()).toEqual(expected.sort());
  });

  it('toda cor permitida passa em todos os pares, em cada modo e na opacidade mínima', () => {
    const failures = cases.flatMap(({ style, palette, role, color }) => {
      const ds = designSystems.find((candidate) => candidate.id === style)!;
      const tokens = tokensForRoot(withColors, {
        ...rootAttributes(style, palette),
        [`data-arg-${role}`]: color,
      });
      const translucent = new Map(tokens).set('--arg-surface-opacity', MIN_OPACITY);
      return ds.modos.flatMap((scheme) =>
        [tokens, translucent].flatMap((set) =>
          contrastFailures(checkContrast(set, pairsFor(palette), scheme)).map(
            (failure) => `${style}/${palette} ${role}=${color}: ${failure}`,
          ),
        ),
      );
    });

    expect(cases.length).toBeGreaterThan(0);
    expect(failures).toEqual([]);
  });
});

describe('contraste AAA na paleta Alto contraste', () => {
  const highContrast = Object.entries(COMBINATIONS).filter(
    ([, attributes]) => attributes['data-arg-palette'] === 'alto-contraste',
  );

  it('alguma combinação usa a paleta', () => {
    expect(highContrast.length).toBeGreaterThan(0);
  });

  for (const [combination, attributes] of highContrast) {
    const tokens = tokensForRoot(files, attributes);
    for (const scheme of MODES[combination]) {
      it(`${combination}, tema ${scheme === 'light' ? 'claro' : 'escuro'}: texto em 7:1`, () => {
        expect(contrastFailures(checkContrast(tokens, READING_PAIRS, scheme))).toEqual([]);
      });
    }
  }
});

describe('contraste dos tokens', () => {
  for (const [combination, attributes] of Object.entries(COMBINATIONS)) {
    const tokens = tokensForRoot(files, attributes);
    const translucent = new Map(tokens).set('--arg-surface-opacity', MIN_OPACITY);
    for (const scheme of MODES[combination]) {
      const mode = scheme === 'light' ? 'claro' : 'escuro';
      it(`${combination}, tema ${mode}: todos os pares no mínimo`, () => {
        expect(contrastFailures(checkContrast(tokens, PAIRS, scheme))).toEqual([]);
      });
      it(`${combination}, tema ${mode}, superfícies a ${MIN_OPACITY}: todos os pares no mínimo`, () => {
        expect(contrastFailures(checkContrast(translucent, PAIRS, scheme))).toEqual([]);
      });
    }
  }

  it('painéis sobre o conteúdo ficam no mínimo 80% opacos, mesmo com as superfícies a 0.4', () => {
    const tokens = tokensForRoot(files, { 'data-arg-style': 'transparente' });
    tokens.set('--arg-surface-opacity', MIN_OPACITY);

    const raised = resolveColor('var(--arg-color-surface-raised)', tokens, 'light');
    const surface = resolveColor('var(--arg-color-surface)', tokens, 'light');

    expect(raised.a).toBeCloseTo(0.8);
    expect(surface.a).toBeCloseTo(0.4);
  });

  it('falha quando o texto sobre a cor primária perde contraste', () => {
    const broken = tokensForRoot(files, COMBINATIONS[DEFAULT]);
    broken.set('--arg-color-on-primary', 'light-dark(var(--arg-core-clay-400), #000)');

    const failures = contrastFailures(checkContrast(broken, PAIRS, 'light'));

    expect(failures).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^light: --arg-color-on-primary sobre --arg-color-primary = /),
      ]),
    );
  });
});
