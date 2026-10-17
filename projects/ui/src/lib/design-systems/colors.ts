/**
 * Lista fixa de cores de marca: as únicas que um produto escolhe para a
 * primária, a secundária e o destaque (`setColors` ou `data-arg-primary`…).
 *
 * Cada cor tem o valor no claro e no escuro, e o texto por cima de cada um.
 * O CSS (`tokens/colors.css`) e a lista do que cada design system × paleta
 * aceita (`colors.generated.ts`) saem daqui, pelo `pnpm colors`: uma cor que
 * perde contraste numa combinação não é oferecida nela.
 */

export interface ArgBrandColorInfo {
  /** Nome para pessoas. */
  readonly nome: string;
  readonly claro: string;
  readonly escuro: string;
  /** Texto sobre a cor, no claro e no escuro. */
  readonly sobreClaro: string;
  readonly sobreEscuro: string;
}

export const ARG_BRAND_COLORS = {
  cobre: {
    nome: 'Cobre',
    claro: '#9a4f24',
    escuro: '#f0b48a',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2b1407',
  },
  caramelo: {
    nome: 'Caramelo',
    claro: '#8a5a1c',
    escuro: '#e8c08a',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2a1a06',
  },
  terracota: {
    nome: 'Terracota',
    claro: '#a3432a',
    escuro: '#f2a58e',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2e0f07',
  },
  oliva: {
    nome: 'Oliva',
    claro: '#5c6b1f',
    escuro: '#c8d48a',
    sobreClaro: '#ffffff',
    sobreEscuro: '#1c2206',
  },
  musgo: {
    nome: 'Musgo',
    claro: '#3f6b3a',
    escuro: '#a9d6a2',
    sobreClaro: '#ffffff',
    sobreEscuro: '#10240e',
  },
  petroleo: {
    nome: 'Petróleo',
    claro: '#0b5e6b',
    escuro: '#7fd0dc',
    sobreClaro: '#ffffff',
    sobreEscuro: '#052329',
  },
  ardosia: {
    nome: 'Ardósia',
    claro: '#4a5a6a',
    escuro: '#c2cfdb',
    sobreClaro: '#ffffff',
    sobreEscuro: '#141c24',
  },
  anil: {
    nome: 'Anil',
    claro: '#3346a8',
    escuro: '#a9b6f5',
    sobreClaro: '#ffffff',
    sobreEscuro: '#0d1438',
  },
  ameixa: {
    nome: 'Ameixa',
    claro: '#6e2d6a',
    escuro: '#e0a8dc',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2a0a28',
  },
  vinho: {
    nome: 'Vinho',
    claro: '#8a1f3d',
    escuro: '#f2a0b6',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2e0612',
  },
  coral: {
    nome: 'Coral',
    claro: '#b03f3a',
    escuro: '#f7a59c',
    sobreClaro: '#ffffff',
    sobreEscuro: '#330d0a',
  },
  mostarda: {
    nome: 'Mostarda',
    claro: '#7a5c00',
    escuro: '#f0d060',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2a2000',
  },
  grafite: {
    nome: 'Grafite',
    claro: '#333333',
    escuro: '#d0d0d0',
    sobreClaro: '#ffffff',
    sobreEscuro: '#111111',
  },
  areia: {
    nome: 'Areia',
    claro: '#7a6548',
    escuro: '#e2d2b6',
    sobreClaro: '#ffffff',
    sobreEscuro: '#2a2014',
  },
  menta: {
    nome: 'Menta',
    claro: '#1d7357',
    escuro: '#8fe0c0',
    sobreClaro: '#ffffff',
    sobreEscuro: '#0b2a20',
  },
  lavanda: {
    nome: 'Lavanda',
    claro: '#5d4aa0',
    escuro: '#c9bdf2',
    sobreClaro: '#ffffff',
    sobreEscuro: '#1c1438',
  },
} as const satisfies Record<string, ArgBrandColorInfo>;

export type ArgBrandColor = keyof typeof ARG_BRAND_COLORS;

/** Papéis que uma cor de marca pode ocupar. */
export const ARG_BRAND_ROLES = ['primary', 'secondary', 'accent'] as const;
export type ArgBrandRole = (typeof ARG_BRAND_ROLES)[number];
