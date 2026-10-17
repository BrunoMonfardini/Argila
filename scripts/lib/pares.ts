/**
 * Pares de cor que aparecem juntos nos componentes, com o contraste mínimo de
 * cada um. Usados pelo teste de contraste dos tokens e pelo gerador das cores
 * de marca permitidas (uma cor só é permitida se todos os pares passam).
 */
import type { ContrastPair } from './contraste.ts';

export const TEXT = 4.5;
export const NON_TEXT = 3;

/** Pares de cor que aparecem juntos nos componentes. */
export const PAIRS: ContrastPair[] = [
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
  // Preenchimento suave da marca (botões, chips e alertas "de massinha")
  {
    foreground: '--arg-color-on-primary-soft',
    background: '--arg-color-primary-soft',
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

/** Alto contraste: texto de leitura em AAA (7:1), não só AA. */
export const AAA = 7;
export const READING_PAIRS: ContrastPair[] = [
  ...['background', 'surface', 'surface-raised', 'surface-sunken'].flatMap((bg) =>
    ['--arg-color-text', '--arg-color-text-muted', '--arg-color-text-link'].map((foreground) => ({
      foreground,
      background: `--arg-color-${bg}`,
      minimum: AAA,
    })),
  ),
];

/** Os pares de uma paleta: a Alto contraste exige também o AAA no texto de leitura. */
export function pairsFor(palette: string): ContrastPair[] {
  return palette === 'alto-contraste' ? [...PAIRS, ...READING_PAIRS] : PAIRS;
}
