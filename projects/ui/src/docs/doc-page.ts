import { Type } from '@angular/core';
import type { ArgStyle } from '../lib/design-systems/design-systems';

/**
 * Formato das páginas do catálogo (projects/docs). Cada componente tem um
 * `<componente>.docs.ts` ao lado do código. Estes arquivos não entram no
 * pacote publicado: o `public-api.ts` não os exporta.
 */
export type DocCategory =
  'Guias' | 'Fundação' | 'Componentes' | 'Padrões' | 'Templates' | 'Design systems';

export interface DocExample {
  /** Título do exemplo na página, ex.: "Variantes". Único dentro da página. */
  name: string;
  description?: string;
  /** Componente standalone do arquivo em examples/. */
  component: Type<unknown>;
}

/** Uma parte marcada no exemplo da anatomia (`data-anatomy="1"`). */
export interface DocAnatomyPart {
  label: string;
  description: string;
  /**
   * Para partes que o componente desenha por dentro (o rótulo do Field, a
   * lista das abas): o seletor dentro do exemplo, no lugar de `data-anatomy`.
   */
  selector?: string;
}

/** Seção de texto de uma página sem componente, como "Sobre templates". */
export interface DocSection {
  heading: string;
  /** Parágrafos; aceitam `código` entre crases. */
  body: string[];
  /** Bloco de código depois dos parágrafos, com o botão de copiar. */
  code?: { language: 'ts' | 'html' | 'css' | 'sh'; label: string; code: string };
}

export interface DocPage {
  /** Usado na URL: /componentes/button. */
  slug: string;
  title: string;
  category: DocCategory;
  /** Família na navegação, ex.: "Formulário". Sem família, a página fica solta na seção. */
  group?: string;
  /** Só nos exclusivos: o design system ao qual o componente pertence. */
  designSystem?: ArgStyle;
  /** Primeiro parágrafo da página: para que serve e quando usar. */
  summary: string;
  /** Componente documentado; habilita o playground e a tabela de propriedades. */
  component?: Type<unknown>;
  /** `false` esconde o playground, para componentes que só fazem sentido com conteúdo (List). */
  playground?: boolean;
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
  whenToUse?: string[];
  whenNotToUse?: string[];
  /** Exemplo com as partes marcadas e a legenda de cada uma, na ordem dos números. */
  anatomy?: { example: Type<unknown>; parts: DocAnatomyPart[] };
  /** Atalhos de teclado: tecla e o que ela faz. */
  keyboard?: { key: string; action: string }[];
  /** Slugs de páginas relacionadas. */
  related?: string[];
  /** Só nos padrões: o problema e a solução, no topo da página. */
  pattern?: { problem: string; solution: string };
  /** Texto corrido, para páginas sem componente ("Sobre templates"). */
  content?: DocSection[];
}
