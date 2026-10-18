import type { ArgDesignSystem } from '../design-system';

/** Windows XP: sistema operacional retrô ("Retro-OS UI Kit"), janelas com barra de título e bordas de 1px. */
export const windowsXp = {
  id: 'windows-xp',
  nome: 'Windows XP',
  referencia: 'windows-xp.jpg',
  modos: ['light', 'dark'],
  transparencia: false,
  paletas: ['nativa', 'alto-contraste'],
  fontes: { titulo: 'Pixelify Sans' },
  componentes: {
    // O núcleo mínimo, o Menu e os ícones em pixel: o manifesto só importa tipos, por isso a lista
    curados: [
      'alert',
      'badge',
      'button',
      'card',
      'choice',
      'dialog',
      'divider',
      'empty-state',
      'field',
      'icon',
      'icon-button',
      'input',
      'link',
      'menu',
      'progress-bar',
      'select',
      'spinner',
      'tabs',
      'tag',
      'toast',
      'tooltip',
    ],
    fora: ['agenda', 'drawer', 'time-slots'],
  },
  exclusivos: ['xp-window', 'xp-balloon'],
  prefixo: 'xp',
  regras: ['Uma só cor de destaque', 'Nada de sombra pesada', 'Bordas sempre de 1px'],
} as const satisfies ArgDesignSystem;
