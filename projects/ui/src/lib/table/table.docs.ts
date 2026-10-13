import { DocPage } from '../../docs/doc-page';
import { TablePetsExample } from './examples/table-pets.example';
import { ArgTable } from './table';

export const TABLE_DOCS: DocPage = {
  slug: 'table',
  title: 'Table',
  category: 'Componentes',
  summary:
    'Tabela de dados sobre a `<table>` nativa: ordenação pelos títulos, seleção de linhas, carregando, vazio e rolagem horizontal no celular. Importe tudo de uma vez com `ARG_TABLE`.',
  component: ArgTable,
  // Colunas e linhas são listas: o exemplo mostra o componente
  playground: false,
  examples: [{ name: 'Pets da clínica', component: TablePetsExample }],
  guidelines: {
    do: [
      'Dê uma `caption` que diga o que a tabela lista: ela nomeia a tabela e a área de rolagem.',
      'Alinhe números e valores à direita (`align: \x27end\x27`) e formate-os com `format`.',
      'Use `argTableCell` para células com badge, link ou botão; e `argTableEmpty` para um estado vazio com ação.',
      'Com muitos dados, ordene no servidor (`serverSort`) e combine com a Pagination.',
    ],
    dont: [
      'Não use tabela para leiaute: só para dados com linhas e colunas.',
      'Não esconda colunas no celular: a tabela rola de lado, sem perder informação.',
    ],
  },
  accessibility: [
    'É uma `<table>` nativa com `<caption>` e títulos `<th scope="col">`: o leitor de tela lê o título de cada célula.',
    'Títulos ordenáveis são botões e o `<th>` tem `aria-sort`; a seta (↑ ↓ ⇅) mostra a direção sem depender da cor, e a troca é anunciada ("Ordenado por Pet, crescente").',
    'Cada linha tem uma caixa de marcar com nome ("Selecionar Thor"); "Selecionar todas as linhas" fica indeterminado com parte marcada.',
    'Carregando, a tabela tem `aria-busy` e a legenda diz "(carregando…)"; as linhas de marcador ficam ocultas.',
    'No celular, a área de rolagem é focável e tem o nome da tabela: dá para rolar de lado com as setas do teclado.',
  ],
};
