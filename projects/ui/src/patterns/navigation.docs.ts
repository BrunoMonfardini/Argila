import { DocPage } from '../docs/doc-page';
import { NavigationPageExample, NavigationViewsExample } from './examples/navigation.example';

export const NAVIGATION_PATTERN_DOCS: DocPage = {
  slug: 'navegacao',
  title: 'Navegação',
  category: 'Padrões',
  summary: 'Como a pessoa sabe onde está, volta e se move entre as partes de uma tela.',
  pattern: {
    problem:
      'Em telas internas, a pessoa perde o caminho de volta e não sabe que há outras seções.',
    solution:
      'O topo da página mostra de onde se veio (um link de volta), o título e as seções em abas. Para trocar a visão dos mesmos dados, abas segmentadas.',
  },
  examples: [
    { name: 'Página interna', component: NavigationPageExample },
    { name: 'Trocar a visão', component: NavigationViewsExample },
  ],
  guidelines: {
    do: [
      'Link para navegar, botão para agir: o leitor de tela anuncia cada um como é.',
      'Rótulos de aba curtos, de uma ou duas palavras.',
    ],
    dont: ['Não use abas para passos em sequência: aí é um fluxo, com Próximo e Voltar.'],
  },
  related: ['link', 'tabs'],
};
