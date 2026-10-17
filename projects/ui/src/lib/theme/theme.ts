import { DOCUMENT, Injectable, computed, inject, isDevMode, signal } from '@angular/core';
import type { ArgDesignSystem } from '../design-systems/design-system';
import { ARG_DESIGN_SYSTEMS, ArgPalette, ArgStyle } from '../design-systems/design-systems';

export type { ArgPalette, ArgPaletteOf, ArgStyle } from '../design-systems/design-systems';
export { ARG_DESIGN_SYSTEMS } from '../design-systems/design-systems';
export {
  ARG_COMPONENTS,
  ARG_CORE_MINIMUM,
  type ArgComponentName,
  type ArgDesignSystem,
  type ArgSchemeName,
} from '../design-systems/design-system';

export type ArgColorScheme = 'light' | 'dark' | 'auto';

export interface ArgStyleInfo {
  /** Modos de cor que o estilo suporta; o primeiro é o padrão. */
  schemes: readonly Exclude<ArgColorScheme, 'auto'>[];
}

const STYLE_NAMES = Object.keys(ARG_DESIGN_SYSTEMS) as ArgStyle[];

const styleInfo = {} as Record<ArgStyle, ArgStyleInfo>;
for (const style of STYLE_NAMES) styleInfo[style] = { schemes: ARG_DESIGN_SYSTEMS[style].modos };

/** @deprecated Use `ARG_DESIGN_SYSTEMS[estilo].modos`. */
export const ARG_STYLES: Readonly<Record<ArgStyle, ArgStyleInfo>> = styleInfo;

/** Todas as paletas que algum design system aceita. */
export const ARG_PALETTES: readonly ArgPalette[] = [
  ...new Set(STYLE_NAMES.flatMap((style) => ARG_DESIGN_SYSTEMS[style].paletas)),
];

/** Lido a cada uso: os testes podem trocar um manifesto. */
const designSystem = (style: ArgStyle): ArgDesignSystem => ARG_DESIGN_SYSTEMS[style];

function readStyle(root: HTMLElement): ArgStyle {
  const value = root.getAttribute('data-arg-style');
  return value !== null && Object.hasOwn(ARG_DESIGN_SYSTEMS, value)
    ? (value as ArgStyle)
    : 'argila';
}

function readPalette(root: HTMLElement, style: ArgStyle): ArgPalette {
  const value = root.getAttribute('data-arg-palette');
  const accepted = designSystem(style).paletas;
  return (value !== null && accepted.includes(value) ? value : accepted[0]) as ArgPalette;
}

function warn(message: string): void {
  if (isDevMode()) console.warn(`[Argila] ${message}`);
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
  /** Manifesto do design system atual. */
  readonly designSystem = computed(() => designSystem(this._style()));
  /** Modos de cor que o design system atual suporta. */
  readonly schemes = computed(() => this.designSystem().modos);
  /** Paletas que o design system atual aceita; a primeira é a padrão. */
  readonly palettes = computed(() => this.designSystem().paletas as readonly ArgPalette[]);
  /** O design system atual aceita o controle de transparência? */
  readonly acceptsTransparency = computed(() => this.designSystem().transparencia);

  private readonly _palette = signal(readPalette(this.root, this._style()));
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

  /**
   * Troca o design system. O que ele não aceita volta ao padrão dele, com
   * aviso em desenvolvimento: a paleta, o modo de cor e a transparência.
   */
  setStyle(style: ArgStyle): void {
    this.root.setAttribute('data-arg-style', style);
    this._style.set(style);
    this.setColorScheme(this._colorScheme());
    if (!this.palettes().includes(this._palette())) {
      warn(`o design system "${style}" não aceita a paleta "${this._palette()}"; voltou à padrão.`);
      this.setPalette(this.palettes()[0]);
    }
    if (!this.acceptsTransparency() && this._surfaceOpacity() !== undefined) {
      warn(
        `o design system "${style}" não aceita transparência; as superfícies voltaram a opacas.`,
      );
      this.clearSurfaceOpacity();
    }
  }

  /**
   * Troca a paleta; `nativa` volta às cores próprias do design system. Uma
   * paleta que o design system atual não aceita vira a padrão dele.
   */
  setPalette(palette: ArgPalette): void {
    const accepted = this.palettes();
    const value = accepted.includes(palette) ? palette : accepted[0];
    if (value !== palette) {
      warn(
        `o design system "${this._style()}" não aceita a paleta "${palette}"; usando "${value}".`,
      );
    }
    this.root.setAttribute('data-arg-palette', value);
    this._palette.set(value);
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
   * Valores fora da faixa são presos aos limites. Ignorada (com aviso em
   * desenvolvimento) quando o design system não aceita transparência.
   */
  setSurfaceOpacity(opacity: number): void {
    if (!this.acceptsTransparency()) {
      warn(`o design system "${this._style()}" não aceita transparência.`);
      return;
    }
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
