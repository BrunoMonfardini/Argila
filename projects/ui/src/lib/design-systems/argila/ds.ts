import type { ArgDesignSystem } from '../design-system';

/** Argila, o DS padrão: 3D macio "de massinha" (o visual completo entra no marco E3). */
export const argila = {
  id: 'argila',
  nome: 'Argila',
  referencia: 'argila.jpg',
  modos: ['light', 'dark'],
  transparencia: true,
  paletas: ['nativa', 'terrosa'],
  componentes: { curados: [], fora: [] },
  exclusivos: [],
  regras: [],
} as const satisfies ArgDesignSystem;
