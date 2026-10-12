import { DocPage } from '../../docs/doc-page';
import { PaginationClientsExample } from './examples/pagination-clients.example';
import { ArgPagination } from './pagination';

export const PAGINATION_DOCS: DocPage = {
  slug: 'pagination',
  title: 'Pagination',
  category: 'Componentes',
  summary:
    'Navega entre as páginas de uma lista longa: anterior, próxima, números das páginas e "Página 3 de 24".',
  component: ArgPagination,
  hostElement: 'nav',
  playgroundInputs: { total: 24, page: 5 },
  examples: [{ name: 'Lista de clientes', component: PaginationClientsExample }],
  guidelines: {
    do: [
      'Ponha a paginação logo abaixo da lista que ela controla.',
      'Guarde a página na URL (`?pagina=3`) no `(pageChange)`, para o voltar do navegador funcionar.',
      'Depois de trocar de página, mantenha a pessoa perto da lista: role até o topo dela, se preciso.',
    ],
    dont: [
      'Não use para poucos itens que cabem numa tela.',
      'Não pagine resultados que a pessoa precisa comparar entre si: prefira filtros.',
    ],
  },
  accessibility: [
    'É um `<nav>` com nome ("Paginação") e uma lista: o leitor de tela encontra a região e conta os itens.',
    'A página atual tem `aria-current="page"` e os números são lidos como "Página 3".',
    'Ao trocar de página, "Página 3 de 24" é anunciado sem mover o foco; o mesmo texto fica visível ao lado.',
    'Anterior e Próxima usam `aria-disabled` nas pontas: continuam focáveis, então o foco não se perde ao chegar na última página.',
    'A página atual é preenchida e em negrito, não só de outra cor.',
  ],
};
