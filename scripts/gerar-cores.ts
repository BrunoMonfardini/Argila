/**
 * Gera o CSS das cores de marca e a lista do que cada design system × paleta
 * aceita, a partir de ARG_BRAND_COLORS.
 *
 *   node scripts/gerar-cores.ts           grava tokens/colors.css e colors.generated.ts
 *   node scripts/gerar-cores.ts --check   só confere (usado no CI)
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ARG_BRAND_COLORS, ARG_BRAND_ROLES } from '../projects/ui/src/lib/design-systems/colors.ts';
import { parseTokenBlocks } from './lib/contraste.ts';
import { allowedColors, allowedColorsModule, colorsCss } from './lib/cores.ts';
import { loadDesignSystems } from './lib/design-systems.ts';
import { pairsFor } from './lib/pares.ts';

const ROOT = resolve(import.meta.dirname, '..');
const TOKENS = resolve(ROOT, 'projects/ui/tokens');
const CSS_FILE = resolve(TOKENS, 'colors.css');
const MODULE_FILE = resolve(ROOT, 'projects/ui/src/lib/design-systems/colors.generated.ts');

/** Os mesmos arquivos do teste de contraste, sem o próprio colors.css. */
function tokenFiles(dir: string, recursive: boolean) {
  return readdirSync(resolve(TOKENS, dir), { recursive, encoding: 'utf8' })
    .filter((file) => file.endsWith('.css'))
    .map((file) => parseTokenBlocks(readFileSync(resolve(TOKENS, dir, file), 'utf8')));
}

const files = [
  parseTokenBlocks(readFileSync(resolve(TOKENS, 'primitives.css'), 'utf8')),
  parseTokenBlocks(readFileSync(resolve(TOKENS, 'semantic.css'), 'utf8')),
  ...tokenFiles('design-systems', true),
  ...tokenFiles('palettes', false),
];

const css = colorsCss(ARG_BRAND_COLORS, ARG_BRAND_ROLES);
const matrix = allowedColors(
  files,
  css,
  await loadDesignSystems(ROOT),
  Object.keys(ARG_BRAND_COLORS),
  ARG_BRAND_ROLES,
  pairsFor,
);
const outputs: [string, string][] = [
  [CSS_FILE, css],
  [MODULE_FILE, allowedColorsModule(matrix)],
];

if (process.argv.includes('--check')) {
  const stale = outputs.filter(
    ([file, content]) => !existsSync(file) || readFileSync(file, 'utf8') !== content,
  );
  for (const [file] of stale) console.error(`Desatualizado: ${file}. Rode \`pnpm colors\`.`);
  if (!stale.length) console.log('Cores de marca em dia.');
  process.exitCode = stale.length ? 1 : 0;
} else {
  for (const [file, content] of outputs) writeFileSync(file, content);
  const count = Object.values(matrix).flatMap((palettes) =>
    Object.values(palettes).flatMap((roles) => Object.values(roles).flat()),
  ).length;
  console.log(`Cores de marca geradas: ${count} combinações permitidas.`);
}
