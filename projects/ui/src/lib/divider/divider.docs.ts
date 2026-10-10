import { DocPage } from '../../docs/doc-page';
import { ArgDivider } from './divider';
import { DividerSectionsExample } from './examples/divider-sections.example';
import { DividerSpacingExample } from './examples/divider-spacing.example';
import { DividerVerticalExample } from './examples/divider-vertical.example';

export const DIVIDER_DOCS: DocPage = {
  slug: 'divider',
  title: 'Divider',
  category: 'Componentes',
  summary:
    'Linha que separa seções de conteúdo ou grupos de itens. Use pouco: espaço em branco costuma separar melhor que linhas.',
  component: ArgDivider,
  hostElement: 'hr',
  examples: [
    { name: 'Entre seções', component: DividerSectionsExample },
    {
      name: 'Vertical',
      description:
        'Separa grupos de ações lado a lado; aqui é decorativo, porque só agrupa botões.',
      component: DividerVerticalExample,
    },
    { name: 'Espaçamento', component: DividerSpacingExample },
  ],
  guidelines: {
    do: [
      'Use para separar seções com assuntos diferentes, como os dados do tutor e os do pet.',
      'Marque como `decorative` quando a linha só agrupa visualmente, sem separar conteúdo.',
    ],
    dont: [
      'Não ponha linha entre todos os itens de uma lista: use `divided` no `arg-list`.',
      'Não use para criar bordas de caixas: isso é o Card.',
    ],
  },
  accessibility: [
    'É um `<hr>`: leitores de tela anunciam um separador. Na vertical, recebe `aria-orientation="vertical"`.',
    'Com `decorative`, recebe `role="none"` e não é anunciado.',
    'A linha é uma borda, e por isso continua visível no modo de alto contraste do sistema.',
  ],
};
