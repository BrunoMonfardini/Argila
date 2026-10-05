/**
 * Formato do manifesto do catálogo (projects/docs/src/generated/manifest.json).
 * Usado pelo gerador e pela aplicação do catálogo; só tipos e a chave das páginas.
 */

export type ManifestControl = 'options' | 'boolean' | 'string' | 'number' | 'other';

export interface ManifestInput {
  name: string;
  /** Tipo como aparece na tabela: `'sm' | 'md' | 'lg'`, `boolean`. */
  type: string;
  /** Controle do playground para este tipo. */
  control: ManifestControl;
  /** Valores possíveis, quando o tipo é uma união de strings. */
  options?: string[];
  /** Código do valor padrão, como escrito em `input(...)`. */
  defaultValue?: string;
  required: boolean;
  /** Comentário JSDoc da input; vazio quando não há. */
  description: string;
}

export interface ManifestCssToken {
  name: string;
  value: string;
}

export interface ManifestComponent {
  className: string;
  selector: string;
  /** Arquivo do componente, relativo à raiz do repositório. */
  file: string;
  inputs: ManifestInput[];
  /** Tokens de componente (`--arg-<slug>-*`) declarados no CSS do componente. */
  cssTokens: ManifestCssToken[];
}

export interface ManifestPage {
  slug: string;
  category: string;
  /** Arquivo `*.docs.ts`, relativo à raiz do repositório. */
  file: string;
  component?: ManifestComponent;
  /** Código-fonte de cada exemplo, pelo nome do exemplo. */
  examples: Record<string, string>;
}

export interface ManifestToken {
  name: string;
  value: string;
  /** Grupo, do comentário acima do token em semantic.css: "Marca", "Texto". */
  group: string;
}

export interface Manifest {
  /** Páginas por `<categoria>/<slug>`, ex.: `Componentes/button`. */
  pages: Record<string, ManifestPage>;
  tokens: ManifestToken[];
}

/** Chave da página no manifesto. */
export function manifestKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}
