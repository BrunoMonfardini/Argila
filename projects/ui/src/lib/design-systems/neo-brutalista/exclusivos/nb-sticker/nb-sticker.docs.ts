import { DocPage } from '../../../../../docs/doc-page';
import { NbStickerRulesExample } from './examples/nb-sticker-rules.example';
import { ArgNbSticker } from './nb-sticker';

export const NB_STICKER_DOCS: DocPage = {
  slug: 'nb-sticker',
  title: 'Sticker (Neo-brutalista)',
  category: 'Componentes',
  group: 'Exclusivos',
  designSystem: 'neo-brutalista',
  summary:
    'Exclusivo do Neo-brutalista: selo inclinado que destaca uma regra ou um aviso curto, como "Uma ação primária". Em outros design systems, use um Badge.',
  component: ArgNbSticker,
  hostElement: 'span',
  playgroundContent: 'Uma ação primária',
  examples: [{ name: 'Regras em selos', component: NbStickerRulesExample }],
  guidelines: {
    do: [
      'Use para frases curtas, de duas a quatro palavras.',
      'Use poucos por tela: o selo chama atenção porque é raro.',
    ],
    dont: [
      'Não use como botão ou link: o selo não é interativo.',
      'Não ponha informação essencial só no selo: ele é reforço.',
    ],
  },
  accessibility: [
    'É texto comum num `<span>`: o leitor de tela lê o selo junto com o conteúdo ao redor.',
    'A inclinação é só visual (`transform`); o texto continua selecionável e com contraste do par de cores do tom.',
  ],
};
