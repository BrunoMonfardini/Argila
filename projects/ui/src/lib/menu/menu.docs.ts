import { DocPage } from '../../docs/doc-page';
import { MenuActionsExample } from './examples/menu-actions.example';
import { ArgMenu } from './menu';

export const MENU_DOCS: DocPage = {
  slug: 'menu',
  title: 'Menu',
  category: 'Componentes',
  summary:
    'Lista de ações junto de um botão: remarcar, duplicar, excluir. Segue o padrão "menu button" do ARIA APG. Importe tudo de uma vez com `ARG_MENU`.',
  component: ArgMenu,
  playground: false,
  examples: [{ name: 'Ações', component: MenuActionsExample }],
  guidelines: {
    do: [
      'Use para ações sobre um item, quando não cabem todas como botões.',
      'Comece cada item com um verbo e use `tone="danger"` para a ação destrutiva, separada por um `<hr arg-divider>`.',
      'Deixe desabilitado (`disabled`) o que não se aplica agora, para a lista não mudar de forma.',
    ],
    dont: [
      'Não use para navegar entre páginas: use links.',
      'Não ponha campos ou conteúdo livre: isso é o Popover.',
      'Não aninhe menus.',
    ],
  },
  accessibility: [
    'O gatilho é um `<button>` com `aria-haspopup="menu"`, `aria-expanded` e `aria-controls`; o menu leva o nome dele (`aria-labelledby`).',
    'Clique, Enter, Espaço e seta para baixo abrem com o foco no primeiro item; seta para cima abre no último.',
    'No menu: setas para cima e para baixo (dão a volta), Home e End; digitar letras leva ao item que começa com elas.',
    'Escolher um item ou apertar Esc fecha o menu e devolve o foco ao botão; Tab fecha e segue a ordem da página. Itens desabilitados são pulados.',
  ],
};
