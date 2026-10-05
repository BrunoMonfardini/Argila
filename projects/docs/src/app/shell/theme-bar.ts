import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { ArgButton, ArgColorScheme, ArgTheme } from '@brunomonfardini/ui';
import { readPreference, writePreference } from './preferences';

interface Option<T extends string> {
  value: T;
  label: string;
}

export type DocBrand = 'argila' | 'example';

const SCHEMES: Option<ArgColorScheme>[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'auto', label: 'Automático' },
];

/** Marcas de exemplo: cada uma é um arquivo em projects/ui/tokens/themes/. */
const BRANDS: Option<DocBrand>[] = [
  { value: 'argila', label: 'Argila (padrão)' },
  { value: 'example', label: 'Exemplo' },
];

const SCHEME_KEY = 'argila-docs:tema';
const BRAND_KEY = 'argila-docs:marca';

/**
 * Modo de cor e marca do catálogo. O modo usa o próprio `ArgTheme`, o mesmo
 * código dos produtos; a escolha fica salva no navegador.
 */
@Component({
  selector: 'doc-theme-bar',
  imports: [ArgButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-bar.html',
  styleUrl: './theme-bar.css',
})
export class DocThemeBar {
  private readonly theme = inject(ArgTheme);
  private readonly root = inject(DOCUMENT).documentElement;

  protected readonly schemes = SCHEMES;
  protected readonly brands = BRANDS;
  protected readonly scheme = this.theme.colorScheme;
  protected readonly brand = signal<DocBrand>('argila');

  constructor() {
    const scheme = readPreference(SCHEME_KEY, SCHEMES);
    if (scheme) {
      this.theme.setColorScheme(scheme);
    }
    this.applyBrand(readPreference(BRAND_KEY, BRANDS) ?? 'argila');
  }

  protected selectScheme(scheme: ArgColorScheme): void {
    this.theme.setColorScheme(scheme);
    writePreference(SCHEME_KEY, scheme);
  }

  protected selectBrand(event: Event): void {
    const brand = (event.target as HTMLSelectElement).value as DocBrand;
    this.applyBrand(brand);
    writePreference(BRAND_KEY, brand);
  }

  private applyBrand(brand: DocBrand): void {
    if (brand === 'argila') {
      this.root.removeAttribute('data-arg-brand');
    } else {
      this.root.setAttribute('data-arg-brand', brand);
    }
    this.brand.set(brand);
  }
}
