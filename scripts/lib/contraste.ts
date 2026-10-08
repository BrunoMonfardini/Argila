/**
 * Contraste dos tokens de cor, calculado a partir do CSS dos tokens.
 *
 * O navegador de teste (jsdom) não calcula `light-dark()` nem `color-mix()`,
 * então este módulo resolve as expressões que os tokens do Argila usam:
 * `var()`, `light-dark()`, `color-mix(in oklab, …)`, `#hex` e `rgb()`.
 */

export type ColorScheme = 'light' | 'dark';

export interface Rgb {
  r: number;
  g: number;
  b: number;
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
  const [r, g, b] = inner
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map((part) => Number(part) / 255);
  return { r, g, b };
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

/** Lê "cor 12%" e devolve a cor e o peso (undefined quando não informado). */
function splitWeight(arg: string): { color: string; weight?: number } {
  const match = /^(.*?)\s+(\d+(?:\.\d+)?)%$/s.exec(arg);
  return match ? { color: match[1], weight: Number(match[2]) / 100 } : { color: arg };
}

export function mixOklab(a: Rgb, b: Rgb, weightA: number): Rgb {
  const la = toOklab(a);
  const lb = toOklab(b);
  return fromOklab(
    [0, 1, 2].map((i) => la[i] * weightA + lb[i] * (1 - weightA)) as [number, number, number],
  );
}

/** Resolve um valor CSS de cor no tema pedido, seguindo as variáveis. */
export function resolveColor(
  value: string,
  tokens: Map<string, string>,
  scheme: ColorScheme,
  seen: string[] = [],
): Rgb {
  const text = value.trim();
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
      const first = splitWeight(args[1]);
      const second = splitWeight(args[2]);
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

/** Contraste de cada par, no tema pedido, arredondado em duas casas. */
export function checkContrast(
  tokens: Map<string, string>,
  pairs: ContrastPair[],
  scheme: ColorScheme,
): ContrastResult[] {
  return pairs.map((pair) => {
    const foreground = resolveColor(`var(${pair.foreground})`, tokens, scheme);
    const background = resolveColor(`var(${pair.background})`, tokens, scheme);
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
