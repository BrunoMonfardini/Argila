import { DocPage } from '../../docs/doc-page';
import { TabsManualExample } from './examples/tabs-manual.example';
import { TabsPetExample } from './examples/tabs-pet.example';
import { ArgTabs } from './tabs';

export const TABS_DOCS: DocPage = {
  slug: 'tabs',
  title: 'Tabs',
  category: 'Componentes',
  summary:
    'Divide um conteúdo em seções do mesmo nível, uma visível por vez: dados, vacinas e histórico de um pet. Segue o padrão "tabs" do ARIA APG. Importe tudo de uma vez com `ARG_TABS`.',
  component: ArgTabs,
  playground: false,
  examples: [
    { name: 'Ficha do pet', component: TabsPetExample },
    {
      name: 'Ativação manual',
      description:
        'Para painéis que demoram a carregar: as setas não abrem a aba, só Enter, Espaço ou clique.',
      component: TabsManualExample,
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
    'A aba aberta tem texto em destaque e uma barra embaixo: não depende só da cor.',
  ],
};
