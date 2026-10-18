import type { ArgDesignSystem } from '../design-system';

/**
 * Argila, o DS padrão: 3D macio "de massinha". A paleta nativa é a Massinha,
 * os próprios tokens semânticos.
 */
export const argila = {
  id: 'argila',
  nome: 'Argila',
  referencia: 'argila.jpg',
  modos: ['light', 'dark'],
  transparencia: true,
  paletas: ['nativa', 'terrosa', 'oceano', 'floresta', 'mono', 'alto-contraste'],
  componentes: {
    nucleoMinimo: true,
    curados: [],
    fora: [],
  },
  exclusivos: [],
  regras: [],
} as const satisfies ArgDesignSystem;
