import { DocPage } from '../../docs/doc-page';
import { IconInButtonExample } from './examples/icon-in-button.example';
import { IconLabelExample } from './examples/icon-label.example';
import { IconSizesExample } from './examples/icon-sizes.example';
import { ArgIcon } from './icon';

export const ICON_DOCS: DocPage = {
  slug: 'icon',
  title: 'Icon',
  category: 'Componentes',
  summary:
    'Ícone desenhado pelo time, na cor do texto ao redor. Registre os ícones que o produto usa com `provideArgIcons`; a lista completa está em Fundamentos › Ícones.',
  component: ArgIcon,
  playgroundInputs: { name: 'plus', size: 'lg' },
  examples: [
    { name: 'Tamanhos', component: IconSizesExample },
    {
      name: 'No botão',
      description: 'Decorativo, ao lado do rótulo: o botão já dá o espaçamento.',
      component: IconInButtonExample,
    },
    {
      name: 'Com significado',
      description: 'Sozinho, o ícone precisa de `label` para ser anunciado.',
      component: IconLabelExample,
    },
  ],
  guidelines: {
    do: [
      'Registre só os ícones usados: `provideArgIcons([argIconPlus, argIconCheck])`.',
      'Sem `size`, o ícone acompanha o tamanho do texto ao redor.',
    ],
    dont: [
      'Não use ícone sem texto para ações: use um botão com rótulo.',
      'Não mude a cor pelo SVG: o ícone usa `currentColor`, então mude a `color` do elemento.',
    ],
  },
  accessibility: [
    'Sem `label`, o ícone é decorativo e fica oculto para leitores de tela (`aria-hidden="true"`).',
    'Com `label`, recebe `role="img"` e o texto como nome acessível.',
  ],
};
