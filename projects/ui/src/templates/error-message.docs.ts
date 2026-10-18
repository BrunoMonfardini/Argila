import { DocPage } from '../docs/doc-page';
import {
  ErrorLoadingTemplate,
  ErrorOfflineTemplate,
  ErrorPermissionTemplate,
} from './examples/error-message-template.example';

export const ERROR_MESSAGE_TEMPLATE_DOCS: DocPage = {
  slug: 'error-message',
  title: 'Error Message',
  category: 'Templates',
  summary:
    'Quando algo dá errado: erro de carregamento, sem conexão e sem permissão. Sempre com o que aconteceu e o que fazer.',
  examples: [
    {
      name: 'Erro de carregamento',
      description:
        'O alerta fica no lugar do conteúdo; "Tentar de novo" mostra o carregamento no botão.',
      component: ErrorLoadingTemplate,
    },
    { name: 'Sem conexão', component: ErrorOfflineTemplate },
    { name: 'Sem permissão', component: ErrorPermissionTemplate },
  ],
  guidelines: {
    do: [
      'Diga o que aconteceu em linguagem simples e o que a pessoa pode fazer.',
      'Guarde o que já foi preenchido: o erro não pode custar trabalho.',
    ],
    dont: [
      'Não mostre códigos técnicos ("Erro 503") sem explicação.',
      'Não use só cor para dizer que é erro: o alerta tem ícone e o nome do tom.',
    ],
  },
};
