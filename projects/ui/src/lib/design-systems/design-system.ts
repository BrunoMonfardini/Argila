/**
 * Manifesto de um design system (DS) do Argila: a única fonte do que o DS
 * aceita (modos, paletas, transparência) e de como trata cada componente.
 * O `ArgTheme`, o teste de contraste, o checkup e o catálogo leem daqui.
 *
 * Cada DS mora em `design-systems/<id>/ds.ts` (este manifesto) e em
 * `tokens/design-systems/<id>/` (o CSS). Um DS nunca importa outro DS.
 */

import type { ArgPaletteName } from './palettes';

export type ArgSchemeName = 'light' | 'dark';

/** Os componentes do núcleo: uma pasta em `src/lib/` cada. */
export const ARG_COMPONENTS = [
  'agenda',
  'alert',
  'app-shell',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'card',
  'choice',
  'combobox',
  'currency-input',
  'date-picker',
  'dialog',
  'divider',
  'drawer',
  'empty-state',
  'field',
  'file-upload',
  'icon',
  'icon-button',
  'input',
  'link',
  'list',
  'masked-input',
  'menu',
  'pagination',
  'popover',
  'progress-bar',
  'select',
  'skeleton',
  'spinner',
  'stepper',
  'table',
  'tabs',
  'tag',
  'time-slots',
  'toast',
  'tooltip',
] as const;

export type ArgComponentName = (typeof ARG_COMPONENTS)[number];

/** Núcleo mínimo: todo DS de produto cura estes componentes (pele própria e teste). */
export const ARG_CORE_MINIMUM = [
  'button',
  'icon-button',
  'input',
  'field',
  'select',
  'choice',
  'tabs',
  'card',
  'dialog',
  'alert',
  'toast',
  'progress-bar',
  'badge',
  'tag',
  'tooltip',
  'empty-state',
  'spinner',
  'link',
  'divider',
] as const satisfies readonly ArgComponentName[];

export interface ArgDesignSystem {
  /** Igual ao nome da pasta e ao valor de `data-arg-style`. */
  readonly id: string;
  readonly nome: string;
  /** Imagem de referência em `docs/referencias/`, quando houver. */
  readonly referencia?: string;
  /** Modos de cor aceitos; o primeiro é o padrão. */
  readonly modos: readonly [ArgSchemeName, ...ArgSchemeName[]];
  /** Aceita o controle de transparência das superfícies. */
  readonly transparencia: boolean;
  /**
   * Paletas aceitas; a primeira é a padrão. `nativa` é a paleta do próprio
   * DS (`paletas/nativa.css`); as outras são compartilhadas (`palettes.ts`).
   */
  readonly paletas: readonly [ArgPaletteName, ...ArgPaletteName[]];
  /** Fontes que o produto precisa carregar (Google Fonts). */
  readonly fontes?: { readonly titulo?: string; readonly corpo?: string };
  readonly componentes: {
    /** Com pele própria em `componentes/<nome>.css`. Os demais são herdados. */
    readonly curados: readonly ArgComponentName[];
    /** Fora do DS: não aparecem no catálogo dele. */
    readonly fora: readonly ArgComponentName[];
  };
  /**
   * Componentes que só existem neste DS, em `design-systems/<id>/exclusivos/<nome>/`.
   * O nome e o seletor começam pelo `prefixo` (ex.: `nb-sticker` → `arg-nb-sticker`).
   */
  readonly exclusivos: readonly string[];
  /** Prefixo dos exclusivos, obrigatório quando houver algum (ex.: `nb`, `punk`, `xp`). */
  readonly prefixo?: string;
  /** Regras de uso ("faça e não faça") do DS. */
  readonly regras: readonly string[];
  /** Base interna para criar DS novos; não é oferecida aos produtos. */
  readonly interno?: boolean;
}
