import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

export type ArgColorScheme = 'light' | 'dark' | 'auto';

/** Estilo: a forma (raio, borda, sombra, fonte), em `tokens/styles/`. */
export type ArgStyle = 'argila' | 'molde' | 'coda' | 'transparente' | 'windows-xp';

/** Paleta: as cores, em `tokens/palettes/`. `nativa` é a paleta própria do estilo. */
export type ArgPalette = 'nativa' | 'terrosa';

export interface ArgStyleInfo {
  /** Modos de cor que o estilo suporta; o primeiro é o padrão. */
  schemes: readonly Exclude<ArgColorScheme, 'auto'>[];
}

export const ARG_STYLES: Readonly<Record<ArgStyle, ArgStyleInfo>> = {
  argila: { schemes: ['light', 'dark'] },
  molde: { schemes: ['light', 'dark'] },
  coda: { schemes: ['light', 'dark'] },
  transparente: { schemes: ['light', 'dark'] },
  'windows-xp': { schemes: ['light', 'dark'] },
};

export const ARG_PALETTES: readonly ArgPalette[] = ['nativa', 'terrosa'];

function readStyle(root: HTMLElement): ArgStyle {
  const value = root.getAttribute('data-arg-style');
  return value !== null && Object.hasOwn(ARG_STYLES, value) ? (value as ArgStyle) : 'argila';
}

function readPalette(root: HTMLElement): ArgPalette {
  const value = root.getAttribute('data-arg-palette') as ArgPalette;
  return ARG_PALETTES.includes(value) ? value : 'nativa';
}

/**
 * Personalização de um produto ou tenant. Cada campo sobrescreve um token
 * semântico; estados derivados (hover, pressed, subtle) acompanham sozinhos.
 */
export interface ArgBrand {
  /** Cor principal da marca, ex.: '#1d4f91'. */
  primary?: string;
  /** Cor do texto sobre a cor principal. Garanta contraste mínimo de 4.5:1. */
  onPrimary?: string;
  /** Cor secundária: botão secundário, tag selecionada, aba ativa. */
  secondary?: string;
  /** Cor do texto sobre a secundária. Garanta contraste mínimo de 4.5:1. */
  onSecondary?: string;
  /** Cor de destaque: badge, progresso, passo atual. */
  accent?: string;
  /** Cor do texto sobre o destaque. Garanta contraste mínimo de 4.5:1. */
  onAccent?: string;
  /** Raio de botões e campos, ex.: '9999px' para formato pílula. */
  radiusControl?: string;
  /** Raio de cards, modais e outros contêineres. */
  radiusContainer?: string;
  /** Família tipográfica. A fonte precisa ser carregada pelo produto. */
  fontFamily?: string;
  /** Família tipográfica dos títulos; sem ela, os títulos usam `fontFamily`. */
  fontFamilyHeading?: string;
}

const BRAND_TOKENS: Record<keyof ArgBrand, string> = {
  primary: '--arg-color-primary',
  onPrimary: '--arg-color-on-primary',
  secondary: '--arg-color-secondary',
  onSecondary: '--arg-color-on-secondary',
  accent: '--arg-color-accent',
  onAccent: '--arg-color-on-accent',
  radiusControl: '--arg-radius-control',
  radiusContainer: '--arg-radius-container',
  fontFamily: '--arg-font-family',
  fontFamilyHeading: '--arg-font-family-heading',
};

/** Opacidade mínima das superfícies: abaixo dela o texto pode perder contraste. */
export const ARG_MIN_SURFACE_OPACITY = 0.4;

/**
 * Aplica tema em tempo de execução no <html>: estilo, paleta, modo
 * claro/escuro, transparência e a marca do tenant (ex.: carregada da tabela
 * `tenants` após o login).
 */
@Injectable({ providedIn: 'root' })
export class ArgTheme {
  private readonly root = inject(DOCUMENT).documentElement;

  private readonly _colorScheme = signal<ArgColorScheme>(
    (this.root.getAttribute('data-arg-theme') as ArgColorScheme | null) ?? 'light',
  );
  readonly colorScheme = this._colorScheme.asReadonly();

  private readonly _style = signal(readStyle(this.root));
  readonly style = this._style.asReadonly();
  /** Modos de cor que o estilo atual suporta. */
  readonly schemes = computed(() => ARG_STYLES[this._style()].schemes);

  private readonly _palette = signal(readPalette(this.root));
  readonly palette = this._palette.asReadonly();

  /**
   * Muda o modo de cor. Um modo que o estilo atual não suporta vira o modo
   * padrão do estilo; `auto` só vale quando o estilo tem claro e escuro.
   */
  setColorScheme(scheme: ArgColorScheme): void {
    const supported = this.schemes();
    const fits = scheme === 'auto' ? supported.length > 1 : supported.includes(scheme);
    const value = fits ? scheme : supported[0];
    this.root.setAttribute('data-arg-theme', value);
    this._colorScheme.set(value);
  }

  /** Troca o estilo, mantendo a paleta; ajusta o modo se o estilo não o suportar. */
  setStyle(style: ArgStyle): void {
    this.root.setAttribute('data-arg-style', style);
    this._style.set(style);
    this.setColorScheme(this._colorScheme());
  }

  /** Troca a paleta; `nativa` volta às cores próprias do estilo. */
  setPalette(palette: ArgPalette): void {
    this.root.setAttribute('data-arg-palette', palette);
    this._palette.set(palette);
  }

  /** Substitui a marca atual; campos omitidos voltam ao padrão do Argila. */
  setBrand(brand: ArgBrand): void {
    for (const [key, token] of Object.entries(BRAND_TOKENS) as [keyof ArgBrand, string][]) {
      const value = brand[key];
      if (value) {
        this.root.style.setProperty(token, value);
      } else {
        this.root.style.removeProperty(token);
      }
    }
  }

  clearBrand(): void {
    this.setBrand({});
  }

  private readonly _surfaceOpacity = signal<number | undefined>(undefined);
  /** Opacidade escolhida; `undefined` quando vale a do estilo (1 na maioria). */
  readonly surfaceOpacity = this._surfaceOpacity.asReadonly();

  /**
   * Opacidade de cards, diálogos, campos e demais superfícies, de 0.4 a 1.
   * Valores fora da faixa são presos aos limites.
   */
  setSurfaceOpacity(opacity: number): void {
    const value = Math.min(1, Math.max(ARG_MIN_SURFACE_OPACITY, opacity));
    this.root.style.setProperty('--arg-surface-opacity', String(value));
    this._surfaceOpacity.set(value);
  }

  /** Volta à opacidade definida pelo estilo. */
  clearSurfaceOpacity(): void {
    this.root.style.removeProperty('--arg-surface-opacity');
    this._surfaceOpacity.set(undefined);
  }
}
