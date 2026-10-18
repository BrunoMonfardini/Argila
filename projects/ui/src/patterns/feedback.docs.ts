import { DocPage } from '../docs/doc-page';
import { FeedbackFormExample, FeedbackPersistentExample } from './examples/feedback.example';

export const FEEDBACK_PATTERN_DOCS: DocPage = {
  slug: 'erros-e-feedback',
  title: 'Erros e feedback',
  category: 'Padrões',
  summary: 'Como avisar que deu certo, que deu errado e o que precisa de atenção.',
  pattern: {
    problem:
      'Sem retorno, a pessoa não sabe se a ação funcionou; com erro genérico, não sabe o que corrigir.',
    solution:
      'O erro fica junto do que falhou (no campo, com o que fazer), o sucesso passageiro vai num toast, e o que exige ação fica num alerta até ser resolvido.',
  },
  examples: [
    {
      name: 'Formulário com erro',
      description: 'Salve como está para ver o erro; complete o telefone para ver o toast.',
      component: FeedbackFormExample,
    },
    { name: 'Aviso que fica', component: FeedbackPersistentExample },
  ],
  guidelines: {
    do: [
      'Diga o que fazer: "Use 10 ou 11 dígitos", não "Valor inválido".',
      'Toast para o que já deu certo; alerta para o que ainda precisa de ação.',
    ],
    dont: [
      'Não use toast para erro que a pessoa precisa corrigir: ele some.',
      'Não apague o que foi digitado por causa de um erro.',
    ],
  },
  related: ['field', 'input', 'alert', 'toast', 'button'],
};
