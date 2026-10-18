import { DocPage } from '../docs/doc-page';
import {
  DisclosureMoreExample,
  DisclosureTabsExample,
  DisclosureTipExample,
} from './examples/disclosure.example';

export const DISCLOSURE_PATTERN_DOCS: DocPage = {
  slug: 'mostrar-e-ocultar',
  title: 'Mostrar e ocultar',
  category: 'Padrões',
  summary: 'Como esconder o que é secundário sem que a pessoa perca o que precisa.',
  pattern: {
    problem: 'Tudo à vista ao mesmo tempo esconde o importante; escondido demais, ninguém acha.',
    solution:
      'Mostre primeiro o que a maioria precisa e deixe o resto a um clique: "Mostrar mais" no lugar, abas para conteúdos do mesmo nível e tooltip só para dicas curtas.',
  },
  examples: [
    { name: 'Mostrar mais', component: DisclosureMoreExample },
    { name: 'Abas', component: DisclosureTabsExample },
    { name: 'Dica curta', component: DisclosureTipExample },
  ],
  guidelines: {
    do: [
      'Diga no botão o que acontece ("Mostrar mais") e o estado (`aria-expanded`).',
      'Use o Dialog para decisões que interrompem; o resto fica na página.',
    ],
    dont: [
      'Não esconda informação obrigatória para concluir a tarefa.',
      'Não ponha conteúdo essencial só no tooltip: no toque, ele é difícil de abrir.',
    ],
  },
  related: ['button', 'tabs', 'tooltip', 'dialog'],
};
