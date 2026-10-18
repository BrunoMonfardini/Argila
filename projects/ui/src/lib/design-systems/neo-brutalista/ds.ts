import type { ArgDesignSystem } from '../design-system';

/** Neo-brutalista: traço preto grosso, cantos retos, sombra dura e blocos de cor chapada. */
export const neoBrutalista = {
  id: 'neo-brutalista',
  nome: 'Neo-brutalista',
  linguagem:
    '"Bold. Loud. Systematic. Usable.": traço preto grosso, cantos retos, sombra dura deslocada e blocos de cor chapada com texto preto.',
  referencia: 'neo-brutalista.jpg',
  modos: ['light', 'dark'],
  transparencia: false,
  paletas: ['nativa', 'pastel', 'mono', 'alto-contraste'],
  fontes: { titulo: 'Archivo Black', corpo: 'Archivo' },
  componentes: {
    nucleoMinimo: true,
    curados: ['avatar', 'breadcrumb', 'list', 'pagination', 'stepper', 'table'],
    fora: [],
  },
  exclusivos: ['nb-sticker', 'nb-rules'],
  prefixo: 'nb',
  regras: [
    'Um único botão primário por tela',
    'Foco sempre visível',
    'Alvo mínimo de 44px',
    'Texto sobre bloco colorido sempre preto',
  ],
} as const satisfies ArgDesignSystem;
