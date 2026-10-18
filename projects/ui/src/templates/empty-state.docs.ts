import { DocPage } from '../docs/doc-page';
import {
  EmptyListTemplate,
  EmptySearchTemplate,
  FirstUseTemplate,
} from './examples/empty-state-template.example';

export const EMPTY_STATE_TEMPLATE_DOCS: DocPage = {
  slug: 'empty-state',
  title: 'Empty State',
  category: 'Templates',
  summary:
    'Telas sem conteúdo: lista vazia, busca sem resultado e primeiro uso. Sempre dizem por que está vazio e qual é o próximo passo.',
  examples: [
    { name: 'Lista vazia', component: EmptyListTemplate },
    {
      name: 'Busca sem resultado',
      description: 'Apague o termo ou busque "Maria" para ver a lista.',
      component: EmptySearchTemplate,
    },
    { name: 'Primeiro uso', component: FirstUseTemplate },
  ],
  guidelines: {
    do: [
      'Diga o que vai aparecer ali, não só que está vazio.',
      'Ofereça uma ação que resolva: criar, limpar a busca, importar.',
    ],
    dont: ['Não culpe a pessoa ("Você não tem nada").', 'Não use ilustração no lugar do texto.'],
  },
};
