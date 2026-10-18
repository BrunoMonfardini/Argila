import { DocPage } from '../../../../../docs/doc-page';
import { PunkStatCardDashboardExample } from './examples/punk-stat-card-dashboard.example';
import { ArgPunkStatCard } from './punk-stat-card';

export const PUNK_STAT_CARD_DOCS: DocPage = {
  slug: 'punk-stat-card',
  title: 'Card de indicador (Punk)',
  category: 'Componentes',
  group: 'Exclusivos',
  designSystem: 'punk',
  summary:
    'Exclusivo do Punk: bloco de cor chapada com um rótulo e um número, como os cards de atividade da referência. Em outros design systems, use um Card.',
  component: ArgPunkStatCard,
  hostElement: 'article',
  playgroundInputs: { label: 'Leads na semana', value: '128' },
  examples: [{ name: 'Painel', component: PunkStatCardDashboardExample }],
  guidelines: {
    do: [
      'Use no máximo três cores de card por tela.',
      'Formate o número antes (`value`): "R$ 2,4 mil", "75%".',
    ],
    dont: [
      'Não ponha gráficos: os cards mostram número e rótulo.',
      'Não use a cor como único sinal de bom ou ruim: diga no detalhe.',
    ],
  },
  accessibility: [
    'É um `<article>` com o rótulo, o número e o detalhe em texto, na ordem de leitura.',
    'O texto é preto sobre as quatro cores claras do Punk, com contraste acima de 4,5:1.',
  ],
};
