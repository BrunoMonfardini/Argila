import { DocPage } from '../../../../../docs/doc-page';
import { PunkDotTrackCampaignExample } from './examples/punk-dot-track-campaign.example';
import { ArgPunkDotTrack } from './punk-dot-track';

export const PUNK_DOT_TRACK_DOCS: DocPage = {
  slug: 'punk-dot-track',
  title: 'Trilha de pontos (Punk)',
  category: 'Componentes',
  summary:
    'Exclusivo do Punk: pílula com pontos e uma alça que anda, para o andamento de uma campanha ou etapa. Em outros design systems, use a Progress Bar.',
  component: ArgPunkDotTrack,
  playgroundInputs: { label: 'Campanha Inwood', value: 3, max: 8 },
  examples: [{ name: 'Campanhas', component: PunkDotTrackCampaignExample }],
  guidelines: {
    do: [
      'Use para poucas etapas (até uns 10 pontos).',
      'Dê um nome claro no `label`: é ele que o leitor de tela anuncia.',
    ],
    dont: ['Não use para carregamento sem fim: isso é o Spinner ou a Progress Bar indeterminada.'],
  },
  accessibility: [
    'É um `role="progressbar"` com `aria-valuenow`, `aria-valuemax` e o texto "3 de 8".',
    'Os pontos e a alça são só visuais; o valor vem dos atributos.',
  ],
};
