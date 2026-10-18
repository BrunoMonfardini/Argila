import { DocPage } from '../docs/doc-page';
import { ReceiptTemplate } from './examples/receipt-template.example';

export const RECEIPT_TEMPLATE_DOCS: DocPage = {
  slug: 'receipt',
  title: 'Receipt',
  category: 'Templates',
  summary:
    'Comprovante: o valor e a situação em destaque, os detalhes em seguida e as ações de compartilhar e baixar.',
  examples: [
    {
      name: 'Comprovante de pagamento',
      description: 'Compartilhar e Baixar confirmam com um toast.',
      component: ReceiptTemplate,
    },
  ],
  guidelines: {
    do: [
      'O valor e a situação ("Pago") primeiro: é o que a pessoa procura.',
      'Detalhes em lista de termo e valor (`<dl>`), com os números alinhados.',
    ],
    dont: ['Não esconda o código de autenticação: é ele que vale numa contestação.'],
  },
};
