import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import {
  ARG_BRAND_COLORS,
  ARG_BRAND_ROLES,
  ARG_DEFAULT_STYLE,
  ARG_DESIGN_SYSTEMS,
  ARG_MIN_SURFACE_OPACITY,
  ARG_PALETTES,
  ARG_SEGMENTS,
  ArgBackgroundName,
  ArgBrandColor,
  ArgBrandRole,
  ArgColorScheme,
  ArgColors,
  ArgPalette,
  ArgStyle,
  ArgTheme,
} from '@brunomonfardini/ui';
import { filter } from 'rxjs';
import { readPreference, writePreference } from './preferences';

export const SCHEME_KEY = 'argila-docs:tema';
export const STYLE_KEY = 'argila-docs:estilo';
export const PALETTE_KEY = 'argila-docs:paleta';
export const OPACITY_KEY = 'argila-docs:opacidade';
export const COLORS_KEY = 'argila-docs:cores';
export const SEGMENT_KEY = 'argila-docs:segmento';
export const BACKGROUND_KEY = 'argila-docs:fundo';

/** Nomes das escolhas na URL: `?ds=punk&paleta=viva&modo=dark`. */
export const THEME_PARAMS = {
  style: 'ds',
  palette: 'paleta',
  scheme: 'modo',
  opacity: 'opacidade',
  background: 'fundo',
  segment: 'segmento',
} as const;

/** Cores na URL, por papel: `?primaria=cobre&destaque=mostarda`. */
export const COLOR_PARAMS = {
  primary: 'primaria',
  secondary: 'secundaria',
  accent: 'destaque',
} as const satisfies Record<ArgBrandRole, string>;

const ROLE_LABELS: Record<ArgBrandRole, string> = {
  primary: 'primária',
  secondary: 'secundária',
  accent: 'destaque',
};

const ALL_PARAMS = [...Object.values(THEME_PARAMS), ...Object.values(COLOR_PARAMS)];
const SCHEMES: readonly ArgColorScheme[] = ['light', 'dark', 'auto'];

/** As escolhas de tema, como vêm da URL ou do navegador (texto, ainda sem validar). */
type RawChoices = Partial<Record<(typeof ALL_PARAMS)[number], string>>;

const asOptions = <T extends string>(values: readonly T[]) => values.map((value) => ({ value }));

/**
 * Estado do tema do catálogo: design system, paleta, modo, transparência,
 * cores e segmento de exemplo. Aplica no `ArgTheme` (o mesmo código dos
 * produtos), guarda no navegador e na URL, para o link reproduzir a
 * combinação. Um link com escolha inválida cai no padrão do DS, com aviso.
 */
@Injectable({ providedIn: 'root' })
export class DocThemeChoices {
  private readonly theme = inject(ArgTheme);
  private readonly router = inject(Router);
  private readonly location = inject(DOCUMENT).location;
  private readonly segments = inject(ARG_SEGMENTS);
  private restored = false;
  /** Modo com que a página abriu (o `data-arg-theme` do index.html): o padrão na URL. */
  private readonly baseScheme = this.theme.colorScheme();

  /** Aviso de um link com escolhas que não valem; `undefined` sem aviso. */
  readonly notice = signal<string[] | undefined>(undefined);
  /** O segmento de exemplo aplicado por último, enquanto nada for mudado à mão. */
  readonly segment = signal<string | undefined>(undefined);

  constructor() {
    // Links internos não levam as escolhas: depois de cada navegação, a URL volta a tê-las
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.syncUrl());
  }

  /** Aplica as escolhas do link ou, sem elas, as salvas no navegador. Uma vez só. */
  restore(): void {
    if (this.restored) return;
    this.restored = true;
    const params = new URLSearchParams(this.location?.search ?? '');
    const fromUrl = ALL_PARAMS.some((name) => params.has(name));
    const raw: RawChoices = fromUrl
      ? Object.fromEntries(
          ALL_PARAMS.flatMap((name) => (params.has(name) ? [[name, params.get(name)!]] : [])),
        )
      : this.stored();
    const problems = this.apply(raw);
    if (fromUrl && problems.length) this.notice.set(problems);
    this.save(this.segment());
  }

  dismissNotice(): void {
    this.notice.set(undefined);
  }

  /** Troca o design system e volta à transparência dele. */
  selectStyle(style: ArgStyle): void {
    this.theme.setStyle(style);
    this.theme.clearSurfaceOpacity();
    this.save();
  }

  selectPalette(palette: ArgPalette): void {
    this.theme.setPalette(palette);
    this.save();
  }

  selectScheme(scheme: ArgColorScheme): void {
    this.theme.setColorScheme(scheme);
    this.save();
  }

  /** Opacidade das superfícies, de 0.4 a 1. */
  selectOpacity(opacity: number): void {
    this.theme.setSurfaceOpacity(opacity);
    this.save();
  }

  /** Fundo da página: liso, degradê ou o nativo do DS. */
  selectBackground(background: ArgBackgroundName): void {
    this.theme.setBackground(background);
    this.save();
  }

  /** Cor de marca de um papel; `undefined` volta à cor da paleta. */
  selectColor(role: ArgBrandRole, color: ArgBrandColor | undefined): void {
    const colors: ArgColors = { ...this.theme.colors() };
    if (color) colors[role] = color;
    else delete colors[role];
    this.theme.setColors(colors);
    this.save();
  }

  /** Aplica um segmento de exemplo (`provideArgila`); vazio só esquece o nome. */
  selectSegment(name: string): void {
    if (name) this.theme.setSegment(name);
    this.save(name || undefined);
  }

  private stored(): RawChoices {
    const raw: RawChoices = {};
    const style = readPreference(STYLE_KEY, asOptions(Object.keys(ARG_DESIGN_SYSTEMS)));
    if (style) raw.ds = style;
    const palette = readPreference(PALETTE_KEY, asOptions(ARG_PALETTES));
    if (palette) raw.paleta = palette;
    const scheme = readPreference(SCHEME_KEY, asOptions(SCHEMES));
    if (scheme) raw.modo = scheme;
    const opacity = readText(OPACITY_KEY);
    if (opacity) raw.opacidade = opacity;
    const background = readText(BACKGROUND_KEY);
    if (background) raw.fundo = background;
    const segment = readText(SEGMENT_KEY);
    if (segment) raw.segmento = segment;
    for (const pair of (readText(COLORS_KEY) ?? '').split(',')) {
      const [param, color] = pair.split(':');
      if (param && color && (Object.values(COLOR_PARAMS) as string[]).includes(param)) {
        raw[param as RawChoicesKey] = color;
      }
    }
    return raw;
  }

  /**
   * Aplica as escolhas na ordem em que dependem umas das outras (DS → paleta
   * → modo → cores → transparência → fundo). O que não vale cai no padrão do DS e
   * vira uma frase do aviso.
   */
  private apply(raw: RawChoices): string[] {
    const problems: string[] = [];
    if (raw.segmento && this.segments[raw.segmento]) {
      this.theme.setSegment(raw.segmento);
      this.segment.set(raw.segmento);
      return problems;
    }
    if (raw.segmento) problems.push(`O segmento “${raw.segmento}” não existe.`);

    const style = raw.ds && raw.ds in ARG_DESIGN_SYSTEMS ? (raw.ds as ArgStyle) : undefined;
    if (raw.ds && !style) problems.push(`O design system “${raw.ds}” não existe; usamos o padrão.`);
    this.theme.setStyle(style ?? ARG_DEFAULT_STYLE);
    this.theme.clearSurfaceOpacity();
    const ds = this.theme.designSystem();

    const palettes: readonly string[] = this.theme.palettes();
    if (raw.paleta && !palettes.includes(raw.paleta)) {
      problems.push(`O ${ds.nome} não aceita a paleta “${raw.paleta}”; usamos a padrão dele.`);
    }
    this.theme.setPalette(
      (raw.paleta && palettes.includes(raw.paleta) ? raw.paleta : palettes[0]) as ArgPalette,
    );

    const scheme = SCHEMES.find((value) => value === raw.modo);
    const schemes: readonly string[] = this.theme.schemes();
    const fits = scheme === 'auto' ? schemes.length > 1 : scheme && schemes.includes(scheme);
    if (raw.modo && !fits) problems.push(`O ${ds.nome} não tem o modo “${raw.modo}”.`);
    // Sem modo pedido, fica o atual (o do <html>), ajustado ao que o DS tem
    this.theme.setColorScheme(fits && scheme ? scheme : this.theme.colorScheme());

    const colors: ArgColors = {};
    for (const role of ARG_BRAND_ROLES) {
      const color = raw[COLOR_PARAMS[role] as RawChoicesKey];
      if (!color) continue;
      if ((this.theme.allowedColors()[role] as readonly string[]).includes(color)) {
        colors[role] = color as ArgBrandColor;
      } else {
        const name = ARG_BRAND_COLORS[color as ArgBrandColor]?.nome ?? color;
        problems.push(
          `A cor “${name}” não vale como ${ROLE_LABELS[role]} aqui; usamos a da paleta.`,
        );
      }
    }
    this.theme.setColors(colors);

    const opacity = Number(raw.opacidade);
    if (raw.opacidade && !this.theme.acceptsTransparency()) {
      problems.push(`O ${ds.nome} não aceita transparência.`);
    } else if (raw.opacidade && opacity >= ARG_MIN_SURFACE_OPACITY * 100 && opacity <= 100) {
      this.theme.setSurfaceOpacity(opacity / 100);
    } else if (raw.opacidade) {
      problems.push(`A opacidade “${raw.opacidade}” não vale; usamos a do design system.`);
    }

    const backgrounds: readonly string[] = this.theme.backgrounds();
    if (raw.fundo && !backgrounds.includes(raw.fundo)) {
      problems.push(`O ${ds.nome} não aceita o fundo “${raw.fundo}”; usamos o liso.`);
    }
    this.theme.setBackground(
      (raw.fundo && backgrounds.includes(raw.fundo)
        ? raw.fundo
        : backgrounds[0]) as ArgBackgroundName,
    );
    return problems;
  }

  /** O estado atual em parâmetros da URL: só o que difere do padrão do DS. */
  private params(): Params {
    const segment = this.segment();
    if (segment) return { [THEME_PARAMS.segment]: segment };
    const params: Params = {};
    const style = this.theme.style();
    if (style !== ARG_DEFAULT_STYLE) params[THEME_PARAMS.style] = style;
    if (this.theme.palette() !== this.theme.palettes()[0]) {
      params[THEME_PARAMS.palette] = this.theme.palette();
    }
    // O modo de abertura, se o DS o tiver; num DS de um modo só, esse modo
    const schemes: readonly string[] = this.theme.schemes();
    const defaultScheme =
      this.baseScheme === 'auto'
        ? schemes.length > 1
          ? 'auto'
          : schemes[0]
        : schemes.includes(this.baseScheme)
          ? this.baseScheme
          : schemes[0];
    if (this.theme.colorScheme() !== defaultScheme) {
      params[THEME_PARAMS.scheme] = this.theme.colorScheme();
    }
    const opacity = this.theme.surfaceOpacity();
    if (opacity !== undefined) params[THEME_PARAMS.opacity] = String(Math.round(opacity * 100));
    if (this.theme.background() !== this.theme.backgrounds()[0]) {
      params[THEME_PARAMS.background] = this.theme.background();
    }
    for (const role of ARG_BRAND_ROLES) {
      const color = this.theme.colors()[role];
      if (color) params[COLOR_PARAMS[role]] = color;
    }
    return params;
  }

  /** Guarda no navegador e na URL. `segment` é o nome do segmento aplicado agora, se houver. */
  private save(segment?: string): void {
    this.segment.set(segment);
    const opacity = this.theme.surfaceOpacity();
    writePreference(STYLE_KEY, this.theme.style());
    writePreference(PALETTE_KEY, this.theme.palette());
    writePreference(SCHEME_KEY, this.theme.colorScheme());
    writePreference(OPACITY_KEY, opacity === undefined ? '' : String(Math.round(opacity * 100)));
    writePreference(SEGMENT_KEY, segment ?? '');
    writePreference(
      BACKGROUND_KEY,
      this.theme.background() === this.theme.backgrounds()[0] ? '' : this.theme.background(),
    );
    writePreference(
      COLORS_KEY,
      ARG_BRAND_ROLES.flatMap((role) => {
        const color = this.theme.colors()[role];
        return color ? [`${COLOR_PARAMS[role]}:${color}`] : [];
      }).join(','),
    );
    this.syncUrl();
  }

  /** Põe as escolhas na URL atual, sem criar entrada nova no histórico. */
  private syncUrl(): void {
    if (!this.restored || !this.router.navigated) return;
    const current = this.router.routerState.snapshot.root.queryParams;
    const wanted = this.params();
    const same = ALL_PARAMS.every((name) => (current[name] ?? undefined) === wanted[name]);
    if (same) return;
    const queryParams: Params = Object.fromEntries(ALL_PARAMS.map((name) => [name, null]));
    void this.router.navigate([], {
      queryParams: { ...queryParams, ...wanted },
      queryParamsHandling: 'merge',
      replaceUrl: true,
      preserveFragment: true,
    });
  }
}

type RawChoicesKey = keyof RawChoices;

function readText(key: string): string | undefined {
  try {
    return localStorage.getItem(key) || undefined;
  } catch {
    return undefined;
  }
}
