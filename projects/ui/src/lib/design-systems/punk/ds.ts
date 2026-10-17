import type { ArgDesignSystem } from '../design-system';

/** Punk: fundo preto, cards de cor chapada em néon, pílulas brancas e títulos pesados. */
export const punk = {
  id: 'punk',
  nome: 'Punk',
  referencia: 'punk.jpg',
  // Só escuro: a referência inteira é escura, e um claro inventado desviaria dela (PK-04)
  modos: ['dark'],
  transparencia: false,
  paletas: ['nativa', 'viva', 'alto-contraste'],
  fontes: { titulo: 'Unbounded' },
  componentes: {
    // O núcleo mínimo e os curados da matriz (3.5): o manifesto só importa tipos, por isso a lista
    curados: [
      'agenda',
      'alert',
      'avatar',
      'badge',
      'button',
      'card',
      'choice',
      'date-picker',
      'dialog',
      'divider',
      'drawer',
      'empty-state',
      'field',
      'icon-button',
      'input',
      'link',
      'list',
      'progress-bar',
      'select',
      'spinner',
      'table',
      'tabs',
      'tag',
      'time-slots',
      'toast',
      'tooltip',
    ],
    fora: ['breadcrumb', 'pagination'],
  },
  exclusivos: ['punk-stat-card', 'punk-dot-track', 'punk-burst'],
  prefixo: 'punk',
  regras: [
    'Texto sobre card colorido sempre preto',
    'No máximo três cores de card por tela',
    'A estrela só como ornamento, nunca como ícone de ação',
  ],
} as const satisfies ArgDesignSystem;
