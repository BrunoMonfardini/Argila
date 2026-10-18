import { DocPage } from '../doc-page';

export const ABOUT_TEMPLATES_DOCS: DocPage = {
  slug: 'sobre',
  title: 'Sobre templates',
  category: 'Templates',
  summary:
    'Telas prontas para os momentos que todo produto tem (lista vazia, fim de um fluxo, erro, carregamento e comprovante), para copiar e ajustar.',
  examples: [],
  content: [
    {
      heading: 'Funcionam em todos os design systems',
      body: [
        'Os templates usam só componentes do núcleo mínimo, que todo design system cura. Por isso a mesma tela funciona no Argila, no Punk ou no Windows XP: troque o DS na barra do topo para ver.',
      ],
    },
    {
      heading: 'Os templates',
      body: [
        'Empty State: lista vazia, busca sem resultado e primeiro uso.',
        'Ending Screen: sucesso no fim de um fluxo, com os próximos passos.',
        'Error Message: erro de carregamento, sem conexão e sem permissão, com "tentar de novo".',
        'Loaders: carregamento de tela cheia, de seção e de ação.',
        'Receipt: comprovante com resumo, detalhes, compartilhar e baixar.',
      ],
    },
  ],
};
