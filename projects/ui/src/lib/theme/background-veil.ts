import { DOCUMENT, InjectionToken, inject } from '@angular/core';

/** Cor sRGB, com cada canal de 0 a 255. */
export type ArgRgb = readonly [number, number, number];

/** As cores do tema aplicado que entram na conta do véu, já resolvidas. */
export interface ArgVeilColors {
  /** Texto que fica direto sobre o fundo: o comum, o suave e o de link. */
  readonly texts: readonly ArgRgb[];
  /** A cor de fundo, que é a cor do véu. */
  readonly background: ArgRgb;
  /** As cores das manchas (primária, secundária, destaque). */
  readonly spots: readonly ArgRgb[];
}

/** Contraste mínimo do texto (WCAG AA). */
const TEXT = 4.5;
/** Opacidade das manchas sobre a imagem (`--arg-background-glow-*`). */
const SPOT_OPACITY = 0.45;

function luminance(rgb: ArgRgb): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: ArgRgb, b: ArgRgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** `color` com opacidade `alpha` pintada sobre `base`, como o navegador (em sRGB). */
function over(color: ArgRgb, alpha: number, base: ArgRgb): ArgRgb {
  return [0, 1, 2].map((i) => color[i] * alpha + base[i] * (1 - alpha)) as unknown as ArgRgb;
}

/**
 * A menor opacidade do véu (0 a 1, em passos de 1%) com que todo o texto
 * passa sobre a imagem: o véu sobre cada pixel dado (os extremos da imagem),
 * sem mancha e com cada mancha por cima. 1 quando nem o véu opaco basta.
 */
export function argMinimumVeil(pixels: readonly ArgRgb[], colors: ArgVeilColors): number {
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

/**
 * Os pixels mais escuro e mais claro (pela luminância) de uma imagem em RGBA;
 * pixels quase transparentes ficam de fora. Vazio quando não sobra nenhum.
 */
export function argImageExtremes(data: Uint8ClampedArray): ArgRgb[] {
  let darkest: ArgRgb | undefined;
  let lightest: ArgRgb | undefined;
  for (let i = 0; i + 3 < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const pixel: ArgRgb = [data[i], data[i + 1], data[i + 2]];
    if (!darkest || luminance(pixel) < luminance(darkest)) darkest = pixel;
    if (!lightest || luminance(pixel) > luminance(lightest)) lightest = pixel;
  }
  return darkest && lightest ? [darkest, lightest] : [];
}

/** O que o véu automático do `ArgTheme` precisa do navegador. */
export interface ArgVeilMeasurer {
  /**
   * Pixels RGBA de uma cópia de 64×64 da imagem. Rejeita se ela não abre ou
   * é de outra origem sem CORS (o canvas não deixa ler os pixels).
   */
  imagePixels(url: string): Promise<Uint8ClampedArray>;
  /** As cores do tema aplicado agora, resolvidas. */
  themeColors(): ArgVeilColors;
}

/** Lado da cópia pequena da imagem: basta para os extremos e para as cores. */
export const ARG_VEIL_SAMPLE_SIZE = 64;

const TEXTS = ['--arg-color-text', '--arg-color-text-muted', '--arg-color-text-link'];
const SPOTS = ['--arg-color-primary', '--arg-color-secondary', '--arg-color-accent'];

/** A medição de verdade: `<img>`, canvas e a cor que o CSS calcula. */
function browserMeasurer(document: Document): ArgVeilMeasurer {
  const canvas = (size: number) => {
    const element = document.createElement('canvas');
    element.width = element.height = size;
    const context = element.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('canvas indisponível');
    return context;
  };
  return {
    imagePixels: (url) =>
      new Promise((resolve, reject) => {
        const image = document.createElement('img');
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          try {
            const context = canvas(ARG_VEIL_SAMPLE_SIZE);
            context.drawImage(image, 0, 0, ARG_VEIL_SAMPLE_SIZE, ARG_VEIL_SAMPLE_SIZE);
            resolve(context.getImageData(0, 0, ARG_VEIL_SAMPLE_SIZE, ARG_VEIL_SAMPLE_SIZE).data);
          } catch (error) {
            reject(error);
          }
        };
        image.onerror = () => reject(new Error(`a imagem "${url}" não abriu`));
        image.src = url;
      }),
    themeColors() {
      // A cor calculada pode vir como rgb(), oklab() ou color(): o canvas devolve sRGB
      const probe = document.createElement('span');
      probe.hidden = true;
      document.body.append(probe);
      const context = canvas(1);
      try {
        const [background, ...rest] = ['--arg-color-background', ...TEXTS, ...SPOTS].map(
          (token): ArgRgb => {
            probe.style.color = `var(${token})`;
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = getComputedStyle(probe).color;
            context.fillRect(0, 0, 1, 1);
            const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
            return [r, g, b];
          },
        );
        return { background, texts: rest.slice(0, TEXTS.length), spots: rest.slice(TEXTS.length) };
      } finally {
        probe.remove();
      }
    },
  };
}

/**
 * Como o `ArgTheme` mede a imagem e as cores para o véu automático. O padrão
 * usa o navegador; testes (e ambientes sem DOM) fornecem outro.
 */
export const ARG_VEIL_MEASURER = new InjectionToken<ArgVeilMeasurer>('ARG_VEIL_MEASURER', {
  factory: () => browserMeasurer(inject(DOCUMENT)),
});
