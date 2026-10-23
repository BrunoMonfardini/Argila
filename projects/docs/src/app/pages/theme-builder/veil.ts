/** Cor sRGB de 0 a 255. */
export type Rgb = readonly [number, number, number];

/** As cores do tema aplicado que entram na conta do véu, já resolvidas. */
export interface VeilColors {
  /** Texto que fica direto sobre o fundo: o comum, o suave e o de link. */
  readonly texts: readonly Rgb[];
  /** A cor de fundo, que é a cor do véu. */
  readonly background: Rgb;
  /** As cores das manchas (primária, secundária, destaque). */
  readonly spots: readonly Rgb[];
}

/** Contraste mínimo do texto (WCAG AA). */
const TEXT = 4.5;
/** Opacidade das manchas sobre a imagem (`--arg-background-glow-*`). */
const SPOT_OPACITY = 0.45;

/** `#rrggbb` ou `rgb(r, g, b)` para RGB. */
export function parseColor(value: string): Rgb {
  const text = value.trim();
  if (text.startsWith('#')) {
    const n = Number.parseInt(text.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const [r, g, b] = (text.match(/[\d.]+/g) ?? []).map(Number);
  if ([r, g, b].some((c) => c === undefined || Number.isNaN(c))) {
    throw new Error(`cor não suportada: "${value}"`);
  }
  return [r, g, b];
}

function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** `color` com opacidade `alpha` pintada sobre `base`, como o navegador (em sRGB). */
function over(color: Rgb, alpha: number, base: Rgb): Rgb {
  return [0, 1, 2].map((i) => color[i] * alpha + base[i] * (1 - alpha)) as unknown as Rgb;
}

/**
 * A menor opacidade do véu (0 a 1, em passos de 1%) com que todo o texto
 * passa sobre a imagem: o véu sobre os pixels mais escuro e mais claro dela,
 * sem mancha e com cada mancha por cima. 1 quando nem o véu opaco basta.
 */
export function minimumVeil(pixels: readonly Rgb[], colors: VeilColors): number {
  const under = pixels.flatMap((pixel) => [
    pixel,
    ...colors.spots.map((spot) => over(spot, SPOT_OPACITY, pixel)),
  ]);
  for (let percent = 0; percent <= 100; percent++) {
    const passes = under.every((pixel) => {
      const backdrop = over(colors.background, percent / 100, pixel);
      return colors.texts.every((text) => contrast(text, backdrop) >= TEXT);
    });
    if (passes) return percent / 100;
  }
  return 1;
}
