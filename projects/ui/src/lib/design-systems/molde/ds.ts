import type { ArgDesignSystem } from '../design-system';

/** Molde: ponto de partida neutro para criar um DS novo. Não é oferecido aos produtos. */
export const molde = {
  id: 'molde',
  nome: 'Molde',
  modos: ['light', 'dark'],
  transparencia: true,
  paletas: ['nativa', 'terrosa'],
  componentes: { curados: [], fora: [] },
  exclusivos: [],
  regras: [],
  interno: true,
} as const satisfies ArgDesignSystem;
