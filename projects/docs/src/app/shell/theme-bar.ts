import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject } from '@angular/core';
import {
  ARG_MIN_SURFACE_OPACITY,
  ArgButton,
  ArgColorScheme,
  ArgPalette,
  ArgSelect,
  ArgStyle,
  ArgTheme,
} from '@brunomonfardini/ui';
import { readPreference, writePreference } from './preferences';

interface Option<T extends string> {
  value: T;
  label: string;
}

const SCHEMES: Option<ArgColorScheme>[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'auto', label: 'Automático' },
];

/** Cada estilo é um arquivo em projects/ui/tokens/styles/ (o Argila é o padrão, sem arquivo). */
const STYLES: Option<ArgStyle>[] = [
  { value: 'argila', label: 'Argila (padrão)' },
  { value: 'molde', label: 'Molde' },
  { value: 'coda', label: 'CODA' },
  { value: 'transparente', label: 'Transparente' },
  { value: 'windows-xp', label: 'Windows XP' },
];

const PALETTES: Option<ArgPalette>[] = [
  { value: 'nativa', label: 'Nativa do estilo' },
  { value: 'terrosa', label: 'Terrosa' },
];

/** Opacidade das superfícies em %, do mínimo seguro até opaca, de 5 em 5. */
const MIN_OPACITY = ARG_MIN_SURFACE_OPACITY * 100;
const OPACITIES = Array.from({ length: (100 - MIN_OPACITY) / 5 + 1 }, (_, i) => ({
  value: String(MIN_OPACITY + i * 5),
}));

const SCHEME_KEY = 'argila-docs:tema';
const STYLE_KEY = 'argila-docs:estilo';
const PALETTE_KEY = 'argila-docs:paleta';
const OPACITY_KEY = 'argila-docs:opacidade';

/**
 * Modo de cor, estilo, paleta e transparência do catálogo, pelo próprio
 * `ArgTheme`, o mesmo código dos produtos; as escolhas ficam salvas no navegador.
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
  private readonly root = inject(DOCUMENT).documentElement;

  protected readonly schemes = SCHEMES;
  protected readonly styles = STYLES;
  protected readonly palettes = PALETTES;
  protected readonly minOpacity = MIN_OPACITY;
  protected readonly scheme = this.theme.colorScheme;
  protected readonly style = this.theme.style;
  protected readonly palette = this.theme.palette;
  /** Opacidade em %: a escolhida, ou a que o estilo define no CSS (1 na maioria). */
  protected readonly opacity = computed(() => {
    const chosen = this.theme.surfaceOpacity();
    if (chosen !== undefined) return Math.round(chosen * 100);
    this.theme.style();
    const fromStyle = getComputedStyle(this.root).getPropertyValue('--arg-surface-opacity');
    return Math.round((Number.parseFloat(fromStyle) || 1) * 100);
  });

  constructor() {
    this.theme.setStyle(readPreference(STYLE_KEY, STYLES) ?? 'argila');
    this.theme.setPalette(readPreference(PALETTE_KEY, PALETTES) ?? 'nativa');
    const scheme = readPreference(SCHEME_KEY, SCHEMES);
    if (scheme) {
      this.theme.setColorScheme(scheme);
    }
    const opacity = readPreference(OPACITY_KEY, OPACITIES);
    if (opacity) {
      this.theme.setSurfaceOpacity(Number(opacity) / 100);
    }
  }

  /** O estilo atual tem este modo? `auto` precisa de claro e escuro. */
  protected supports(scheme: ArgColorScheme): boolean {
    const supported = this.theme.schemes();
    return scheme === 'auto' ? supported.length > 1 : supported.includes(scheme);
  }

  protected selectScheme(scheme: ArgColorScheme): void {
    this.theme.setColorScheme(scheme);
    writePreference(SCHEME_KEY, scheme);
  }

  /** Troca o estilo e volta à transparência dele. */
  protected selectStyle(event: Event): void {
    const style = (event.target as HTMLSelectElement).value as ArgStyle;
    this.theme.setStyle(style);
    this.theme.clearSurfaceOpacity();
    writePreference(STYLE_KEY, style);
    writePreference(OPACITY_KEY, '');
  }

  protected selectPalette(event: Event): void {
    const palette = (event.target as HTMLSelectElement).value as ArgPalette;
    this.theme.setPalette(palette);
    writePreference(PALETTE_KEY, palette);
  }

  protected selectOpacity(event: Event): void {
    const percent = (event.target as HTMLInputElement).value;
    this.theme.setSurfaceOpacity(Number(percent) / 100);
    writePreference(OPACITY_KEY, percent);
  }
}
