import { DocPage } from '../docs/doc-page';
import { ReceiptsActionsExample, ReceiptsHistoryExample } from './examples/receipts.example';

export const RECEIPTS_PATTERN_DOCS: DocPage = {
  slug: 'comprovantes',
  title: 'Comprovantes',
  category: 'Padrões',
  summary: 'Como mostrar comprovantes e o histórico deles, para a pessoa conferir e guardar.',
  pattern: {
    problem:
      'Comprovantes sem situação clara, com o valor escondido no meio do texto, viram chamado no suporte.',
    solution:
      'O valor e a situação em destaque, a data em formato curto e as mesmas ações em todo comprovante. Para a tela completa, veja o template Receipt.',
  },
  examples: [
    { name: 'Histórico', component: ReceiptsHistoryExample },
    { name: 'Ações', component: ReceiptsActionsExample },
  ],
  guidelines: {
    do: [
      'Situação com texto e tom ("Pago", "Estornado").',
      'Números alinhados (`tabular-nums`) para comparar valores.',
    ],
    dont: ['Não misture comprovantes com outras notificações.'],
  },
  related: ['card', 'badge', 'button'],
};
