import { DocPage } from '../../docs/doc-page';
import { ArgBreadcrumb } from './breadcrumb';
import { BreadcrumbPetExample } from './examples/breadcrumb-pet.example';

export const BREADCRUMB_DOCS: DocPage = {
  slug: 'breadcrumb',
  title: 'Breadcrumb',
  category: 'Componentes',
  group: 'Navegação',
  summary:
    'Trilha de navegação: mostra onde a página está na hierarquia e leva às páginas acima dela. Importe tudo de uma vez com `ARG_BREADCRUMB`.',
  component: ArgBreadcrumb,
  playground: false,
  examples: [{ name: 'Ficha do pet', component: BreadcrumbPetExample }],
  guidelines: {
    do: [
      'Comece pela seção principal e termine na página atual, com `current`.',
      'Use links (`<a arg-link variant="muted">`) para as páginas acima e só texto para a atual.',
      'Use os mesmos nomes do menu e dos títulos das páginas.',
    ],
    dont: [
      'Não use para o histórico de páginas visitadas: a trilha mostra a hierarquia.',
      'Não use em páginas de primeiro nível, onde a trilha teria um item só.',
    ],
  },
  accessibility: [
    'É um `<nav>` com nome ("Trilha de navegação") e uma lista ordenada: o leitor de tela anuncia a região, a quantidade de itens e a posição de cada um.',
    'A página atual tem `aria-current="page"`.',
    'O separador é desenhado pelo CSS com texto alternativo vazio: não é lido.',
  ],
};
