import { DocPage } from '../docs/doc-page';
import {
  LoaderActionTemplate,
  LoaderPageTemplate,
  LoaderSectionTemplate,
} from './examples/loaders-template.example';

export const LOADERS_TEMPLATE_DOCS: DocPage = {
  slug: 'loaders',
  title: 'Loaders',
  category: 'Templates',
  summary:
    'Carregamento de tela cheia, de seção e de ação: o tamanho do aviso acompanha o tamanho do que está esperando.',
  examples: [
    { name: 'Tela cheia', component: LoaderPageTemplate },
    { name: 'Seção', component: LoaderSectionTemplate },
    {
      name: 'Ação',
      description: 'Clique para ver o botão carregando e a barra com o quanto falta.',
      component: LoaderActionTemplate,
    },
  ],
  guidelines: {
    do: [
      'Carregue só o pedaço que espera: o resto da tela continua usável.',
      'Com duração conhecida (envio de arquivo), mostre a barra de progresso.',
      'Dê nome ao carregamento (`label`): o leitor de tela anuncia o que está acontecendo.',
    ],
    dont: ['Não bloqueie a tela inteira por uma ação pequena.'],
  },
};
