import { DocPage } from '../docs/doc-page';
import { ShowcaseExample } from './examples/showcase.example';

export const SHOWCASE_PATTERN_DOCS: DocPage = {
  slug: 'espacos-de-vitrine',
  title: 'Espaços de vitrine',
  category: 'Padrões',
  summary: 'Como destacar uma novidade ou oferta sem atrapalhar a tarefa principal.',
  pattern: {
    problem: 'Banners demais competem com a tarefa e viram ruído que a pessoa aprende a ignorar.',
    solution:
      'Um destaque por vez, num card no fluxo da página: o que é, por que importa para a pessoa e uma ação. Sem animação nem carrossel automático.',
  },
  examples: [{ name: 'Novidade', component: ShowcaseExample }],
  guidelines: {
    do: [
      'Fale do benefício para a pessoa, não da funcionalidade.',
      'Deixe dispensar ou esconder depois de visto.',
    ],
    dont: ['Não use carrossel que passa sozinho.', 'Não ponha a vitrine no meio de um formulário.'],
  },
  related: ['card', 'badge', 'button'],
};
