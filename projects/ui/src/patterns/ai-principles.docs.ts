import { DocPage } from '../docs/doc-page';
import { AiLimitsExample, AiSuggestionExample } from './examples/ai-principles.example';

export const AI_PRINCIPLES_PATTERN_DOCS: DocPage = {
  slug: 'principios-aplicados-a-ia',
  title: 'Princípios aplicados à IA',
  category: 'Padrões',
  summary:
    'Como apresentar o que foi gerado por IA: marcado, explicado e com a decisão nas mãos da pessoa.',
  pattern: {
    problem:
      'Conteúdo gerado sem aviso parece certeza, e ações automáticas tiram o controle de quem responde por elas.',
    solution:
      'Marque o que foi gerado, diga em que se baseou, avise quando pode errar e deixe a decisão final com a pessoa, com uma alternativa sempre à mão.',
  },
  examples: [
    { name: 'Sugestão', component: AiSuggestionExample },
    { name: 'Limites', component: AiLimitsExample },
  ],
  guidelines: {
    do: [
      'Marque em texto ("Sugestão automática"), não só com ícone ou cor.',
      'Ofereça sempre o caminho manual ao lado da sugestão.',
    ],
    dont: [
      'Não execute ações com efeito (agendar, cobrar, enviar) sem confirmação.',
      'Não esconda a base da sugestão.',
    ],
  },
  related: ['card', 'badge', 'button', 'alert'],
};
