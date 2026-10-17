import { argila } from './argila/ds';
import { coda } from './coda/ds';
import { molde } from './molde/ds';
import { neoBrutalista } from './neo-brutalista/ds';
import { punk } from './punk/ds';
import { transparente } from './transparente/ds';
import { windowsXp } from './windows-xp/ds';

/** Todos os design systems, pelo valor de `data-arg-style`. */
export const ARG_DESIGN_SYSTEMS = {
  argila,
  molde,
  coda,
  transparente,
  'windows-xp': windowsXp,
  'neo-brutalista': neoBrutalista,
  punk,
} as const;

/** Design system (antes "estilo"): o valor de `data-arg-style`. */
export type ArgStyle = keyof typeof ARG_DESIGN_SYSTEMS;

/** Paletas que o design system `S` aceita. */
export type ArgPaletteOf<S extends ArgStyle> = (typeof ARG_DESIGN_SYSTEMS)[S]['paletas'][number];

/** Paleta: o valor de `data-arg-palette`. `nativa` é a paleta própria do DS. */
export type ArgPalette = ArgPaletteOf<ArgStyle>;
