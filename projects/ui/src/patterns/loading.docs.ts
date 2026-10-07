import { DocPage } from '../docs/doc-page';
import {
  ListLoadingEmptyExample,
  ListLoadingExample,
  ListLoadingHeldExample,
} from './examples/list-loading.example';

export const LIST_LOADING_DOCS: DocPage = {
  slug: 'carregamento-de-lista',
  title: 'Carregamento de lista',
  category: 'Padrões',
  summary:
    'Como combinar Skeleton, Spinner e List numa tela que busca dados: skeleton no primeiro carregamento, spinner no botão ao recarregar e estado vazio quando não há nada.',
  examples: [
    {
      name: 'Primeiro carregamento',
      description: 'Recarregue a página para ver de novo; depois, use o botão Recarregar.',
      component: ListLoadingExample,
    },
    { name: 'Vazio', component: ListLoadingEmptyExample },
    {
      name: 'Sempre carregando',
      description: 'Fica em skeleton, para inspecionar o layout do placeholder.',
      component: ListLoadingHeldExample,
    },
  ],
  guidelines: {
    do: [
      'Skeleton no primeiro carregamento de conteúdo com forma conhecida (listas, cards).',
      'Spinner no botão (`loading`) para ações do usuário que atualizam o que já está na tela.',
      'Spinner solto quando o carregamento não tem forma previsível.',
      'Estado vazio que diga o que falta e, se possível, como resolver.',
    ],
    dont: [
      'Não mostre indicador em esperas abaixo de ~300 ms.',
      'Não troque a lista por skeleton ao recarregar: o conteúdo atual fica na tela.',
    ],
  },
  accessibility: [
    'A lista em skeleton tem `aria-busy="true"` e `aria-label="Carregando pedidos"`; as linhas falsas ficam ocultas.',
    'Ao recarregar, a lista recebe `aria-busy` e o botão anuncia o carregamento.',
  ],
};
