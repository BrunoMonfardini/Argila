import { DocPage } from '../docs/doc-page';
import { ExperienceRatingExample } from './examples/experience.example';

export const EXPERIENCE_PATTERN_DOCS: DocPage = {
  slug: 'indicadores-de-experiencia',
  title: 'Indicadores de experiência',
  category: 'Padrões',
  summary: 'Como perguntar como foi a experiência sem atrapalhar, no momento certo.',
  pattern: {
    problem:
      'Pesquisas longas, fora de hora ou em janela que bloqueia a tela irritam e trazem respostas ruins.',
    solution:
      'Uma pergunta curta, logo depois de concluir a tarefa, no fluxo da página, com resposta em um toque e agradecimento.',
  },
  examples: [
    {
      name: 'Depois de agendar',
      description: 'Escolha e envie para ver o agradecimento.',
      component: ExperienceRatingExample,
    },
  ],
  guidelines: {
    do: [
      'Pergunte sobre a tarefa que acabou de acontecer.',
      'Opções em palavras, não só em números ou carinhas.',
    ],
    dont: ['Não pergunte no meio da tarefa nem numa janela que bloqueia.'],
  },
  related: ['choice', 'button'],
};
