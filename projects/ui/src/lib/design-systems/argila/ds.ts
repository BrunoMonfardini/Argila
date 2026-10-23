import type { ArgDesignSystem } from '../design-system';

/**
 * Argila, o DS padrão: 3D macio "de massinha". A paleta nativa é a Massinha,
 * os próprios tokens semânticos.
 */
export const argila = {
  id: 'argila',
  nome: 'Argila',
  linguagem:
    '3D macio "de massinha": superfícies quase brancas, volume com sombra difusa embaixo e realce de luz em cima, controles em pílula e nada de contorno escuro.',
  referencia: 'argila.jpg',
  modos: ['light', 'dark'],
  transparencia: true,
  fundos: ['liso', 'degrade', 'imagem'],
  paletas: ['nativa', 'terrosa', 'oceano', 'floresta', 'mono', 'alto-contraste'],
  componentes: {
    nucleoMinimo: true,
    curados: [],
    fora: [],
  },
  exclusivos: [],
  regras: [],
} as const satisfies ArgDesignSystem;
