import { DocPage } from '../docs/doc-page';
import { HubMenuExample } from './examples/hub-menu.example';

export const HUB_MENU_PATTERN_DOCS: DocPage = {
  slug: 'menu-de-hubs',
  title: 'Menu de hubs',
  category: 'Padrões',
  summary: 'Como apresentar as grandes áreas de um produto, para a pessoa escolher por onde ir.',
  pattern: {
    problem: 'Menus só com nomes curtos ("Gestão", "Operações") não dizem o que tem em cada área.',
    solution:
      'Cada área é um card com o nome (um link) e uma frase com o que se faz nela, numa grade que se ajusta à largura.',
  },
  examples: [{ name: 'Áreas do produto', component: HubMenuExample }],
  guidelines: {
    do: [
      'O link no título: o leitor de tela lista os links pelo nome da área.',
      'Uma frase com tarefas reais, não descrições genéricas.',
    ],
    dont: ['Não passe de umas 6 áreas: além disso, agrupe.'],
  },
  related: ['card', 'link'],
};
