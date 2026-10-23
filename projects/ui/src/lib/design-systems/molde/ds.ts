import type { ArgDesignSystem } from '../design-system';

/** Molde: ponto de partida neutro para criar um DS novo. Não é oferecido aos produtos. */
export const molde = {
  id: 'molde',
  nome: 'Molde',
  linguagem:
    'Ponto de partida neutro para criar um design system novo: plano, cinza e sem personalidade de propósito.',
  modos: ['light', 'dark'],
  transparencia: true,
  fundos: ['liso', 'degrade', 'imagem'],
  paletas: ['nativa', 'terrosa'],
  componentes: { curados: [], fora: [] },
  exclusivos: [],
  regras: [],
  interno: true,
} as const satisfies ArgDesignSystem;
