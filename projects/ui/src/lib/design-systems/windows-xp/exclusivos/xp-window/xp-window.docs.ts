import { DocPage } from '../../../../../docs/doc-page';
import { XpWindowConfirmExample } from './examples/xp-window-confirm.example';
import { ArgXpWindow } from './xp-window';

export const XP_WINDOW_DOCS: DocPage = {
  slug: 'xp-window',
  title: 'Janela (Windows XP)',
  category: 'Componentes',
  group: 'Exclusivos',
  designSystem: 'windows-xp',
  summary:
    'Exclusivo do Windows XP: painel com barra de título azul e os botões de minimizar, maximizar e fechar, como as janelas do "Retro-OS UI Kit".',
  component: ArgXpWindow,
  playground: false,
  examples: [{ name: 'Confirmação', component: XpWindowConfirmExample }],
  guidelines: {
    do: [
      'Mostre só os botões que fazem algo (`controls`): um botão sem efeito confunde.',
      'Use um título curto: ele também nomeia a janela para o leitor de tela.',
    ],
    dont: [
      'Não use como diálogo modal: para isso há o Dialog, que prende o foco e devolve ao fechar.',
    ],
  },
  accessibility: [
    'É uma `<section>` com nome (`aria-labelledby` aponta para o título da barra).',
    'Os botões são `<button>` nativos com nome que inclui o título: "Fechar Confirmação". Os desenhos são decorativos.',
  ],
};
