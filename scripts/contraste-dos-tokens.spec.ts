import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  contrastFailures,
  mergeTokens,
  parseTokenBlocks,
  type ColorScheme,
  type ContrastPair,
} from './lib/contraste.ts';

/**
 * Contraste dos tokens semânticos do Argila, em claro e escuro, com a marca
 * padrão e com cada tema de exemplo. Um tema de cliente que quebre o contraste
 * falha aqui, antes de chegar ao produto.
 */

const TOKENS = resolve(import.meta.dirname, '../projects/ui/tokens');

function css(file: string): string {
  return readFileSync(resolve(TOKENS, file), 'utf8');
}

const TEXT = 4.5;
const NON_TEXT = 3;

/** Pares de cor que aparecem juntos nos componentes. */
const PAIRS: ContrastPair[] = [
  // Texto sobre fundos
  ...['background', 'surface', 'surface-raised', 'surface-sunken'].flatMap((bg) => [
    { foreground: '--arg-color-text', background: `--arg-color-${bg}`, minimum: TEXT },
    { foreground: '--arg-color-text-muted', background: `--arg-color-${bg}`, minimum: TEXT },
  ]),
  { foreground: '--arg-color-text-link', background: '--arg-color-background', minimum: TEXT },
  { foreground: '--arg-color-text-link', background: '--arg-color-surface', minimum: TEXT },
  // Botão primário em todos os estados
  { foreground: '--arg-color-on-primary', background: '--arg-color-primary', minimum: TEXT },
  { foreground: '--arg-color-on-primary', background: '--arg-color-primary-hover', minimum: TEXT },
  {
    foreground: '--arg-color-on-primary',
    background: '--arg-color-primary-pressed',
    minimum: TEXT,
  },
  // Botões secundário e terciário: texto na cor da marca
  { foreground: '--arg-color-primary', background: '--arg-color-surface', minimum: TEXT },
  { foreground: '--arg-color-primary', background: '--arg-color-primary-subtle', minimum: TEXT },
  // Botão de perigo em todos os estados
  { foreground: '--arg-color-on-danger', background: '--arg-color-danger', minimum: TEXT },
  { foreground: '--arg-color-on-danger', background: '--arg-color-danger-hover', minimum: TEXT },
  { foreground: '--arg-color-on-danger', background: '--arg-color-danger-pressed', minimum: TEXT },
  // Feedback: texto sobre a cor cheia e cor sobre o fundo suave (alertas)
  ...['info', 'success', 'warning', 'danger'].flatMap((tone) => [
    { foreground: `--arg-color-on-${tone}`, background: `--arg-color-${tone}`, minimum: TEXT },
    { foreground: `--arg-color-${tone}`, background: `--arg-color-${tone}-subtle`, minimum: TEXT },
    { foreground: `--arg-color-${tone}`, background: '--arg-color-surface', minimum: TEXT },
  ]),
  // Anel de foco (indicador, não texto)
  { foreground: '--arg-color-focus', background: '--arg-color-background', minimum: NON_TEXT },
  { foreground: '--arg-color-focus', background: '--arg-color-surface', minimum: NON_TEXT },
];

const SCHEMES: ColorScheme[] = ['light', 'dark'];

const base = [parseTokenBlocks(css('primitives.css')), parseTokenBlocks(css('semantic.css'))];

/** A marca padrão e cada tema de `tokens/themes/`: tema novo entra no teste sozinho. */
const BRANDS: Record<string, Map<string, string>> = {
  'Argila (padrão)': mergeTokens(base, [':root']),
};
for (const file of readdirSync(resolve(TOKENS, 'themes')).filter((f) => f.endsWith('.css'))) {
  const theme = parseTokenBlocks(css(`themes/${file}`));
  for (const selector of theme.keys()) {
    BRANDS[`${selector} (themes/${file})`] = mergeTokens([...base, theme], [':root', selector]);
  }
}

describe('contraste dos tokens', () => {
  for (const [brand, tokens] of Object.entries(BRANDS)) {
    for (const scheme of SCHEMES) {
      it(`${brand}, tema ${scheme === 'light' ? 'claro' : 'escuro'}: todos os pares no mínimo`, () => {
        const failures = contrastFailures(checkContrast(tokens, PAIRS, scheme));

        expect(failures).toEqual([]);
      });
    }
  }

  it('falha quando o texto sobre a cor primária perde contraste', () => {
    const broken = new Map(BRANDS['Argila (padrão)']);
    broken.set('--arg-color-on-primary', 'light-dark(var(--arg-core-clay-400), #000)');

    const failures = contrastFailures(checkContrast(broken, PAIRS, 'light'));

    expect(failures).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^light: --arg-color-on-primary sobre --arg-color-primary = /),
      ]),
    );
  });
});
