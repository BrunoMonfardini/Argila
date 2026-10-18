import { DocPage } from '../docs/doc-page';
import { TimelineExample } from './examples/timeline.example';

export const TIMELINE_PATTERN_DOCS: DocPage = {
  slug: 'linhas-do-tempo',
  title: 'Linhas do tempo',
  category: 'Padrões',
  summary: 'Como mostrar o que aconteceu, em ordem, para a pessoa acompanhar um processo.',
  pattern: {
    problem:
      'Eventos soltos, sem ordem nem hora, não deixam a pessoa entender em que ponto o processo está.',
    solution:
      'Uma lista ordenada (`<ol>`), do mais recente para o mais antigo, com a hora, o que aconteceu e a situação em texto. A linha à esquerda é só desenho.',
  },
  examples: [{ name: 'Atendimento do dia', component: TimelineExample }],
  guidelines: {
    do: [
      'Use `<ol>`: o leitor de tela anuncia a ordem e a quantidade.',
      'Mostre a hora em formato curto e alinhado.',
    ],
    dont: ['Não use a linha ou a cor como única informação da situação.'],
  },
  related: ['badge'],
};
