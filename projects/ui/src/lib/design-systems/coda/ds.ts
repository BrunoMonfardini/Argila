import type { ArgDesignSystem } from '../design-system';

/** CODA: pixel em tudo, contornos marcados, rosa e amarelo sobre grafite. */
export const coda = {
  id: 'coda',
  nome: 'CODA',
  linguagem:
    'Pixel em tudo: fonte bitmap, contornos marcados de 2px e rosa e amarelo sobre grafite.',
  modos: ['light', 'dark'],
  transparencia: false,
  fundos: ['liso', 'degrade'],
  paletas: ['nativa', 'viva', 'mono', 'alto-contraste'],
  fontes: { corpo: 'Silkscreen' },
  componentes: {
    nucleoMinimo: true,
    curados: [],
    fora: [],
  },
  exclusivos: [],
  regras: [
    'Amarelo só para foco e destaque; rosa para ação',
    'Texto longo de leitura pode usar a mono do sistema em vez da Silkscreen',
  ],
} as const satisfies ArgDesignSystem;
