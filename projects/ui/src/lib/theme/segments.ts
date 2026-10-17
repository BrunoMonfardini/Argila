import { InjectionToken } from '@angular/core';
import type { ArgBrandRole } from '../design-systems/colors';
import type { ArgPaletteOf, ArgStyle } from '../design-systems/design-systems';
import type { ArgColorScheme, ArgColors } from './theme';

/**
 * Um segmento: um conjunto nomeado de escolhas de aparência, como a versão
 * "premium" escura de um produto. Só aceita paletas que o design system
 * aceita: `{ style: 'windows-xp', palette: 'terrosa' }` não compila.
 */
export type ArgSegment = {
  [S in ArgStyle]: {
    style: S;
    /** Sem paleta, vale a padrão do design system. */
    palette?: ArgPaletteOf<S>;
    /** Fixa o modo de cor; o produto pode esconder o seletor de modo. */
    scheme?: ArgColorScheme;
    /** Cores da lista fixa; as que não passam no par são ignoradas, com aviso. */
    colors?: ArgColors;
    /** Opacidade das superfícies, se o design system aceitar transparência. */
    surfaceOpacity?: number;
  };
}[ArgStyle];

export interface ArgilaConfig<K extends string = string> {
  /** Segmentos do produto, pelo nome: `{ essencial: {…}, premium: {…} }`. */
  segments?: Readonly<Record<K, ArgSegment>>;
  /** Segmento aplicado ao iniciar o app. */
  defaultSegment?: NoInfer<K>;
}

/** Segmentos declarados pelo app com `provideArgila`. */
export const ARG_SEGMENTS = new InjectionToken<Readonly<Record<string, ArgSegment>>>(
  'ARG_SEGMENTS',
  { factory: () => ({}) },
);

/**
 * Os atributos do `<html>` de um segmento, para quem aplica o tema sem o
 * `ArgTheme` (HTML estático, renderização no servidor). O modo vai em
 * `data-arg-theme`; a opacidade fica de fora (é uma variável CSS, não um atributo).
 */
export function argSegmentAttributes(segment: ArgSegment): Record<string, string> {
  const attributes: Record<string, string> = { 'data-arg-style': segment.style };
  if (segment.palette) attributes['data-arg-palette'] = segment.palette;
  if (segment.scheme) attributes['data-arg-theme'] = segment.scheme;
  for (const [role, color] of Object.entries(segment.colors ?? {}) as [ArgBrandRole, string][]) {
    attributes[`data-arg-${role}`] = color;
  }
  return attributes;
}
