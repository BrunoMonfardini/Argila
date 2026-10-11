import { DocPage } from '../../docs/doc-page';
import { TagFiltersExample } from './examples/tag-filters.example';
import { ArgTag } from './tag';

export const TAG_DOCS: DocPage = {
  slug: 'tag',
  title: 'Tag',
  category: 'Componentes',
  summary:
    'Item de uma seleção ou filtro, que pode ser removido: filtros aplicados, serviços escolhidos, etiquetas de um cliente.',
  component: ArgTag,
  playgroundContent: 'Gatos',
  playgroundInputs: { removable: true },
  examples: [{ name: 'Filtros removíveis', component: TagFiltersExample }],
  guidelines: {
    do: [
      'Ponha as tags numa lista (`<ul>`) com nome, ex.: "Filtros aplicados".',
      'Quando a última tag sair, diga o que aconteceu: "Nenhum filtro aplicado".',
      'Ajuste o verbo com `removeText` quando "Remover" não for o mais claro.',
    ],
    dont: [
      'Não use tag só para mostrar status: isso é o Badge.',
      'Não esconda o botão de remover só no hover: no celular e no teclado ele precisa estar visível.',
    ],
  },
  accessibility: [
    'O botão de remover é um `<button>` focável: Enter e Espaço acionam, e Delete e Backspace também removem.',
    'O nome do botão junta o verbo e o texto da tag: o leitor de tela lê "Remover Gatos", não só "x".',
    'O ícone é decorativo; em alto contraste a tag mantém a borda.',
  ],
};
