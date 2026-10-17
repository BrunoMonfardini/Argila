import { DocPage } from '../../docs/doc-page';
import { TagChipsExample } from './examples/tag-chips.example';
import { TagFiltersExample } from './examples/tag-filters.example';
import { ArgTag } from './tag';

export const TAG_DOCS: DocPage = {
  slug: 'tag',
  title: 'Tag',
  category: 'Componentes',
  summary:
    'Item de uma seleção ou filtro, que pode ser removido ou ligado e desligado (chip de filtro): filtros aplicados, serviços escolhidos, etiquetas de um cliente.',
  component: ArgTag,
  playgroundContent: 'Gatos',
  playgroundInputs: { removable: true },
  examples: [
    { name: 'Filtros removíveis', component: TagFiltersExample },
    {
      name: 'Chips de filtro',
      description: 'Com `selectable`, a tag liga e desliga um filtro; ligada, ganha o ✓.',
      component: TagChipsExample,
    },
  ],
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
    'Com `selectable`, o texto é um `<button>` com `aria-pressed`: o leitor de tela anuncia "pressionado" ou "não pressionado", e o ✓ mostra o estado sem depender da cor.',
  ],
};
