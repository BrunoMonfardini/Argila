import { DocPage } from '../../docs/doc-page';
import { SpinnerCurrentColorExample } from './examples/spinner-current-color.example';
import { SpinnerSectionExample } from './examples/spinner-section.example';
import { SpinnerSizesExample } from './examples/spinner-sizes.example';
import { ArgSpinner } from './spinner';

export const SPINNER_DOCS: DocPage = {
  slug: 'spinner',
  title: 'Spinner',
  category: 'Componentes',
  summary:
    'Indicador de progresso indeterminado, para esperas curtas ou carregamentos sem forma previsível.',
  component: ArgSpinner,
  playgroundInputs: { size: 'lg' },
  examples: [
    { name: 'Tamanhos', component: SpinnerSizesExample },
    {
      name: 'Seção carregando',
      description: 'Página ou seção inteira: centralize e diga o que está vindo.',
      component: SpinnerSectionExample,
    },
    {
      name: 'Cor do texto',
      description:
        'Com `--arg-spinner-color: currentColor`, acompanha a cor do texto ao redor. Aqui é `decorative`, porque o texto já informa.',
      component: SpinnerCurrentColorExample,
    },
  ],
  guidelines: {
    do: [
      'Diga o que está carregando no `label`: "Carregando pedidos".',
      'Use `sm` ao lado de texto e `lg` em áreas vazias.',
    ],
    dont: [
      'Não use quando a forma do conteúdo é conhecida: prefira o Skeleton.',
      'Não coloque um spinner solto dentro de um botão: use o `loading` do Button.',
    ],
  },
  accessibility: [
    'Tem `role="progressbar"` e o `label` como nome acessível.',
    'Com `decorative`, fica oculto para leitores de tela: use quando o contexto já anuncia o carregamento.',
    'Com `prefers-reduced-motion`, gira mais devagar, sem parar.',
  ],
};
