import type { DocAvailability } from '../../availability';
import type { DocPage } from '../../registry';

export type DocTabId = 'visao-geral' | 'uso' | 'codigo' | 'acessibilidade';

export interface DocTab {
  id: DocTabId;
  label: string;
  /** Segmento na URL: `/componentes/button/codigo`. A Visão geral não tem. */
  path: string;
}

/** Um item do índice "Nesta página": o id do título e o texto dele. */
export interface DocTocEntry {
  id: string;
  label: string;
  /** 2 para as seções, 3 para os itens dentro delas (cada exemplo). */
  level: 2 | 3;
}

const TABS: DocTab[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '' },
  { id: 'uso', label: 'Regras de uso', path: 'uso' },
  { id: 'codigo', label: 'Código', path: 'codigo' },
  { id: 'acessibilidade', label: 'Acessibilidade', path: 'acessibilidade' },
];

/**
 * As abas que a página tem: a Visão geral sempre; Regras de uso com regras
 * da página ou nas páginas de componente (que mostram as regras do DS);
 * Código com componente no manifesto; Acessibilidade com notas ou teclado.
 */
export function pageTabs(
  page: DocPage,
  hasComponent: boolean,
  status: DocAvailability | undefined,
): DocTab[] {
  const has: Record<DocTabId, boolean> = {
    'visao-geral': true,
    uso: Boolean(page.guidelines || page.whenToUse?.length || page.whenNotToUse?.length || status),
    codigo: hasComponent,
    acessibilidade: Boolean(page.accessibility?.length || page.keyboard?.length),
  };
  return TABS.filter((tab) => has[tab.id]);
}

export interface DocTocOptions {
  /** O playground aparece (componente no manifesto e `playground` não desligado). */
  playground: boolean;
  /** O componente declara tokens próprios. */
  tokens: boolean;
  /** Há regras do design system escolhido. */
  dsRules: boolean;
}

/** O índice "Nesta página" da aba, na ordem em que as seções aparecem. */
export function tableOfContents(
  page: DocPage,
  tab: DocTabId,
  options: DocTocOptions,
): DocTocEntry[] {
  const entries: (DocTocEntry | false | undefined)[] = [];
  if (tab === 'visao-geral') {
    entries.push(
      ...(page.content ?? []).map((section, i): DocTocEntry => ({
        id: `secao-${i}`,
        label: section.heading,
        level: 2,
      })),
      options.playground && { id: 'playground', label: 'Playground', level: 2 },
      page.anatomy && { id: 'anatomia', label: 'Anatomia', level: 2 },
    );
    if (page.examples.length) {
      entries.push(
        { id: 'exemplos', label: 'Exemplos', level: 2 },
        ...page.examples.map((example, i): DocTocEntry => ({
          id: `exemplo-${i}`,
          label: example.name,
          level: 3,
        })),
      );
    }
  } else if (tab === 'uso') {
    entries.push(
      Boolean(page.whenToUse?.length || page.whenNotToUse?.length) && {
        id: 'quando-usar',
        label: 'Quando usar',
        level: 2,
      },
      page.guidelines && { id: 'uso', label: 'Faça e não faça', level: 2 },
      options.dsRules && { id: 'regras-do-ds', label: 'Regras do design system', level: 2 },
    );
  } else if (tab === 'codigo') {
    entries.push(
      { id: 'propriedades', label: 'Propriedades', level: 2 },
      options.tokens && { id: 'tokens-do-componente', label: 'Tokens do componente', level: 2 },
    );
  } else {
    entries.push(
      Boolean(page.accessibility?.length) && {
        id: 'acessibilidade',
        label: 'Leitor de tela e contraste',
        level: 2,
      },
      Boolean(page.keyboard?.length) && { id: 'teclado', label: 'Teclado', level: 2 },
    );
  }
  return entries.filter((entry): entry is DocTocEntry => Boolean(entry));
}
