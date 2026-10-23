import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject } from '@angular/core';
import {
  ARG_BRAND_COLORS,
  ARG_BRAND_ROLES,
  ARG_DESIGN_SYSTEMS,
  ARG_MIN_SURFACE_OPACITY,
  ARG_PALETTES,
  ARG_SEGMENTS,
  ARG_SHARED_PALETTES,
  ArgBackgroundName,
  ArgBrandColor,
  ArgBrandRole,
  ArgButton,
  ArgColorScheme,
  ArgPalette,
  ArgSelect,
  ArgStyle,
  ArgTheme,
} from '@brunomonfardini/ui';
import { DOC_SEGMENT_LABELS } from '../segments';
import { DocThemeChoices } from './theme-choices';

interface Option<T extends string> {
  value: T;
  label: string;
}

const SCHEMES: Option<ArgColorScheme>[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'auto', label: 'Automático' },
];

/** Um por manifesto de design system; o Argila é o padrão. */
const STYLES: Option<ArgStyle>[] = Object.values(ARG_DESIGN_SYSTEMS).map((ds) => ({
  value: ds.id,
  label: ds.id === 'argila' ? `${ds.nome} (padrão)` : ds.nome,
}));

/** Nome de cada paleta: a nativa do estilo e as compartilhadas, do registro do pacote. */
const PALETTE_LABELS: Record<ArgPalette, string> = {
  nativa: 'Nativa do estilo',
  ...Object.fromEntries(Object.entries(ARG_SHARED_PALETTES).map(([id, info]) => [id, info.nome])),
} as Record<ArgPalette, string>;

const PALETTES: Option<ArgPalette>[] = ARG_PALETTES.map((value) => ({
  value,
  label: PALETTE_LABELS[value],
}));

const BACKGROUND_LABELS: Record<ArgBackgroundName, string> = {
  liso: 'Liso',
  degrade: 'Degradê',
  imagem: 'Imagem',
  linhas: 'Linhas',
};

const ROLES: Option<ArgBrandRole>[] = [
  { value: 'primary', label: 'Primária' },
  { value: 'secondary', label: 'Secundária' },
  { value: 'accent', label: 'Destaque' },
];

/** Opacidade mínima em %: abaixo dela o texto perde contraste. */
const MIN_OPACITY = ARG_MIN_SURFACE_OPACITY * 100;

/**
 * Barra de tema do catálogo: design system, paleta, cores, modo,
 * transparência e segmento de exemplo. Só oferece o que o DS escolhido
 * aceita; as escolhas ficam no navegador e na URL (`DocThemeChoices`).
 */
@Component({
  selector: 'doc-theme-bar',
  imports: [ArgButton, ArgSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-bar.html',
  styleUrl: './theme-bar.css',
})
export class DocThemeBar {
  private readonly theme = inject(ArgTheme);
  private readonly choices = inject(DocThemeChoices);
  private readonly root = inject(DOCUMENT).documentElement;

  protected readonly schemes = SCHEMES;
  protected readonly styles = STYLES;
  protected readonly roles = ROLES;
  /** Só as paletas que o design system atual aceita, na ordem do manifesto (a primeira é a padrão). */
  protected readonly palettes = computed(() =>
    this.theme.palettes().map((value) => PALETTES.find((option) => option.value === value)!),
  );
  /** Só os fundos que o design system atual aceita; com um só, o campo some. */
  protected readonly backgrounds = computed(() =>
    this.theme.backgrounds().map((value) => ({ value, label: BACKGROUND_LABELS[value] })),
  );
  protected readonly background = this.theme.background;
  /** Por papel, só as cores da lista fixa que passam no contraste no DS e na paleta atuais. */
  protected readonly colorOptions = computed(() => {
    const allowed = this.theme.allowedColors();
    return Object.fromEntries(
      ARG_BRAND_ROLES.map((role) => [
        role,
        allowed[role].map((value) => ({ value, label: ARG_BRAND_COLORS[value].nome })),
      ]),
    ) as Record<ArgBrandRole, Option<ArgBrandColor>[]>;
  });
  /** Segmentos declarados com `provideArgila`; sem nenhum, o campo some. */
  protected readonly segments: Option<string>[] = Object.keys(inject(ARG_SEGMENTS)).map(
    (value) => ({
      value,
      label: DOC_SEGMENT_LABELS[value as keyof typeof DOC_SEGMENT_LABELS] ?? value,
    }),
  );
  protected readonly segment = this.choices.segment;
  protected readonly colors = this.theme.colors;
  protected readonly acceptsTransparency = this.theme.acceptsTransparency;
  protected readonly minOpacity = MIN_OPACITY;
  protected readonly scheme = this.theme.colorScheme;
  protected readonly style = this.theme.style;
  protected readonly palette = this.theme.palette;
  protected readonly singleScheme = computed(() => this.theme.schemes().length === 1);
  /** Opacidade em %: a escolhida, ou a que o estilo define no CSS (1 na maioria). */
  protected readonly opacity = computed(() => {
    const chosen = this.theme.surfaceOpacity();
    if (chosen !== undefined) return Math.round(chosen * 100);
    this.theme.style();
    const fromStyle = getComputedStyle(this.root).getPropertyValue('--arg-surface-opacity');
    return Math.round((Number.parseFloat(fromStyle) || 1) * 100);
  });

  constructor() {
    this.choices.restore();
  }

  /** O estilo atual tem este modo? `auto` precisa de claro e escuro. */
  protected supports(scheme: ArgColorScheme): boolean {
    const supported = this.theme.schemes();
    return scheme === 'auto' ? supported.length > 1 : supported.includes(scheme);
  }

  protected selectScheme(scheme: ArgColorScheme): void {
    this.choices.selectScheme(scheme);
  }

  protected selectStyle(event: Event): void {
    this.choices.selectStyle(value(event) as ArgStyle);
  }

  protected selectPalette(event: Event): void {
    this.choices.selectPalette(value(event) as ArgPalette);
  }

  protected selectBackground(event: Event): void {
    this.choices.selectBackground(value(event) as ArgBackgroundName);
  }

  protected selectColor(role: ArgBrandRole, event: Event): void {
    this.choices.selectColor(role, (value(event) || undefined) as ArgBrandColor | undefined);
  }

  protected selectOpacity(event: Event): void {
    this.choices.selectOpacity(Number(value(event)) / 100);
  }

  protected selectSegment(event: Event): void {
    this.choices.selectSegment(value(event));
  }
}

function value(event: Event): string {
  return (event.target as HTMLSelectElement | HTMLInputElement).value;
}
