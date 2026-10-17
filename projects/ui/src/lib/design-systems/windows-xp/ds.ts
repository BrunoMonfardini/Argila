import type { ArgDesignSystem } from '../design-system';

/** Windows XP: sistema operacional retrô, janelas com barra de título e bordas de 1px. */
export const windowsXp = {
  id: 'windows-xp',
  nome: 'Windows XP',
  referencia: 'windows-xp.jpg',
  modos: ['light', 'dark'],
  transparencia: false,
  paletas: ['nativa', 'terrosa'],
  componentes: { curados: [], fora: [] },
  exclusivos: [],
  regras: ['Uma só cor de destaque', 'Nada de sombra pesada', 'Bordas sempre de 1px'],
} as const satisfies ArgDesignSystem;
