import { DocPage } from '../../docs/doc-page';
import { ListInteractiveExample } from './examples/list-interactive.example';
import { ListOrderedExample } from './examples/list-ordered.example';
import { ListPeopleExample } from './examples/list-people.example';
import { ListSimpleExample } from './examples/list-simple.example';
import { ArgList } from './list';

export const LIST_DOCS: DocPage = {
  slug: 'list',
  title: 'List',
  category: 'Componentes',
  summary:
    'Lista de itens sobre `<ul>` e `<ol>` nativos, com áreas para ícone ou avatar, título, descrição e valor à direita. Importe tudo de uma vez com `ARG_LIST`.',
  component: ArgList,
  playground: false,
  examples: [
    { name: 'Com avatar', component: ListPeopleExample },
    {
      name: 'Simples',
      description: 'Só texto, sem contêiner: para listas dentro de cards ou painéis.',
      component: ListSimpleExample,
    },
    {
      name: 'Interativa',
      description:
        'Cada item contém um link ou botão com `arg-list-action`, que ocupa a linha inteira.',
      component: ListInteractiveExample,
    },
    {
      name: 'Ordenada',
      description: 'A numeração vem do `<ol>` e é lida por leitores de tela.',
      component: ListOrderedExample,
    },
  ],
  guidelines: {
    do: [
      'Use `bordered` para listas soltas na página e deixe sem borda dentro de cards.',
      'Use `<a arg-list-action>` quando o item abre outra página e `<button arg-list-action>` quando executa uma ação.',
    ],
    dont: [
      'Não coloque dois links ou botões que ocupam a linha no mesmo item.',
      'Não use `<ol>` quando a ordem não importa.',
    ],
  },
  accessibility: [
    'É um `<ul>` ou `<ol>` nativo: o leitor de tela anuncia a quantidade de itens e a posição de cada um.',
    'Itens interativos mantêm a semântica de link ou botão, com o anel de foco na linha inteira.',
    'Avatares e números decorativos levam `aria-hidden="true"`: o título já identifica o item.',
  ],
};
