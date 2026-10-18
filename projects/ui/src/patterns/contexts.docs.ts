import { DocPage } from '../docs/doc-page';
import { ContextFiltersExample, ContextSwitchExample } from './examples/contexts.example';

export const CONTEXTS_PATTERN_DOCS: DocPage = {
  slug: 'contextos',
  title: 'Contextos',
  category: 'Padrões',
  summary:
    'Como a pessoa sabe em qual contexto está (clínica, conta, filtros) e troca de contexto.',
  pattern: {
    problem:
      'Quem trabalha em mais de uma clínica ou com filtros ligados esquece onde está e age no lugar errado.',
    solution:
      'O contexto atual fica sempre à vista no topo, com a troca no mesmo lugar; filtros ativos viram tags que se removem uma a uma.',
  },
  examples: [
    { name: 'Trocar de clínica', component: ContextSwitchExample },
    {
      name: 'Filtros ativos',
      description: 'Remova as tags para ver a lista sem filtros.',
      component: ContextFiltersExample,
    },
  ],
  guidelines: {
    do: [
      'Repita o contexto no texto da tela ("Agenda de hoje em Patas Centro").',
      'Deixe claro quando não há filtro nenhum.',
    ],
    dont: ['Não troque o contexto sem a pessoa pedir.'],
  },
  related: ['select', 'tag'],
};
