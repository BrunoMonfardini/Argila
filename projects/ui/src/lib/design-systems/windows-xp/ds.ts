import type { ArgDesignSystem } from '../design-system';

/** Windows XP: sistema operacional retrô ("Retro-OS UI Kit"), janelas com barra de título e bordas de 1px. */
export const windowsXp = {
  id: 'windows-xp',
  nome: 'Windows XP',
  linguagem:
    'Sistema operacional retrô ("Retro-OS UI Kit"): janelas com barra de título azul, bordas de 1px, botões com bisel e títulos em pixel.',
  referencia: 'windows-xp.jpg',
  modos: ['light', 'dark'],
  transparencia: false,
  // As linhas de varredura são o fundo nativo; o liso fica a uma escolha
  fundos: ['linhas', 'liso'],
  paletas: ['nativa', 'alto-contraste'],
  fontes: { titulo: 'Pixelify Sans' },
  componentes: {
    nucleoMinimo: true,
    curados: ['icon', 'menu'],
    fora: ['agenda', 'drawer', 'time-slots'],
  },
  exclusivos: ['xp-window', 'xp-balloon'],
  prefixo: 'xp',
  regras: ['Uma só cor de destaque', 'Nada de sombra pesada', 'Bordas sempre de 1px'],
} as const satisfies ArgDesignSystem;
