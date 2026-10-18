import { DocPage } from '../docs/doc-page';
import { HomeExample, HomeFirstExample } from './examples/home.example';

export const HOME_PATTERN_DOCS: DocPage = {
  slug: 'home',
  title: 'Home',
  category: 'Padrões',
  summary: 'Como montar a tela inicial: o que pede atenção, os números do dia e a ação mais comum.',
  pattern: {
    problem: 'Telas iniciais cheias de atalhos e gráficos não dizem o que fazer agora.',
    solution:
      'No topo, a ação mais comum; em seguida, poucos números que mudam a decisão do dia. No primeiro acesso, sem dados, a tela vira o primeiro passo.',
  },
  examples: [
    { name: 'Dia a dia', component: HomeExample },
    { name: 'Primeiro acesso', component: HomeFirstExample },
  ],
  guidelines: {
    do: ['No máximo uns 4 números, com rótulo claro.', 'A saudação e a ação principal no topo.'],
    dont: ['Não mostre zeros no primeiro acesso: mostre o primeiro passo.'],
  },
  related: ['card', 'button', 'empty-state'],
};
