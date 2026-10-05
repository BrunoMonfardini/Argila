import { DocPage } from '../../docs/doc-page';
import { ArgButton } from './button';
import { ButtonSizesExample } from './examples/button-sizes.example';
import { ButtonStatesExample } from './examples/button-states.example';
import { ButtonVariantsExample } from './examples/button-variants.example';

export const BUTTON_DOCS: DocPage = {
  slug: 'button',
  title: 'Button',
  category: 'Componentes',
  summary:
    'Dispara uma ação: primária, secundária, terciária ou destrutiva, com estado de carregamento. Use uma única variante primária por tela.',
  component: ArgButton,
  hostElement: 'button',
  playgroundContent: 'Salvar',
  examples: [
    { name: 'Variantes', component: ButtonVariantsExample },
    {
      name: 'Tamanhos',
      description: 'O grande atinge a área de toque recomendada (48 px).',
      component: ButtonSizesExample,
    },
    {
      name: 'Estados',
      description: 'Carregando bloqueia o clique e mantém a largura do rótulo.',
      component: ButtonStatesExample,
    },
  ],
  guidelines: {
    do: [
      'Use verbos no rótulo: "Salvar", "Enviar convite".',
      'Use `<a arg-button>` quando a ação navega para outra página.',
    ],
    dont: [
      'Não use a variante danger para ações reversíveis.',
      'Não coloque dois botões primários lado a lado.',
    ],
  },
  accessibility: [
    'É um `<button>` nativo: Enter e Espaço acionam, e o foco aparece com o anel de foco.',
    'Carregando, o botão recebe `aria-busy="true"` e fica desabilitado.',
    'Em `<a arg-button>`, desabilitado vira `aria-disabled` e sai da ordem de tabulação.',
  ],
};
