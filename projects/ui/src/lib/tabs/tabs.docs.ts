import { DocPage } from '../../docs/doc-page';
import { TabsAnatomyExample } from './examples/tabs-anatomy.example';
import { TabsManualExample } from './examples/tabs-manual.example';
import { TabsPetExample } from './examples/tabs-pet.example';
import { TabsSegmentedExample } from './examples/tabs-segmented.example';
import { ArgTabs } from './tabs';

export const TABS_DOCS: DocPage = {
  slug: 'tabs',
  title: 'Tabs',
  category: 'Componentes',
  group: 'Navegação',
  summary:
    'Divide um conteúdo em seções do mesmo nível, uma visível por vez: dados, vacinas e histórico de um pet. Segue o padrão "tabs" do ARIA APG. Importe tudo de uma vez com `ARG_TABS`.',
  component: ArgTabs,
  playground: false,
  anatomy: {
    example: TabsAnatomyExample,
    parts: [
      {
        label: 'Lista de abas',
        description: 'Um `tablist` com nome; as setas movem entre as abas.',
        selector: '.arg-tabs__list',
      },
      {
        label: 'Aba selecionada',
        description: 'Marcada pela cor e pelo indicador; `aria-selected`.',
        selector: '.arg-tabs__tab[aria-selected="true"]',
      },
      {
        label: 'Aba',
        description: 'Rótulo curto, de uma ou duas palavras.',
        selector: '.arg-tabs__tab[aria-selected="false"]',
      },
      {
        label: 'Painel',
        description: 'O conteúdo da aba aberta, ligado a ela por `aria-controls`.',
        selector: '.arg-tabs__panel',
      },
    ],
  },
  examples: [
    { name: 'Ficha do pet', component: TabsPetExample },
    {
      name: 'Ativação manual',
      description:
        'Para painéis que demoram a carregar: as setas não abrem a aba, só Enter, Espaço ou clique.',
      component: TabsManualExample,
    },
    {
      name: 'Segmentadas',
      description:
        'Trilho em pílula com a aba aberta em relevo, para alternar poucas visões curtas, como período ou formato.',
      component: TabsSegmentedExample,
    },
  ],
  guidelines: {
    do: [
      'Use rótulos curtos, de uma ou duas palavras, que descrevam o painel.',
      'Use `[(selected)]` com `value` para guardar a aba aberta, ex.: na URL.',
      'Prefira desabilitar a remover uma aba que não se aplica agora: a lista não muda de forma.',
    ],
    dont: [
      'Não use abas para etapas em sequência: isso é o Stepper.',
      'Não use para navegar entre páginas: use links.',
      'Não ponha mais abas do que cabem numa linha no celular.',
    ],
  },
  accessibility: [
    'A lista tem `role="tablist"` e nome (`label`); cada aba tem `role="tab"`, `aria-selected` e `aria-controls`; cada painel tem `role="tabpanel"` e `aria-labelledby` apontando para a aba.',
    'A lista é um único ponto de Tab (na aba aberta). Setas para a esquerda e para a direita trocam de aba, dando a volta; Home e End vão às pontas; abas desabilitadas são puladas.',
    'O painel recebe o foco pelo Tab, para quem lê com o teclado.',
    'A aba aberta tem texto em destaque e uma barra embaixo (ou, na `segmented`, fundo em relevo): não depende só da cor.',
  ],
};
