import type { ArgDesignSystem } from '../design-system';

/** Transparente: vidro espesso, translúcido, com aro claro e brilho. */
export const transparente = {
  id: 'transparente',
  nome: 'Transparente',
  referencia: 'transparente.jpg',
  modos: ['light', 'dark'],
  transparencia: true,
  paletas: ['nativa', 'oceano', 'terrosa', 'mono'],
  componentes: {
    // O núcleo mínimo e os painéis da matriz (3.5): o manifesto só importa tipos, por isso a lista
    curados: [
      'alert',
      'badge',
      'button',
      'card',
      'choice',
      'combobox',
      'dialog',
      'divider',
      'drawer',
      'empty-state',
      'field',
      'icon-button',
      'input',
      'link',
      'menu',
      'popover',
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
  regras: [
    'Vidro sempre sobre fundo com conteúdo ou textura: sobre branco liso ele some',
    'No máximo um botão colorido por grupo',
    'Texto nunca diretamente sobre a borda iridescente',
  ],
} as const satisfies ArgDesignSystem;
