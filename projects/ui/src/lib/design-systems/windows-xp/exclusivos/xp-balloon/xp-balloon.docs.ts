import { DocPage } from '../../../../../docs/doc-page';
import { XpBalloonUpdateExample } from './examples/xp-balloon-update.example';
import { ArgXpBalloon } from './xp-balloon';

export const XP_BALLOON_DOCS: DocPage = {
  slug: 'xp-balloon',
  title: 'Balão (Windows XP)',
  category: 'Componentes',
  summary:
    'Exclusivo do Windows XP: balão de aviso curto, como o "System Update Complete" da referência. Para avisos que somem sozinhos, use o Toast.',
  component: ArgXpBalloon,
  hostElement: 'div',
  playgroundContent: 'Atualização concluída',
  examples: [{ name: 'Aviso de atualização', component: XpBalloonUpdateExample }],
  guidelines: {
    do: ['Use frases curtas, que façam sentido sozinhas: "Atualização concluída".'],
    dont: [
      'Não ponha botões ou links dentro: o balão é só um aviso.',
      'Não mostre vários ao mesmo tempo: o leitor de tela anuncia cada um.',
    ],
  },
  accessibility: [
    'É um `role="status"`: quando aparece ou muda, o leitor de tela anuncia o texto sem mover o foco.',
    'A ponta é só desenho; em alto contraste o balão ganha borda.',
  ],
};
