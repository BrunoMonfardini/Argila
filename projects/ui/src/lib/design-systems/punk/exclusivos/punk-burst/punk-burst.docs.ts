import { DocPage } from '../../../../../docs/doc-page';
import { PunkBurstCoverExample } from './examples/punk-burst-cover.example';
import { ArgPunkBurst } from './punk-burst';

export const PUNK_BURST_DOCS: DocPage = {
  slug: 'punk-burst',
  title: 'Estrela explosão (Punk)',
  category: 'Componentes',
  summary:
    'Exclusivo do Punk: estrela "explosão", só ornamento, para capas e cards, como na tela de entrada da referência.',
  component: ArgPunkBurst,
  examples: [{ name: 'Capa', component: PunkBurstCoverExample }],
  guidelines: {
    do: ['Use como ornamento de capa, título ou card de destaque.'],
    dont: [
      'Não use como ícone de ação nem para comunicar estado: ela é escondida do leitor de tela.',
      'Não use mais de uma ou duas por tela.',
    ],
  },
  accessibility: [
    'É decorativa: `aria-hidden="true"` e o SVG fora do foco (`focusable="false"`).',
    'Em alto contraste, a estrela usa a cor do texto do sistema.',
  ],
};
