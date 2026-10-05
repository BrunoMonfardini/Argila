import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

/**
 * Validação e geração dos ícones do Argila. Sem dependências: o SVG aceito é
 * um subconjunto pequeno e previsível (o padrão de desenho do time), então um
 * leitor próprio basta e dá mensagens de erro em português.
 *
 * Padrão: docs/design-system-proprio.md#12-ícones
 */

export interface IconSource {
  /** Nome do arquivo sem `.svg`, ex.: `arrow-left`. */
  name: string;
  svg: string;
}

export interface Icon {
  name: string;
  /** Só os elementos de desenho, sem o `<svg>` da raiz. */
  body: string;
}

export class IconError extends Error {
  readonly icon: string;

  constructor(icon: string, message: string) {
    super(`${icon}.svg: ${message}`);
    this.name = 'IconError';
    this.icon = icon;
  }
}

interface Tag {
  name: string;
  attrs: [string, string][];
  closing: boolean;
  selfClosing: boolean;
}

const GRID = 24;
const SAFE_MIN = 2;
const SAFE_MAX = GRID - SAFE_MIN;

/** Atributos de geometria de cada elemento permitido: obrigatórios e opcionais. */
const SHAPES: Record<string, { required: string[]; optional: string[] }> = {
  path: { required: ['d'], optional: [] },
  circle: { required: ['cx', 'cy', 'r'], optional: [] },
  rect: { required: ['x', 'y', 'width', 'height'], optional: ['rx', 'ry'] },
  line: { required: ['x1', 'y1', 'x2', 'y2'], optional: [] },
};

/** Atributos de estilo aceitos só com o valor do padrão; o `arg-icon` os aplica na raiz. */
const DRAWING_STANDARD: Record<string, string> = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

/** Exigidos no `<svg>` da raiz, para o arquivo parecer no editor o que o produto mostra. */
const ROOT_REQUIRED = ['fill', 'stroke'];

/** Ruído de editor ou de acessibilidade: removido sem erro. */
const NOISE =
  /^(id|class|version|xml:space|focusable|aria-hidden|role|data-[\w-]+|xmlns(:[\w-]+)?|[a-z]+:[\w.-]+)$/i;

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Nomes de uso mais comuns e a forma que os substitui. */
const USAGE_NAMES: Record<string, string> = {
  add: 'plus',
  back: 'arrow-left',
  close: 'x',
  delete: 'trash',
  edit: 'pencil',
  forward: 'arrow-right',
  remove: 'minus',
};

const TAG = /<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
const ATTR = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

export function validateName(name: string): void {
  if (!NAME.test(name)) {
    throw new IconError(name, 'o nome do arquivo precisa estar em kebab-case: `arrow-left.svg`');
  }
  const shape = USAGE_NAMES[name];
  if (shape) {
    throw new IconError(
      name,
      `nomeie pela forma, não pelo uso: use "${shape}" em vez de "${name}"`,
    );
  }
}

/** Remove o que não é desenho: declaração XML, comentários, título e metadados do editor. */
function stripNoise(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<(title|desc|metadata)\b[\s\S]*?<\/\1>/g, '')
    .replace(/<[a-z]+:[\w.-]+\b[^>]*\/>/gi, '')
    .replace(/<([a-z]+:[\w.-]+)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<defs\s*\/>|<defs>\s*<\/defs>/g, '');
}

function parseAttrs(source: string): [string, string][] {
  return Array.from(source.matchAll(ATTR), (m) => [m[1], m[2] ?? m[3]]);
}

function tokenize(svg: string, icon: string): Tag[] {
  const tags: Tag[] = [];
  let last = 0;
  for (const match of svg.matchAll(TAG)) {
    assertBlank(svg.slice(last, match.index), icon);
    tags.push({
      closing: match[1] === '/',
      name: match[2],
      attrs: parseAttrs(match[3]),
      selfClosing: match[4] === '/',
    });
    last = match.index + match[0].length;
  }
  assertBlank(svg.slice(last), icon);
  return tags;
}

function assertBlank(text: string, icon: string): void {
  const trimmed = text.trim();
  if (trimmed) {
    throw new IconError(icon, `conteúdo inesperado: "${trimmed.slice(0, 40)}"`);
  }
}

function checkStandard(attr: string, value: string, icon: string): void {
  const expected = DRAWING_STANDARD[attr];
  if (value !== expected) {
    const hint = attr === 'fill' || attr === 'stroke' ? ' (cor fixa ou preenchimento)' : '';
    throw new IconError(
      icon,
      `${attr}="${value}" foge do padrão${hint}: use ${attr}="${expected}"`,
    );
  }
}

/** Separa atributos de geometria; valida o padrão e descarta o ruído. */
function readAttrs(tag: Tag, geometry: string[], icon: string): Map<string, string> {
  const kept = new Map<string, string>();
  for (const [attr, value] of tag.attrs) {
    if (geometry.includes(attr)) {
      kept.set(attr, value.trim().replace(/\s+/g, ' '));
    } else if (attr in DRAWING_STANDARD) {
      checkStandard(attr, value, icon);
    } else if (attr === 'style') {
      throw new IconError(icon, `use atributos em vez de style em <${tag.name}>`);
    } else if (attr === 'transform') {
      throw new IconError(
        icon,
        `aplique a transformação ao desenho (sem transform) em <${tag.name}>`,
      );
    } else if (!NOISE.test(attr)) {
      throw new IconError(icon, `o atributo ${attr} não é permitido em <${tag.name}>`);
    }
  }
  return kept;
}

function validateRoot(tag: Tag, icon: string): void {
  const attrs = readAttrs(tag, ['viewBox', 'width', 'height'], icon);
  const viewBox = attrs
    .get('viewBox')
    ?.split(/[\s,]+/)
    .join(' ');
  if (viewBox !== `0 0 ${GRID} ${GRID}`) {
    throw new IconError(icon, `a grade precisa ser ${GRID}×${GRID}: viewBox="0 0 ${GRID} ${GRID}"`);
  }
  for (const size of ['width', 'height']) {
    const value = attrs.get(size);
    if (value !== undefined && !new RegExp(`^${GRID}(px)?$`).test(value)) {
      throw new IconError(icon, `${size}="${value}" foge da grade: use ${GRID} ou remova`);
    }
  }
  const present = new Set(tag.attrs.map(([attr]) => attr));
  for (const attr of ROOT_REQUIRED) {
    if (!present.has(attr)) {
      throw new IconError(icon, `o <svg> precisa de ${attr}="${DRAWING_STANDARD[attr]}"`);
    }
  }
}

function numbers(attrs: Map<string, string>, names: string[]): number[] {
  return names.map((name) => Number(attrs.get(name)));
}

/** Coordenadas extremas de formas simples; `path` não é analisado. */
function extent(shape: string, attrs: Map<string, string>): number[] {
  if (shape === 'circle') {
    const [cx, cy, r] = numbers(attrs, ['cx', 'cy', 'r']);
    return [cx - r, cy - r, cx + r, cy + r];
  }
  if (shape === 'rect') {
    const [x, y, width, height] = numbers(attrs, ['x', 'y', 'width', 'height']);
    return [x, y, x + width, y + height];
  }
  if (shape === 'line') {
    return numbers(attrs, ['x1', 'y1', 'x2', 'y2']);
  }
  return [];
}

function serializeShape(tag: Tag, icon: string): string {
  const { required, optional } = SHAPES[tag.name];
  const attrs = readAttrs(tag, [...required, ...optional], icon);
  const missing = required.filter((attr) => !attrs.has(attr));
  if (missing.length) {
    throw new IconError(icon, `<${tag.name}> sem ${missing.join(', ')}`);
  }
  const coords = extent(tag.name, attrs);
  if (coords.some((n) => Number.isNaN(n))) {
    throw new IconError(icon, `<${tag.name}> com coordenada que não é número`);
  }
  if (coords.some((n) => n < SAFE_MIN || n > SAFE_MAX)) {
    throw new IconError(
      icon,
      `<${tag.name}> sai da área útil: mantenha o desenho entre ${SAFE_MIN} e ${SAFE_MAX}`,
    );
  }
  const serialized = [...required, ...optional]
    .filter((attr) => attrs.has(attr))
    .map((attr) => ` ${attr}="${attrs.get(attr)}"`)
    .join('');
  return `<${tag.name}${serialized}/>`;
}

/** Valida um SVG contra o padrão de desenho e devolve só o desenho, limpo. */
export function parseIcon(source: IconSource): Icon {
  const icon = source.name;
  validateName(icon);
  const tags = tokenize(stripNoise(source.svg), icon);
  const [root, ...children] = tags;
  const end = children.pop();
  if (
    !root ||
    root.name !== 'svg' ||
    root.closing ||
    root.selfClosing ||
    !end?.closing ||
    end.name !== 'svg'
  ) {
    throw new IconError(icon, 'o arquivo precisa ter um único <svg> na raiz');
  }
  validateRoot(root, icon);

  const shapes: string[] = [];
  for (let i = 0; i < children.length; i++) {
    const tag = children[i];
    if (tag.closing || !(tag.name in SHAPES)) {
      const hint = tag.name === 'g' ? ' (desagrupe os elementos)' : '';
      throw new IconError(
        icon,
        `<${tag.name}> não é permitido${hint}: use só <path>, <circle>, <rect> e <line>`,
      );
    }
    if (!tag.selfClosing) {
      const next = children[i + 1];
      if (!next?.closing || next.name !== tag.name) {
        throw new IconError(icon, `<${tag.name}> não pode ter elementos dentro`);
      }
      i++;
    }
    shapes.push(serializeShape(tag, icon));
  }
  if (!shapes.length) {
    throw new IconError(icon, 'nenhum desenho encontrado');
  }
  return { name: icon, body: shapes.join('') };
}

/** `arrow-left` → `argIconArrowLeft`. */
export function toConstName(name: string): string {
  return 'argIcon' + name.replace(/(^|-)([a-z0-9])/g, (_, __, char: string) => char.toUpperCase());
}

function quote(text: string): string {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** Código TypeScript com uma constante por ícone, o tipo dos nomes e a lista completa. */
export function generateModule(icons: Icon[]): string {
  const sorted = [...icons].sort((a, b) => a.name.localeCompare(b.name));
  const names = sorted.map((icon) => quote(icon.name));
  const lines = [
    '// Gerado por scripts/gerar-icones.ts a partir de projects/ui/icons/*.svg.',
    '// Não edite à mão: desenhe o SVG e rode `pnpm icons`.',
    "import type { ArgIconDef } from './icon-def';",
    '',
    `export type ArgIconName = ${names.length ? names.join(' | ') : 'never'};`,
    '',
    ...sorted.map(
      (icon) =>
        `export const ${toConstName(icon.name)}: ArgIconDef = { name: ${quote(icon.name)}, svg: ${quote(icon.body)} };`,
    ),
    '',
    '/** Todos os ícones. Prefira registrar só os que o produto usa. */',
    `export const argIconsAll: readonly ArgIconDef[] = [${sorted.map((icon) => toConstName(icon.name)).join(', ')}];`,
    '',
  ];
  return lines.join('\n');
}

export interface IconRunOptions {
  iconsDir: string;
  outFile: string;
  /** Só confere se o arquivo gerado está atualizado, sem gravar. */
  check: boolean;
}

export interface IconRunResult {
  ok: boolean;
  messages: string[];
}

/** Lê todos os SVGs da pasta, valida, e grava (ou confere) o código gerado. */
export function runIconGenerator(options: IconRunOptions): IconRunResult {
  const files = readdirSync(options.iconsDir)
    .filter((file) => file.endsWith('.svg'))
    .sort();
  const icons: Icon[] = [];
  const errors: string[] = [];
  for (const file of files) {
    try {
      const svg = readFileSync(join(options.iconsDir, file), 'utf8');
      icons.push(parseIcon({ name: basename(file, '.svg'), svg }));
    } catch (error) {
      if (!(error instanceof IconError)) throw error;
      errors.push(error.message);
    }
  }
  if (errors.length) {
    return { ok: false, messages: [...errors, `${errors.length} ícone(s) fora do padrão.`] };
  }

  const code = generateModule(icons);
  const current = existsSync(options.outFile) ? readFileSync(options.outFile, 'utf8') : '';
  if (options.check) {
    return current === code
      ? { ok: true, messages: [`${icons.length} ícone(s) no padrão e código atualizado.`] }
      : { ok: false, messages: [`${options.outFile} está desatualizado: rode pnpm icons.`] };
  }
  if (current !== code) {
    writeFileSync(options.outFile, code);
  }
  return { ok: true, messages: [`${icons.length} ícone(s) gerado(s) em ${options.outFile}.`] };
}
