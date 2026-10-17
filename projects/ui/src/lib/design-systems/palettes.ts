/**
 * Paletas compartilhadas: as que mais de um design system pode aceitar.
 * Cada uma tem `tokens/palettes/<id>.css`, menos a Terrosa, que é a padrão e
 * mora nos próprios tokens semânticos.
 *
 * Para criar uma paleta: o CSS em `tokens/palettes/`, uma entrada aqui e o id
 * na lista `paletas` de cada manifesto que a aceitar. O teste de contraste, o
 * checkup e a barra de tema do catálogo passam a cobri-la sozinhos.
 */

export interface ArgSharedPaletteInfo {
  /** Nome para pessoas (barra de tema, catálogo). */
  readonly nome: string;
  /** Tem arquivo em `tokens/palettes/<id>.css`? */
  readonly arquivo: boolean;
}

export const ARG_SHARED_PALETTES = {
  terrosa: { nome: 'Terrosa', arquivo: false },
} as const satisfies Record<string, ArgSharedPaletteInfo>;

export type ArgSharedPalette = keyof typeof ARG_SHARED_PALETTES;

/** Paleta aceita num manifesto: a nativa do próprio DS ou uma compartilhada. */
export type ArgPaletteName = 'nativa' | ArgSharedPalette;
