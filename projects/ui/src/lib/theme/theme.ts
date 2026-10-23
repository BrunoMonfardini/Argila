import { DOCUMENT, Injectable, computed, inject, isDevMode, signal } from '@angular/core';
import {
  ARG_DEFAULT_STYLE,
  backgroundsOf,
  type ArgBackgroundName,
  type ArgDesignSystem,
} from '../design-systems/design-system';
export {
  ARG_SHARED_PALETTES,
  type ArgPaletteName,
  type ArgSharedPalette,
  type ArgSharedPaletteInfo,
} from '../design-systems/palettes';
import { ARG_DESIGN_SYSTEMS, ArgPalette, ArgStyle } from '../design-systems/design-systems';
import {
  ARG_BRAND_COLORS,
  ARG_BRAND_ROLES,
  type ArgBrandColor,
  type ArgBrandRole,
} from '../design-systems/colors';
import { ARG_ALLOWED_COLORS } from '../design-systems/colors.generated';
import { ARG_SEGMENTS, argBackgroundPhoto, argBackgroundVeil } from './segments';

export {
  ARG_BRAND_COLORS,
  ARG_BRAND_ROLES,
  type ArgBrandColor,
  type ArgBrandColorInfo,
  type ArgBrandRole,
} from '../design-systems/colors';
export { ARG_ALLOWED_COLORS } from '../design-systems/colors.generated';

/** Cores de marca da lista fixa, por papel: `{ primary: 'cobre', accent: 'mostarda' }`. */
export type ArgColors = Partial<Record<ArgBrandRole, ArgBrandColor>>;

export type { ArgPalette, ArgPaletteOf, ArgStyle } from '../design-systems/design-systems';
export { ARG_DESIGN_SYSTEMS } from '../design-systems/design-systems';
export {
  ARG_COMPONENTS,
  ARG_DEFAULT_STYLE,
  ARG_CORE_MINIMUM,
  backgroundsOf,
  curatedComponents,
  type ArgBackgroundName,
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
    : ARG_DEFAULT_STYLE;
}

function readPalette(root: HTMLElement, style: ArgStyle): ArgPalette {
  const value = root.getAttribute('data-arg-palette');
  const accepted: readonly string[] = designSystem(style).paletas;
  return (value !== null && accepted.includes(value) ? value : accepted[0]) as ArgPalette;
}

function readBackground(root: HTMLElement, style: ArgStyle): ArgBackgroundName {
  const value = root.getAttribute('data-arg-background');
  const accepted: readonly string[] = backgroundsOf(designSystem(style));
  return (value !== null && accepted.includes(value) ? value : accepted[0]) as ArgBackgroundName;
}

function readColors(root: HTMLElement): ArgColors {
  const colors: ArgColors = {};
  for (const role of ARG_BRAND_ROLES) {
    const value = root.getAttribute(`data-arg-${role}`);
    if (value !== null && Object.hasOwn(ARG_BRAND_COLORS, value)) {
      colors[role] = value as ArgBrandColor;
    }
  }
  return colors;
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
  /** Fundos que o design system atual aceita; o primeiro é o padrão. */
  readonly backgrounds = computed(() => backgroundsOf(this.designSystem()));

  private readonly _background = signal(readBackground(this.root, this._style()));
  /** Fundo da página: liso, degradê ou o nativo do DS. */
  readonly background = this._background.asReadonly();

  private readonly _palette = signal(readPalette(this.root, this._style()));

  private readonly segments = inject(ARG_SEGMENTS);
  private readonly _segment = signal(this.root.getAttribute('data-arg-segment') ?? undefined);
  /** Segmento aplicado por último com `setSegment`. */
  readonly segment = this._segment.asReadonly();

  private readonly _colors = signal<ArgColors>(readColors(this.root));
  /** Cores de marca aplicadas, por papel. */
  readonly colors = this._colors.asReadonly();
  /** Cores da lista fixa que passam no contraste no design system e na paleta atuais. */
  readonly allowedColors = computed(
    (): Readonly<Record<ArgBrandRole, readonly ArgBrandColor[]>> =>
      ARG_ALLOWED_COLORS[this._style()]?.[this._palette()] ?? {
        primary: [],
        secondary: [],
        accent: [],
      },
  );
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
    // O fundo padrão do DS anterior vira o padrão do novo (o liso do Argila, as linhas do XP)
    const wasDefaultBackground = this._background() === this.backgrounds()[0];
    this.root.setAttribute('data-arg-style', style);
    this._style.set(style);
    this.setColorScheme(this._colorScheme());
    if (!this.palettes().includes(this._palette())) {
      warn(`o design system "${style}" não aceita a paleta "${this._palette()}"; voltou à padrão.`);
      this.setPalette(this.palettes()[0]);
    }
    // A paleta pode não ter mudado: as cores ainda precisam valer no design system novo
    this.setColors(this._colors());
    if (!this.acceptsTransparency() && this._surfaceOpacity() !== undefined) {
      warn(
        `o design system "${style}" não aceita transparência; as superfícies voltaram a opacas.`,
      );
      this.clearSurfaceOpacity();
    }
    if (wasDefaultBackground) {
      this.setBackground(this.backgrounds()[0]);
    } else if (!this.backgrounds().includes(this._background())) {
      warn(
        `o design system "${style}" não aceita o fundo "${this._background()}"; voltou ao padrão.`,
      );
      this.setBackground(this.backgrounds()[0]);
    } else {
      // O atributo depende do padrão do DS: reaplica o fundo escolhido no DS novo
      this.setBackground(this._background());
    }
  }

  /**
   * Troca o fundo da página. Um fundo que o design system atual não aceita
   * vira o padrão dele, com aviso em desenvolvimento. O padrão do DS tira o
   * atributo (o CSS do DS já o aplica); os outros vão em `data-arg-background`.
   * O `imagem` precisa de `setBackgroundImage` antes; sem imagem, vira o
   * `degrade`, também com aviso.
   */
  setBackground(background: ArgBackgroundName): void {
    const accepted = this.backgrounds();
    let value = accepted.includes(background) ? background : accepted[0];
    if (value !== background) {
      warn(
        `o design system "${this._style()}" não aceita o fundo "${background}"; usando "${value}".`,
      );
    }
    if (value === 'imagem' && !this._backgroundImage()) {
      warn('o fundo "imagem" precisa de setBackgroundImage antes; usando "degrade".');
      value = 'degrade';
    }
    if (value === accepted[0]) this.root.removeAttribute('data-arg-background');
    else this.root.setAttribute('data-arg-background', value);
    this._background.set(value);
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
    this.setColors(this._colors());
  }

  /**
   * Aplica cores de marca da lista fixa (`ARG_BRAND_COLORS`) à primária, à
   * secundária e ao destaque. Só valem as que passam no contraste no design
   * system e na paleta atuais (`allowedColors()`); as outras são ignoradas,
   * com aviso em desenvolvimento. Papéis omitidos voltam à cor da paleta.
   */
  setColors(colors: ArgColors): void {
    const applied: ArgColors = {};
    for (const role of ARG_BRAND_ROLES) {
      const color = colors[role];
      if (color && !this.allowedColors()[role].includes(color)) {
        warn(
          `a cor "${color}" não passa no contraste como ${role} em "${this._style()}" com a paleta "${this._palette()}"; usando a da paleta.`,
        );
      }
      if (color && this.allowedColors()[role].includes(color)) {
        this.root.setAttribute(`data-arg-${role}`, color);
        applied[role] = color;
      } else {
        this.root.removeAttribute(`data-arg-${role}`);
      }
    }
    this._colors.set(applied);
  }

  /** Volta às cores da paleta. */
  clearColors(): void {
    this.setColors({});
  }

  /**
   * Aplica de uma vez um segmento declarado em `provideArgila`: design
   * system, paleta (ou a padrão dele), cores, modo, transparência e fundo. Um nome
   * que não foi declarado é ignorado, com aviso em desenvolvimento.
   */
  setSegment(name: string): void {
    const segment = this.segments[name];
    if (!segment) {
      warn(`o segmento "${name}" não foi declarado em provideArgila.`);
      return;
    }
    // Direto, sem o setStyle: a paleta e as cores anteriores vão ser trocadas de qualquer jeito
    this.clearColors();
    this.root.setAttribute('data-arg-style', segment.style);
    this._style.set(segment.style);
    this.setPalette((segment.palette ?? this.palettes()[0]) as ArgPalette);
    this.setColorScheme(segment.scheme ?? this._colorScheme());
    if (segment.surfaceOpacity === undefined) this.clearSurfaceOpacity();
    else this.setSurfaceOpacity(segment.surfaceOpacity);
    // A imagem antes do fundo: o 'imagem' sem imagem vira o degradê
    this.setBackgroundImage(segment.backgroundImage);
    if (segment.backgroundVeil === undefined) this.clearBackgroundVeil();
    else this.setBackgroundVeil(segment.backgroundVeil);
    this.setBackgroundMotion(segment.backgroundMotion ?? false);
    this.setBackground(segment.background ?? this.backgrounds()[0]);
    this.setColors(segment.colors ?? {});
    this.root.setAttribute('data-arg-segment', name);
    this._segment.set(name);
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

  private readonly _backgroundImage = signal<string | undefined>(undefined);
  /** Imagem do fundo `imagem`; `undefined` sem imagem. */
  readonly backgroundImage = this._backgroundImage.asReadonly();

  /**
   * Imagem do fundo `imagem`, como `'assets/fundo.jpg'`, em
   * `--arg-background-photo`. Sem URL, tira a imagem; se o fundo era o
   * `imagem`, ele vira o `degrade`.
   */
  setBackgroundImage(url: string | undefined): void {
    if (url) this.root.style.setProperty('--arg-background-photo', argBackgroundPhoto(url));
    else this.root.style.removeProperty('--arg-background-photo');
    this._backgroundImage.set(url || undefined);
    if (!url && this._background() === 'imagem') this.setBackground('degrade');
  }

  private readonly _backgroundVeil = signal<number | undefined>(undefined);
  /** Opacidade do véu escolhida; `undefined` quando vale o véu padrão. */
  readonly backgroundVeil = this._backgroundVeil.asReadonly();

  /**
   * Opacidade do véu sobre a imagem, de 0 a 1 (presa aos limites). O véu
   * padrão passa no contraste com qualquer imagem; um mais fino só vale para
   * a imagem para a qual foi calculado (o Montar tema do catálogo calcula).
   */
  setBackgroundVeil(opacity: number): void {
    const value = Math.min(1, Math.max(0, opacity));
    this.root.style.setProperty('--arg-background-veil', argBackgroundVeil(value));
    this._backgroundVeil.set(value);
  }

  /** Volta ao véu padrão. */
  clearBackgroundVeil(): void {
    this.root.style.removeProperty('--arg-background-veil');
    this._backgroundVeil.set(undefined);
  }

  private readonly _backgroundMotion = signal(this.root.hasAttribute('data-arg-background-motion'));
  /** As manchas do fundo se movem? */
  readonly backgroundMotion = this._backgroundMotion.asReadonly();

  /**
   * Liga ou desliga o movimento das manchas do `degrade` e do `imagem`
   * (`data-arg-background-motion`). Com movimento reduzido no sistema, elas
   * ficam paradas de qualquer jeito.
   */
  setBackgroundMotion(on: boolean): void {
    if (on) this.root.setAttribute('data-arg-background-motion', '');
    else this.root.removeAttribute('data-arg-background-motion');
    this._backgroundMotion.set(on);
  }
}
