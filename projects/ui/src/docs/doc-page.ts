import { Type } from '@angular/core';

/**
 * Formato das páginas do catálogo (projects/docs). Cada componente tem um
 * `<componente>.docs.ts` ao lado do código. Estes arquivos não entram no
 * pacote publicado: o `public-api.ts` não os exporta.
 */
export type DocCategory = 'Fundamentos' | 'Componentes' | 'Padrões';

export interface DocExample {
  /** Título do exemplo na página, ex.: "Variantes". Único dentro da página. */
  name: string;
  description?: string;
  /** Componente standalone do arquivo em examples/. */
  component: Type<unknown>;
}

export interface DocPage {
  /** Usado na URL: /componentes/button. */
  slug: string;
  title: string;
  category: DocCategory;
  /** Primeiro parágrafo da página: para que serve e quando usar. */
  summary: string;
  /** Componente documentado; habilita o playground e a tabela de propriedades. */
  component?: Type<unknown>;
  /** Elemento hospedeiro, para componentes de atributo: 'button' em button[arg-button]. */
  hostElement?: string;
  /** Texto projetado no playground, ex.: "Salvar". */
  playgroundContent?: string;
  /** Valores iniciais do playground, para inputs obrigatórias ou exemplos melhores. */
  playgroundInputs?: Record<string, unknown>;
  examples: DocExample[];
  /** Regras de uso: faça / não faça. */
  guidelines?: { do: string[]; dont: string[] };
  /** Teclado, leitor de tela e contraste, escrito pelo time. */
  accessibility?: string[];
}
