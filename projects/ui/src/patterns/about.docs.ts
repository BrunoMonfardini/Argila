import { DocPage } from '../docs/doc-page';

export const ABOUT_PATTERNS_DOCS: DocPage = {
  slug: 'sobre',
  title: 'Sobre padrões',
  category: 'Padrões',
  summary:
    'Soluções prontas para problemas que se repetem nos produtos, montadas com os componentes do Argila.',
  examples: [],
  content: [
    {
      heading: 'O formato',
      body: [
        'Toda página de padrão segue a mesma ordem: Problema, Solução, Exemplo com componentes reais, Variações, Faça e não faça, e os Componentes usados.',
      ],
    },
    {
      heading: 'Funcionam em todos os design systems',
      body: [
        'Os exemplos usam só componentes do núcleo mínimo, que todo design system cura. Troque o design system na barra do topo: o padrão continua valendo.',
      ],
    },
  ],
};
