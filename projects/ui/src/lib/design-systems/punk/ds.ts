import type { ArgDesignSystem } from '../design-system';

/** Punk: fundo preto, cards de cor chapada em néon, pílulas brancas e títulos pesados. */
export const punk = {
  id: 'punk',
  nome: 'Punk',
  linguagem:
    'Fundo preto absoluto, cards de cor chapada em néon, pílulas brancas, títulos pesados e a estrela "explosão" como ornamento.',
  referencia: 'punk.jpg',
  // Só escuro: a referência inteira é escura, e um claro inventado desviaria dela
  modos: ['dark'],
  transparencia: false,
  paletas: ['nativa', 'viva', 'alto-contraste'],
  fontes: { titulo: 'Unbounded' },
  componentes: {
    nucleoMinimo: true,
    curados: ['agenda', 'avatar', 'date-picker', 'drawer', 'list', 'table', 'time-slots'],
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
