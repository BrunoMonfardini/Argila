import {
  ARG_BRAND_COLORS,
  ARG_BRAND_ROLES,
  type ArgBrandColor,
  type ArgBrandRole,
  type ArgSchemeName,
} from '@brunomonfardini/ui';
import { type ImageColor, type Oklab, hexToOklab } from './image-colors';

/**
 * Pesos da distância em luminosidade, croma e matiz. O modo já fixa a
 * luminosidade da cor de marca (clara no escuro, escura no claro), então ela
 * quase não conta; o matiz decide, e o croma desempata.
 */
const LIGHTNESS_WEIGHT = 0.1;
const CHROMA_WEIGHT = 0.5;

/** Distância em OKLab separada em luminosidade, croma e matiz (LCh), com os pesos acima. */
function hueDistance(a: Oklab, b: Oklab): number {
  const chromaDelta = Math.hypot(a[1], a[2]) - Math.hypot(b[1], b[2]);
  const abDelta = (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  const hueDelta = Math.sqrt(Math.max(0, abDelta - chromaDelta ** 2));
  return Math.hypot((a[0] - b[0]) * LIGHTNESS_WEIGHT, chromaDelta * CHROMA_WEIGHT, hueDelta);
}

/** A cor da lista fixa escolhida para um papel, a partir de uma cor da imagem. */
export interface BrandMatch {
  readonly role: ArgBrandRole;
  readonly color: ArgBrandColor;
  /** A cor da imagem que deu origem à escolha. */
  readonly source: string;
  /** Quão longe a cor da lista ficou da cor da imagem, no matiz e no croma. */
  readonly distance: number;
}

/**
 * Para cada papel (primária, secundária, destaque), na ordem, a cor da lista
 * fixa mais próxima da cor da imagem de mesma posição, no valor do modo
 * escolhido, pelo matiz e pelo croma. Só entram as cores que o papel aceita no DS e na paleta atuais,
 * e os três nomes são diferentes. Com menos de três cores na imagem, os
 * papéis que sobram usam a primeira.
 */
export function matchBrandColors(
  colors: readonly ImageColor[],
  scheme: ArgSchemeName,
  allowed: Readonly<Record<ArgBrandRole, readonly ArgBrandColor[]>>,
): BrandMatch[] {
  if (!colors.length) return [];
  const used = new Set<ArgBrandColor>();
  return ARG_BRAND_ROLES.flatMap((role, index) => {
    const source = colors[index] ?? colors[0];
    const ranked = allowed[role]
      .filter((color) => !used.has(color))
      .map((color) => {
        const info = ARG_BRAND_COLORS[color];
        const value = hexToOklab(scheme === 'dark' ? info.escuro : info.claro);
        return { color, distance: hueDistance(source.oklab, value) };
      })
      .sort((a, b) => a.distance - b.distance);
    const best = ranked[0];
    if (!best) return [];
    used.add(best.color);
    return [{ role, color: best.color, source: source.hex, distance: best.distance }];
  });
}
