/**
 * Contraste dos tokens de cor, calculado a partir do CSS dos tokens.
 *
 * O navegador de teste (jsdom) não calcula `light-dark()` nem `color-mix()`,
 * então este módulo resolve as expressões que os tokens do Argila usam:
 * `var()`, `light-dark()`, `color-mix(in oklab, …)`, `#hex`, `rgb()` e
 * `transparent`, com pesos em `calc()` e `clamp()` (transparência das
 * superfícies). Cores translúcidas são compostas sobre o fundo da página.
 */

export type ColorScheme = 'light' | 'dark';

export interface Rgb {
  r: number;
  g: number;
  b: number;
  /** Opacidade de 0 a 1; ausente quando a cor é opaca. */
  a?: number;
}

/** A cor com a opacidade pedida; opaca não leva o campo `a`. */
function withAlpha({ r, g, b }: Rgb, a: number): Rgb {
  return a >= 1 ? { r, g, b } : { r, g, b, a };
}

/** Declarações `--arg-*` por seletor, na ordem do arquivo. */
export type TokenBlocks = Map<string, Map<string, string>>;

export interface ContrastPair {
  foreground: string;
  background: string;
  /** 4.5 para texto, 3 para bordas e indicadores (WCAG 1.4.3 e 1.4.11). */
  minimum: number;
}

export interface ContrastResult extends ContrastPair {
  scheme: ColorScheme;
  ratio: number;
}

/**
 * Blocos de declarações de nível superior. Blocos dentro de `@media` ficam de
 * fora: são ajustes de movimento e preferências, não as cores do tema.
 */
export function parseTokenBlocks(css: string): TokenBlocks {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks: TokenBlocks = new Map();
  let depth = 0;
  let start = 0;
  let selector = '';
  let skip = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '{') {
      if (depth === 0) {
        selector = source.slice(start, i).trim();
        skip = selector.startsWith('@');
      }
      depth++;
      start = i + 1;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        if (!skip) addDeclarations(blocks, selector, source.slice(start, i));
        start = i + 1;
      } else {
        start = i + 1;
      }
    }
  }
  return blocks;
}

function addDeclarations(blocks: TokenBlocks, selector: string, body: string): void {
  const declarations = blocks.get(selector) ?? new Map<string, string>();
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    declarations.set(name, value.replace(/\s+/g, ' ').trim());
  }
  blocks.set(selector, declarations);
}

/** Junta as declarações de vários seletores; os últimos sobrescrevem os primeiros. */
export function mergeTokens(blocks: TokenBlocks[], selectors: string[]): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const selector of selectors) {
    for (const block of blocks) {
      for (const [name, value] of block.get(selector) ?? []) {
        tokens.set(name, value);
      }
    }
  }
  return tokens;
}

/** Atributos do `<html>` numa combinação de tema, ex.: `{ 'data-arg-style': 'coda' }`. */
export type RootAttributes = Record<string, string>;

/**
 * Diz se um seletor de tema vale para o `<html>` com estes atributos. Entende
 * `:root`, `[atributo]`, `[atributo='valor']` e `:not(…)` desses dois; a
 * vírgula separa alternativas. Outros seletores não casam.
 */
export function matchesRoot(selector: string, attributes: RootAttributes): boolean {
  return selector.split(',').some((part) => matchesCompound(part.trim(), attributes));
}

function matchesCompound(compound: string, attributes: RootAttributes): boolean {
  let rest = compound.startsWith(':root') ? compound.slice(':root'.length) : compound;
  if (rest === compound && !rest.startsWith('[')) return false;
  const condition = /^(:not\()?\[([\w-]+)(?:='([^']*)')?\]\)?/;
  while (rest) {
    const match = condition.exec(rest);
    if (!match) return false;
    const [whole, negated, name, value] = match;
    const present = value === undefined ? name in attributes : attributes[name] === value;
    if (negated ? present : !present) return false;
    rest = rest.slice(whole.length);
  }
  return true;
}

/** Tokens do `<html>` com estes atributos: os blocos que casam, na ordem dos arquivos. */
export function tokensForRoot(
  files: TokenBlocks[],
  attributes: RootAttributes,
): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const blocks of files) {
    for (const [selector, declarations] of blocks) {
      if (!matchesRoot(selector, attributes)) continue;
      for (const [name, value] of declarations) tokens.set(name, value);
    }
  }
  return tokens;
}

/** Divide os argumentos de uma função CSS nas vírgulas de nível superior. */
function splitArgs(text: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') depth--;
    else if (text[i] === ',' && depth === 0) {
      args.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  args.push(text.slice(start).trim());
  return args;
}

/** `nome(args)` inteiro → nome e o conteúdo entre os parênteses. */
function parseCall(text: string): { name: string; inner: string } | undefined {
  const match = /^([\w-]+)\((.*)\)$/s.exec(text.trim());
  return match ? { name: match[1], inner: match[2] } : undefined;
}

function parseHex(hex: string): Rgb {
  const digits =
    hex.length === 4
      ? hex
          .slice(1)
          .split('')
          .map((d) => d + d)
          .join('')
      : hex.slice(1, 7);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16) / 255);
  return { r, g, b };
}

function parseRgb(inner: string): Rgb {
  const [r, g, b, a] = inner.split(/[\s,/]+/).filter(Boolean);
  const alpha = a === undefined ? 1 : a.endsWith('%') ? parseFloat(a) / 100 : Number(a);
  return withAlpha({ r: Number(r) / 255, g: Number(g) / 255, b: Number(b) / 255 }, alpha);
}

// sRGB ↔ OKLab (Björn Ottosson), para color-mix(in oklab, …)
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function toOklab({ r, g, b }: Rgb): [number, number, number] {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: [number, number, number]): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (c: number) => Math.min(1, Math.max(0, fromLinear(c)));
  return {
    r: clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

/**
 * Calcula uma expressão numérica de `calc()`: números, `var()`, `clamp()`,
 * `*` e `/`. Uma porcentagem vira fração (`60%` → 0.6).
 */
export function evaluateNumber(expression: string, tokens: Map<string, string>): number {
  let text = expression.trim();
  // Resolve de dentro para fora: var(), clamp() e calc() sem parênteses dentro
  for (let guard = 0; text.includes('('); guard++) {
    if (guard > 50) throw new Error(`expressão não suportada: "${expression}"`);
    text = text
      .replace(/var\((--[\w-]+)(?:\s*,\s*([^()]+))?\)/g, (_, name: string, fallback?: string) => {
        const value = tokens.get(name) ?? fallback;
        if (value === undefined) throw new Error(`token não definido: ${name}`);
        return value.trim();
      })
      .replace(/clamp\(([^()]+)\)/g, (_, args: string) => {
        const [min, value, max] = args.split(',').map((arg) => evaluateNumber(arg, tokens));
        return String(Math.min(max, Math.max(min, value)));
      })
      .replace(/calc\(([^()]+)\)/g, (_, inner: string) => String(evaluateNumber(inner, tokens)));
  }
  const [first, ...rest] = text.split(/\s*([*/])\s*/);
  let result = parseNumber(first, expression);
  for (let i = 0; i < rest.length; i += 2) {
    const operand = parseNumber(rest[i + 1], expression);
    result = rest[i] === '*' ? result * operand : result / operand;
  }
  return result;
}

function parseNumber(text: string, expression: string): number {
  const value = text.endsWith('%') ? parseFloat(text) / 100 : Number(text);
  if (Number.isNaN(value)) throw new Error(`expressão não suportada: "${expression}"`);
  return value;
}

/** Lê "cor 12%" ou "cor calc(…)" e devolve a cor e o peso (undefined quando não informado). */
function splitWeight(arg: string, tokens: Map<string, string>): { color: string; weight?: number } {
  const match = /^(.*?)\s+(\d+(?:\.\d+)?%|calc\(.*\)|var\(--[\w-]+\))$/s.exec(arg);
  return match ? { color: match[1], weight: evaluateNumber(match[2], tokens) } : { color: arg };
}

/** Mistura em OKLab com alfa pré-multiplicado, como o `color-mix()` do navegador. */
export function mixOklab(a: Rgb, b: Rgb, weightA: number): Rgb {
  const alphaA = (a.a ?? 1) * weightA;
  const alphaB = (b.a ?? 1) * (1 - weightA);
  const alpha = alphaA + alphaB;
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const la = toOklab(a);
  const lb = toOklab(b);
  const mixed = fromOklab(
    [0, 1, 2].map((i) => (la[i] * alphaA + lb[i] * alphaB) / alpha) as [number, number, number],
  );
  return withAlpha(mixed, alpha);
}

/** Compõe uma cor translúcida sobre uma opaca, como o navegador pinta (em sRGB). */
export function composite(color: Rgb, base: Rgb): Rgb {
  const alpha = color.a ?? 1;
  if (alpha >= 1) return color;
  const channel = (key: 'r' | 'g' | 'b') => color[key] * alpha + base[key] * (1 - alpha);
  return { r: channel('r'), g: channel('g'), b: channel('b') };
}

/** Resolve um valor CSS de cor no tema pedido, seguindo as variáveis. */
export function resolveColor(
  value: string,
  tokens: Map<string, string>,
  scheme: ColorScheme,
  seen: string[] = [],
): Rgb {
  const text = value.trim();
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(text)) return parseHex(text);
  const call = parseCall(text);
  if (!call) throw new Error(`cor não suportada: "${text}"`);
  const args = splitArgs(call.inner);
  switch (call.name) {
    case 'var': {
      const name = args[0];
      if (seen.includes(name))
        throw new Error(`referência circular: ${[...seen, name].join(' → ')}`);
      const next = tokens.get(name) ?? args[1];
      if (next === undefined) throw new Error(`token não definido: ${name}`);
      return resolveColor(next, tokens, scheme, [...seen, name]);
    }
    case 'light-dark':
      return resolveColor(scheme === 'light' ? args[0] : args[1], tokens, scheme, seen);
    case 'rgb':
    case 'rgba':
      return parseRgb(call.inner);
    case 'color-mix': {
      if (args[0].replace(/\s+/g, ' ') !== 'in oklab') {
        throw new Error(`color-mix só é suportado em oklab: "${text}"`);
      }
      const first = splitWeight(args[1], tokens);
      const second = splitWeight(args[2], tokens);
      const weightA = first.weight ?? (second.weight !== undefined ? 1 - second.weight : 0.5);
      return mixOklab(
        resolveColor(first.color, tokens, scheme, seen),
        resolveColor(second.color, tokens, scheme, seen),
        weightA,
      );
    }
    default:
      throw new Error(`função de cor não suportada: ${call.name}()`);
  }
}

/** Luminância relativa do WCAG 2. */
export function luminance({ r, g, b }: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Contraste de cada par, no tema pedido, arredondado em duas casas. Um fundo
 * translúcido é composto sobre `backdrop` (o fundo da página), e o texto
 * translúcido sobre o fundo já composto.
 */
export function checkContrast(
  tokens: Map<string, string>,
  pairs: ContrastPair[],
  scheme: ColorScheme,
  backdrop = '--arg-color-background',
): ContrastResult[] {
  return pairs.map((pair) => {
    let background = resolveColor(`var(${pair.background})`, tokens, scheme);
    if ((background.a ?? 1) < 1) {
      background = composite(background, resolveColor(`var(${backdrop})`, tokens, scheme));
    }
    const foreground = composite(
      resolveColor(`var(${pair.foreground})`, tokens, scheme),
      background,
    );
    const ratio = Math.floor(contrastRatio(foreground, background) * 100) / 100;
    return { ...pair, scheme, ratio };
  });
}

/** Só os pares abaixo do mínimo, com uma frase para a mensagem do teste. */
export function contrastFailures(results: ContrastResult[]): string[] {
  return results
    .filter((result) => result.ratio < result.minimum)
    .map(
      (r) =>
        `${r.scheme}: ${r.foreground} sobre ${r.background} = ${r.ratio}:1 (mínimo ${r.minimum}:1)`,
    );
}
