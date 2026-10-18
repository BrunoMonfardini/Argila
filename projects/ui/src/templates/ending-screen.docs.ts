import { DocPage } from '../docs/doc-page';
import { EndingStepsTemplate, EndingTemplate } from './examples/ending-screen-template.example';

export const ENDING_SCREEN_TEMPLATE_DOCS: DocPage = {
  slug: 'ending-screen',
  title: 'Ending Screen',
  category: 'Templates',
  summary:
    'O fim de um fluxo com sucesso: confirma o que aconteceu, resume o que importa e mostra os próximos passos.',
  examples: [
    { name: 'Agendamento confirmado', component: EndingTemplate },
    { name: 'Cadastro em etapas', component: EndingStepsTemplate },
  ],
  guidelines: {
    do: [
      'Repita o essencial (o quê, quando, onde): a pessoa confere sem voltar.',
      'Uma ação principal e no máximo uma secundária.',
    ],
    dont: ['Não termine sem caminho: sempre há um próximo passo ou um "Voltar ao início".'],
  },
};
