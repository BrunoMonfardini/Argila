import { DocPage } from '../docs/doc-page';
import { LayoutGridExample, LayoutSectionsExample } from './examples/layout.example';

export const LAYOUT_PATTERN_DOCS: DocPage = {
  slug: 'layout',
  title: 'Layout',
  category: 'Padrões',
  summary: 'Como organizar a tela: grade que se ajusta, seções e o espaço da escala.',
  pattern: {
    problem: 'Telas que só funcionam numa largura quebram no celular ou ficam vazias no monitor.',
    solution:
      'Grade que se ajusta à largura (`auto-fill` com mínimo), seções separadas por espaço ou divisor, e espaçamentos só da escala (`--arg-space-*`). O design system muda a forma; a organização continua.',
  },
  examples: [
    { name: 'Grade de cards', component: LayoutGridExample },
    { name: 'Seções', component: LayoutSectionsExample },
  ],
  guidelines: {
    do: [
      'Use os tokens de espaço: o ritmo fica igual em todo design system.',
      'Teste em 320px de largura: nada pode rolar para o lado.',
    ],
    dont: ['Não fixe larguras em px para conteúdo: use mínimo e máximo.'],
  },
  related: ['card', 'divider', 'badge', 'button'],
};
