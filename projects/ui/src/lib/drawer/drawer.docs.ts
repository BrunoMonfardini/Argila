import { DocPage } from '../../docs/doc-page';
import { DrawerFiltersExample } from './examples/drawer-filters.example';
import { DrawerNavigationExample } from './examples/drawer-navigation.example';

export const DRAWER_DOCS: DocPage = {
  slug: 'drawer',
  title: 'Drawer',
  category: 'Componentes',
  summary:
    'Gaveta modal, aberta pelo serviço `ArgDrawer`: presa à lateral da tela no desktop e subindo de baixo no celular. Para filtros, detalhes de um item e menus de navegação. Usa as mesmas áreas e a mesma referência do Dialog.',
  examples: [
    {
      name: 'Filtros',
      description:
        'Gaveta à direita (`side: \x27end\x27`, o padrão), com ações no rodapé. Diminua a janela para ver a versão de celular.',
      component: DrawerFiltersExample,
    },
    {
      name: 'Menu',
      description: 'Gaveta à esquerda (`side: \x27start\x27`) para navegação.',
      component: DrawerNavigationExample,
    },
  ],
  guidelines: {
    do: [
      'Use para tarefas ligadas à tela atual: filtrar, ver detalhes, escolher uma opção.',
      'Ponha um botão de fechar visível no topo, além do Esc e do clique fora.',
      'No celular, mantenha o conteúdo curto: a gaveta ocupa até 85% da altura.',
    ],
    dont: [
      'Não use para fluxos longos com várias etapas: use uma página.',
      'Não abra uma gaveta a partir de outra gaveta ou de um diálogo.',
    ],
  },
  accessibility: [
    'É o mesmo `<dialog>` modal do Dialog: página inerte, foco preso, Esc e clique fora fecham e o foco volta a quem abriu.',
    'O título com `argDialogTitle` dá nome à gaveta; num menu, use `<nav aria-label>` dentro dela.',
    'A animação de entrada some com `prefers-reduced-motion`.',
  ],
};
