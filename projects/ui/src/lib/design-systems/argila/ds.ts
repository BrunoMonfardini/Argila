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
    // O núcleo mínimo (ARG_CORE_MINIMUM): o manifesto só importa tipos, por isso a lista
    curados: [
      'alert',
      'badge',
      'button',
      'card',
      'choice',
      'dialog',
      'divider',
      'empty-state',
      'field',
      'icon-button',
      'input',
      'link',
      'progress-bar',
      'select',
      'spinner',
      'tabs',
      'tag',
      'toast',
      'tooltip',
    ],
    fora: [],
  },
  exclusivos: [],
  regras: [],
} as const satisfies ArgDesignSystem;
