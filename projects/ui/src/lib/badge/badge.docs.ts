import { DocPage } from '../../docs/doc-page';
import { ArgBadge } from './badge';
import { BadgeInListExample } from './examples/badge-in-list.example';
import { BadgeTonesExample } from './examples/badge-tones.example';

export const BADGE_DOCS: DocPage = {
  slug: 'badge',
  title: 'Badge',
  category: 'Componentes',
  group: 'Exibição de dados',
  summary:
    'Rótulo curto de status ou categoria, só para leitura: "Confirmado", "Cancelado". Para filtros e seleções removíveis, use a Tag.',
  component: ArgBadge,
  hostElement: 'span',
  playgroundContent: 'Confirmado',
  examples: [
    { name: 'Tons', component: BadgeTonesExample },
    { name: 'Em uma lista', component: BadgeInListExample },
  ],
  guidelines: {
    do: [
      'Use uma ou duas palavras, que façam sentido sem a cor.',
      'Mantenha o mesmo tom para o mesmo status em todo o produto.',
    ],
    dont: [
      'Não use badge como botão ou link: ele não é interativo.',
      'Não use `danger` para algo que não exige atenção.',
    ],
  },
  accessibility: [
    'É texto comum dentro de um `<span>`: o leitor de tela lê o rótulo junto com o conteúdo ao redor.',
    'A cor só reforça o texto; os pares de cor passam no teste de contraste nos temas claro e escuro.',
  ],
};
