import {
  type ArgOklab,
  type ArgSchemeName,
  argOklabToSrgb,
  argSrgbToOklab,
} from '@brunomonfardini/ui';

/** Cor em OKLab: luminosidade (0 a 1) e os eixos a e b. */
export type Oklab = ArgOklab;

/** Uma cor principal da imagem e a fatia da imagem que ela ocupa (0 a 1). */
export interface ImageColor {
  readonly hex: string;
  readonly oklab: Oklab;
  readonly share: number;
}

export interface ImagePalette {
  /** As cores para a marca, da mais marcante para a menos: área × croma. */
  readonly colors: readonly ImageColor[];
  /** O modo sugerido pela luminosidade média da imagem. */
  readonly scheme: ArgSchemeName;
  /** Os pixels mais escuro e mais claro, para o cálculo do véu. */
  readonly darkest: string;
  readonly lightest: string;
}

/** Grupos do k-means: mais que as três cores, para sobrar escolha. */
const GROUPS = 6;
const ROUNDS = 12;
/** Abaixo, quase preto; acima, quase branco; abaixo do croma mínimo, cinza. */
const MIN_LIGHTNESS = 0.15;
const MAX_LIGHTNESS = 0.92;
const MIN_CHROMA = 0.03;
/** Luminosidade média abaixo da qual a imagem pede o modo escuro. */
const DARK_BELOW = 0.5;

/** sRGB (0 a 255) para OKLab. */
export function rgbToOklab(r: number, g: number, b: number): Oklab {
  return argSrgbToOklab(r / 255, g / 255, b / 255);
}

/** OKLab para `#rrggbb`, preso ao que a tela mostra. */
export function oklabToHex(lab: Oklab): string {
  return (
    '#' +
    argOklabToSrgb(lab)
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** `#rrggbb` para OKLab. */
export function hexToOklab(hex: string): Oklab {
  const n = Number.parseInt(hex.slice(1), 16);
  return rgbToOklab((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

/** Distância perceptual (ΔE em OKLab). */
export function distance(a: Oklab, b: Oklab): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

const chroma = ([, a, b]: Oklab) => Math.hypot(a, b);

/**
 * Centros iniciais pelo ponto mais distante: o primeiro pixel e, a cada
 * passo, o pixel mais longe dos centros já escolhidos. Sem sorteio: a mesma
 * imagem dá sempre as mesmas cores.
 */
function initialCenters(points: readonly Oklab[], k: number): Oklab[] {
  const centers: Oklab[] = [points[0]];
  const nearest = points.map((p) => distance(p, points[0]));
  while (centers.length < k) {
    let far = 0;
    for (let i = 1; i < points.length; i++) if (nearest[i] > nearest[far]) far = i;
    if (nearest[far] === 0) break;
    centers.push(points[far]);
    points.forEach((p, i) => (nearest[i] = Math.min(nearest[i], distance(p, points[far]))));
  }
  return centers;
}

/** k-means em OKLab: os centros e quantos pixels caem em cada um. */
function kMeans(points: readonly Oklab[], k: number): { center: Oklab; count: number }[] {
  let centers = initialCenters(points, k);
  let labels: number[] = [];
  for (let round = 0; round < ROUNDS; round++) {
    labels = points.map((p) => {
      let best = 0;
      centers.forEach((c, i) => {
        if (distance(p, c) < distance(p, centers[best])) best = i;
      });
      return best;
    });
    centers = centers.map((center, i) => {
      const members = points.filter((_, j) => labels[j] === i);
      if (!members.length) return center;
      const sum = members.reduce(
        (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
        [0, 0, 0],
      );
      return [sum[0] / members.length, sum[1] / members.length, sum[2] / members.length] as const;
    });
  }
  return centers.map((center, i) => ({ center, count: labels.filter((l) => l === i).length }));
}

/**
 * As cores principais de uma imagem, a partir dos pixels RGBA de uma cópia
 * pequena dela (64×64 basta). Pixels quase transparentes ficam de fora.
 */
export function extractColors(pixels: Uint8ClampedArray): ImagePalette {
  const points: Oklab[] = [];
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue;
    points.push(rgbToOklab(pixels[i], pixels[i + 1], pixels[i + 2]));
  }
  if (!points.length) {
    return { colors: [], scheme: 'light', darkest: '#000000', lightest: '#ffffff' };
  }
  const lightness = points.map(([L]) => L);
  const mean = lightness.reduce((sum, L) => sum + L, 0) / points.length;
  const darkest = points[lightness.indexOf(Math.min(...lightness))];
  const lightest = points[lightness.indexOf(Math.max(...lightness))];

  const colors = kMeans(points, GROUPS)
    .filter(({ count }) => count > 0)
    .filter(
      ({ center }) =>
        center[0] > MIN_LIGHTNESS && center[0] < MAX_LIGHTNESS && chroma(center) >= MIN_CHROMA,
    )
    .map(({ center, count }) => ({
      hex: oklabToHex(center),
      oklab: center,
      share: count / points.length,
    }))
    .sort((a, b) => b.share * chroma(b.oklab) - a.share * chroma(a.oklab));

  return {
    colors,
    scheme: mean < DARK_BELOW ? 'dark' : 'light',
    darkest: oklabToHex(darkest),
    lightest: oklabToHex(lightest),
  };
}
