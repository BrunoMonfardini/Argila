import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type ArgColorScheme = 'light' | 'dark' | 'auto';

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

/**
 * Aplica tema em tempo de execução no <html>: modo claro/escuro e a marca do
 * tenant (ex.: carregada da tabela `tenants` após o login).
 */
@Injectable({ providedIn: 'root' })
export class ArgTheme {
  private readonly root = inject(DOCUMENT).documentElement;

  private readonly _colorScheme = signal<ArgColorScheme>(
    (this.root.getAttribute('data-arg-theme') as ArgColorScheme | null) ?? 'light',
  );
  readonly colorScheme = this._colorScheme.asReadonly();

  setColorScheme(scheme: ArgColorScheme): void {
    this.root.setAttribute('data-arg-theme', scheme);
    this._colorScheme.set(scheme);
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
}
