import type { ArgDesignSystem } from '../design-system';

/** CODA: pixel em tudo, contornos marcados, rosa e amarelo sobre grafite. */
export const coda = {
  id: 'coda',
  nome: 'CODA',
  modos: ['light', 'dark'],
  transparencia: false,
  paletas: ['nativa', 'viva', 'mono', 'alto-contraste'],
  fontes: { corpo: 'Silkscreen' },
  componentes: { curados: [], fora: [] },
  exclusivos: [],
  regras: [
    'Amarelo só para foco e destaque; rosa para ação',
    'Texto longo de leitura pode usar a mono do sistema em vez da Silkscreen',
  ],
} as const satisfies ArgDesignSystem;
