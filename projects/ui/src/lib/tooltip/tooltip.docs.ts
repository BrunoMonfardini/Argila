import { DocPage } from '../../docs/doc-page';
import { TooltipBasicExample } from './examples/tooltip-basic.example';
import { TooltipPositionsExample } from './examples/tooltip-positions.example';
import { ArgTooltip } from './tooltip';

export const TOOLTIP_DOCS: DocPage = {
  slug: 'tooltip',
  title: 'Tooltip',
  category: 'Componentes',
  group: 'Feedback',
  summary:
    'Texto curto que aparece ao lado de um elemento no foco e no hover: o nome de um botão de ícone, um atalho de teclado. Diretiva `argTooltip` em qualquer elemento focável.',
  component: ArgTooltip,
  playground: false,
  examples: [
    { name: 'Uso', component: TooltipBasicExample },
    { name: 'Posições', component: TooltipPositionsExample },
  ],
  guidelines: {
    do: [
      'Use em botões de ícone, repetindo o `label`: quem enxerga vê o mesmo nome que o leitor de tela lê.',
      'Use para informação extra e dispensável, como atalhos de teclado.',
      'Ponha só em elementos focáveis (botões, links, campos), para funcionar no teclado.',
    ],
    dont: [
      'Não ponha informação essencial só no tooltip: no celular não há hover.',
      'Não ponha links, botões ou texto longo dentro: o balão não recebe foco.',
      'Não use em botão `disabled`: ele não recebe foco nem eventos de mouse.',
    ],
  },
  accessibility: [
    'Abre no foco (na hora) e no hover (depois de 300 ms); fecha ao sair, no blur e com Esc, sem mover o foco.',
    'Dá para levar o mouse até o balão sem ele fechar, e ele fica aberto enquanto o mouse está em cima (WCAG 1.4.13).',
    'O balão tem `role="tooltip"` e vira a descrição do gatilho (`aria-describedby`). Se o texto for igual ao nome do gatilho, não é ligado, para não ser lido duas vezes.',
    'Esc fecha só o tooltip, sem chegar a um diálogo que esteja por baixo.',
    'Fica na camada de topo do navegador (`popover`), acima de qualquer `overflow` ou `z-index`.',
  ],
};
