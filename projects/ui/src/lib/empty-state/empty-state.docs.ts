import { DocPage } from '../../docs/doc-page';
import { ArgEmptyState } from './empty-state';
import { EmptyStateBasicExample } from './examples/empty-state-basic.example';
import { EmptyStateSearchExample } from './examples/empty-state-search.example';

export const EMPTY_STATE_DOCS: DocPage = {
  slug: 'empty-state',
  title: 'Empty State',
  category: 'Componentes',
  group: 'Feedback',
  summary:
    'O que mostrar quando não há dados: um título que diz o que falta, um texto que explica e, se houver, a ação que resolve. Veja também o padrão "Carregamento de lista".',
  component: ArgEmptyState,
  hostElement: 'section',
  playgroundContent: 'Os pedidos feitos no balcão e no site aparecem aqui.',
  playgroundInputs: { heading: 'Nenhum pedido ainda', icon: 'plus', bordered: true },
  examples: [
    { name: 'Simples', component: EmptyStateBasicExample },
    {
      name: 'Com ações',
      description: 'Botões com `arg-empty-state-action` vão para a linha de ações, centralizada.',
      component: EmptyStateSearchExample,
    },
  ],
  guidelines: {
    do: [
      'Diga o que falta e por quê: "Nenhum pedido ainda", não "Sem dados".',
      'Ofereça a ação que resolve, quando existe: cadastrar, limpar a busca, tentar de novo.',
      'Escolha o `level` do título pela hierarquia da página.',
    ],
    dont: [
      'Não use para erros: falha ao carregar é um Alert `danger`, com "Tentar de novo".',
      'Não ponha mais de duas ações.',
    ],
  },
  accessibility: [
    'O título é um `<h2>` a `<h6>` de verdade: quem navega por títulos encontra o estado vazio.',
    'Sobre `<section>`, o estado vazio leva o título como nome (`aria-labelledby`). Sobre `<div>`, fica sem nome, como um bloco comum.',
    'O ícone é decorativo; o texto secundário usa a cor de texto suave, testada no contraste.',
  ],
};
