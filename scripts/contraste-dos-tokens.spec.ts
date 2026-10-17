import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  checkContrast,
  contrastFailures,
  parseTokenBlocks,
  tokensForRoot,
  type ColorScheme,
  type ContrastPair,
  type RootAttributes,
  type TokenBlocks,
} from './lib/contraste.ts';

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
  // Links sobre a superfície elevada: diálogos, popovers, menus, "pular para o conteúdo"
  { foreground: '--arg-color-text-link', background: '--arg-color-surface-raised', minimum: TEXT },
  // Link no hover (arg-link)
  { foreground: '--arg-color-primary-hover', background: '--arg-color-background', minimum: TEXT },
  { foreground: '--arg-color-primary-hover', background: '--arg-color-surface', minimum: TEXT },
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
  // Secundária e destaque: texto por cima em todos os estados, e a cor como texto
  ...['secondary', 'accent'].flatMap((role) => [
    ...['', '-hover', '-pressed'].map((state) => ({
      foreground: `--arg-color-on-${role}`,
      background: `--arg-color-${role}${state}`,
      minimum: TEXT,
    })),
    { foreground: `--arg-color-${role}`, background: '--arg-color-surface', minimum: TEXT },
    { foreground: `--arg-color-${role}`, background: `--arg-color-${role}-subtle`, minimum: TEXT },
  ]),
  // Botão de perigo em todos os estados
  { foreground: '--arg-color-on-danger', background: '--arg-color-danger', minimum: TEXT },
  { foreground: '--arg-color-on-danger', background: '--arg-color-danger-hover', minimum: TEXT },
  { foreground: '--arg-color-on-danger', background: '--arg-color-danger-pressed', minimum: TEXT },
  // Feedback: texto sobre a cor cheia e cor sobre o fundo suave (alertas)
  ...['info', 'success', 'warning', 'danger'].flatMap((tone) => [
    { foreground: `--arg-color-on-${tone}`, background: `--arg-color-${tone}`, minimum: TEXT },
    { foreground: `--arg-color-${tone}`, background: `--arg-color-${tone}-subtle`, minimum: TEXT },
    { foreground: `--arg-color-${tone}`, background: '--arg-color-surface', minimum: TEXT },
    // Corpo do Alert: texto comum sobre o fundo suave do tom
    { foreground: '--arg-color-text', background: `--arg-color-${tone}-subtle`, minimum: TEXT },
  ]),
  // Badge e Tag neutros: texto sobre o fundo rebaixado
  { foreground: '--arg-color-text', background: '--arg-color-surface-sunken', minimum: TEXT },
  // Switch: trilho desligado e ligado contra a superfície, e o botão contra o trilho
  { foreground: '--arg-color-text-muted', background: '--arg-color-surface', minimum: NON_TEXT },
  { foreground: '--arg-color-primary', background: '--arg-color-surface', minimum: NON_TEXT },
  {
    foreground: '--arg-color-surface-solid',
    background: '--arg-color-text-muted',
    minimum: NON_TEXT,
  },
  { foreground: '--arg-color-surface-solid', background: '--arg-color-primary', minimum: NON_TEXT },
  // Tooltip: balão invertido, texto da superfície (sempre opaca) sobre a cor do texto
  { foreground: '--arg-color-surface-solid', background: '--arg-color-text', minimum: TEXT },
  // Progress Bar: o preenchimento contra o trilho mostra quanto falta
  {
    foreground: '--arg-color-primary',
    background: '--arg-color-surface-sunken',
    minimum: NON_TEXT,
  },
  // File Upload: textos da área de soltar com o fundo de "arrastando"
  ...['--arg-color-text', '--arg-color-text-muted', '--arg-color-text-link'].map((foreground) => ({
    foreground,
    background: '--arg-color-primary-subtle',
    minimum: TEXT,
  })),
  // Table: título das colunas sobre o cabeçalho rebaixado
  { foreground: '--arg-color-text-muted', background: '--arg-color-surface-sunken', minimum: TEXT },
  // Anel de foco (indicador, não texto)
  { foreground: '--arg-color-focus', background: '--arg-color-background', minimum: NON_TEXT },
  { foreground: '--arg-color-focus', background: '--arg-color-surface', minimum: NON_TEXT },
];

const SCHEMES: ColorScheme[] = ['light', 'dark'];

interface ThemeFile {
  name: string;
  blocks: TokenBlocks;
}

/** Cada `.css` de uma pasta de tokens: arquivo novo entra no teste sozinho. */
function themeFiles(dir: string): ThemeFile[] {
  if (!existsSync(resolve(TOKENS, dir))) return [];
  return readdirSync(resolve(TOKENS, dir))
    .filter((file) => file.endsWith('.css'))
    .map((file) => ({
      name: file.slice(0, -'.css'.length),
      blocks: parseTokenBlocks(css(`${dir}/${file}`)),
    }));
}

const styles = themeFiles('styles');
const palettes = themeFiles('palettes');
const files = [
  parseTokenBlocks(css('primitives.css')),
  parseTokenBlocks(css('semantic.css')),
  ...[...styles, ...palettes, ...themeFiles('palettes/nativas')].map((file) => file.blocks),
];

/** Argila é o estilo padrão e a Terrosa a paleta padrão: nenhum dos dois tem arquivo. */
const STYLE_NAMES = ['argila', ...styles.map((file) => file.name)];
/** `undefined`: sem `data-arg-palette`, vale a paleta nativa do estilo. */
const PALETTE_NAMES = [undefined, 'terrosa', ...palettes.map((file) => file.name)];
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
for (const style of STYLE_NAMES) {
  for (const palette of PALETTE_NAMES) {
    COMBINATIONS[`estilo ${style}, paleta ${palette ?? 'nativa'}`] = {
      'data-arg-style': style,
      ...(palette ? { 'data-arg-palette': palette } : {}),
    };
  }
}
for (const brand of BRAND_NAMES) {
  COMBINATIONS[`data-arg-brand="${brand}"`] = { 'data-arg-brand': brand };
}

const DEFAULT = 'estilo argila, paleta nativa';

/** Transparência mínima das superfícies: o pior caso para o texto sobre elas. */
const MIN_OPACITY = '0.4';

describe('contraste dos tokens', () => {
  for (const [combination, attributes] of Object.entries(COMBINATIONS)) {
    const tokens = tokensForRoot(files, attributes);
    const translucent = new Map(tokens).set('--arg-surface-opacity', MIN_OPACITY);
    for (const scheme of SCHEMES) {
      const mode = scheme === 'light' ? 'claro' : 'escuro';
      it(`${combination}, tema ${mode}: todos os pares no mínimo`, () => {
        expect(contrastFailures(checkContrast(tokens, PAIRS, scheme))).toEqual([]);
      });
      it(`${combination}, tema ${mode}, superfícies a ${MIN_OPACITY}: todos os pares no mínimo`, () => {
        expect(contrastFailures(checkContrast(translucent, PAIRS, scheme))).toEqual([]);
      });
    }
  }

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
