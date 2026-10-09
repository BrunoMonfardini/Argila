import { DocPage } from '../../docs/doc-page';
import { IconButtonSizesExample } from './examples/icon-button-sizes.example';
import { IconButtonStatesExample } from './examples/icon-button-states.example';
import { IconButtonToolbarExample } from './examples/icon-button-toolbar.example';
import { IconButtonVariantsExample } from './examples/icon-button-variants.example';
import { ArgIconButton } from './icon-button';

export const ICON_BUTTON_DOCS: DocPage = {
  slug: 'icon-button',
  title: 'Icon Button',
  category: 'Componentes',
  summary:
    'Botão só com ícone, para ações conhecidas em pouco espaço: fechar, adicionar, editar. O `label` é obrigatório e vira o nome do botão para leitores de tela.',
  component: ArgIconButton,
  hostElement: 'button',
  playgroundInputs: { icon: 'x', label: 'Fechar' },
  examples: [
    { name: 'Variantes', component: IconButtonVariantsExample },
    {
      name: 'Tamanhos',
      description: 'O ícone acompanha o tamanho do botão; o grande atinge 48 px de área de toque.',
      component: IconButtonSizesExample,
    },
    { name: 'Estados', component: IconButtonStatesExample },
    {
      name: 'Barra de ações',
      description: 'Rótulos específicos: "Cancelar pedido", não só "Cancelar".',
      component: IconButtonToolbarExample,
    },
  ],
  guidelines: {
    do: [
      'Use só para ações que o ícone deixa óbvias; na dúvida, use o `arg-button` com texto.',
      'Escreva o `label` com o objeto da ação quando houver vários na tela: "Excluir agendamento de Maria".',
      'Ajuste cores e tamanhos com os tokens `--arg-button-*`, os mesmos do Button.',
    ],
    dont: [
      'Não use para a ação principal da tela: ela merece texto.',
      'Não repita o mesmo ícone com significados diferentes na mesma tela.',
    ],
  },
  accessibility: [
    'O `label` vira o `aria-label` do botão; o ícone dentro dele é decorativo (`aria-hidden`).',
    'É um `<button>` nativo: Enter e Espaço acionam. Em `<a arg-icon-button>`, desabilitado vira `aria-disabled` e sai da ordem de tabulação.',
    'Carregando, recebe `aria-busy="true"`, fica desabilitado e o spinner aparece no lugar do ícone.',
  ],
};
