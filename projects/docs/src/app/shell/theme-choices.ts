import { Injectable, inject } from '@angular/core';
import { ArgStyle, ArgTheme } from '@brunomonfardini/ui';
import { writePreference } from './preferences';

export const SCHEME_KEY = 'argila-docs:tema';
export const STYLE_KEY = 'argila-docs:estilo';
export const PALETTE_KEY = 'argila-docs:paleta';
export const OPACITY_KEY = 'argila-docs:opacidade';

/**
 * Escolhas de tema do catálogo que valem em mais de um lugar (a barra do topo
 * e o aviso "não faz parte deste DS"): aplicam no `ArgTheme` e ficam salvas.
 */
@Injectable({ providedIn: 'root' })
export class DocThemeChoices {
  private readonly theme = inject(ArgTheme);

  /** Troca o design system e volta à transparência dele. */
  selectStyle(style: ArgStyle): void {
    this.theme.setStyle(style);
    this.theme.clearSurfaceOpacity();
    writePreference(STYLE_KEY, style);
    writePreference(OPACITY_KEY, '');
  }
}
