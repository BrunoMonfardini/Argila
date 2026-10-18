import { DocPage } from '../doc-page';

export const ABOUT_DESIGN_SYSTEMS_DOCS: DocPage = {
  slug: 'sobre',
  title: 'Sobre design systems',
  category: 'Design systems',
  summary:
    'O Argila tem vários design systems distintos sobre os mesmos componentes: cada um com a sua forma, as suas paletas e só os componentes que fazem sentido nele.',
  examples: [],
  content: [
    {
      heading: 'O que muda de um para outro',
      body: [
        'Cada design system tem um manifesto (`ds.ts`) com a linguagem visual, a tipografia, as paletas aceitas, os modos (claro e escuro) e as regras de uso. A forma (raio, borda, sombra, fonte) e a pele de cada componente ficam nos tokens do próprio DS.',
        'Os componentes são de três tipos em cada DS: curados (com pele própria), herdados (usam a aparência padrão, sem curadoria) e fora (não fazem parte do DS). Alguns DS têm ainda componentes exclusivos, como a Janela do Windows XP.',
      ],
    },
    {
      heading: 'Como escolher',
      body: [
        'Troque o design system pela barra no topo: o catálogo inteiro acompanha, e as paletas, as cores e a transparência mostram só o que o DS aceita.',
        'Num produto, escolha com `provideArgila` e um segmento, ou com o atributo `data-arg-style` na raiz da página.',
      ],
    },
  ],
};
