import { DocPage } from '../../docs/doc-page';
import { PopoverDetailsExample } from './examples/popover-details.example';
import { PopoverEdgeExample } from './examples/popover-edge.example';
import { ArgPopover } from './popover';

export const POPOVER_DOCS: DocPage = {
  slug: 'popover',
  title: 'Popover',
  category: 'Componentes',
  summary:
    'Painel com conteúdo livre junto de um botão: detalhes rápidos, ajuda, uma ação curta. Não bloqueia a página. Importe tudo de uma vez com `ARG_POPOVER`.',
  component: ArgPopover,
  playground: false,
  examples: [
    { name: 'Detalhes', component: PopoverDetailsExample },
    {
      name: 'Perto da borda',
      description: 'Sem espaço do lado pedido, o painel vira para o lado oposto e não sai da tela.',
      component: PopoverEdgeExample,
    },
  ],
  guidelines: {
    do: [
      'Use para conteúdo que complementa a tela e pode ser fechado sem perda: detalhes, ajuda, uma ação rápida.',
      'Dê um `label` que diga o que o painel mostra.',
      'Feche por código (`hide()`) depois de uma ação feita dentro dele.',
    ],
    dont: [
      'Não use para decisões que precisam de resposta: use um Dialog.',
      'Não use para texto curto que aparece no hover: isso é o Tooltip.',
      'Não use para listas de ações: isso é o Menu.',
    ],
  },
  accessibility: [
    'O gatilho é um `<button>` com `popovertarget`, `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`.',
    'O painel é um `popover="auto"` com `role="dialog"` e nome: Esc e clique fora fecham, e o foco volta ao botão.',
    'O Tab vai do botão para dentro do painel aberto, na ordem do conteúdo.',
    'Fica na camada de topo do navegador, acima de `overflow` e `z-index`; em alto contraste, mantém a borda.',
  ],
};
