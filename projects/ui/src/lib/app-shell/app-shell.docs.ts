import { DocPage } from '../../docs/doc-page';
import { ArgAppShell } from './app-shell';
import { AppShellBasicExample, AppShellCompactExample } from './examples/app-shell-basic.example';

export const APP_SHELL_DOCS: DocPage = {
  slug: 'app-shell',
  title: 'App Shell',
  category: 'Componentes',
  summary:
    'Estrutura da aplicação: cabeçalho com a marca do tenant, menu lateral e área principal. Em telas estreitas, o menu vira uma gaveta aberta pelo botão do cabeçalho. A cor da marca vem do `ArgTheme.setBrand`.',
  component: ArgAppShell,
  playground: false,
  examples: [
    { name: 'Desktop', component: AppShellBasicExample },
    {
      name: 'Compacto',
      description:
        'O modo compacto depende da largura do próprio shell, não da janela: abaixo de `compactBelow` px (768), o menu vira gaveta.',
      component: AppShellCompactExample,
    },
  ],
  guidelines: {
    do: [
      'Use um por aplicação, em volta do `<router-outlet>`.',
      'Ponha o menu num `<nav arg-app-shell-nav aria-label="Principal">` e marque a página atual com `aria-current="page"`.',
      'Aplique a marca do tenant depois do login: `theme.setBrand({ primary })`, e passe `brandName` e `brandLogo` ao shell.',
    ],
    dont: [
      'Não ponha ações importantes só no cabeçalho: no celular, o espaço é curto.',
      'Não aninhe um App Shell dentro de outro.',
    ],
  },
  accessibility: [
    'O primeiro Tab mostra o link "Pular para o conteúdo", que leva o foco ao `<main>`.',
    'Cabeçalho, menu e conteúdo usam `<header>`, `<nav>` e `<main>`: o leitor de tela lista as regiões.',
    'No modo compacto, o botão de menu tem nome, `aria-expanded` e `aria-controls`. A gaveta abre com o foco no primeiro link; Esc, clique fora ou escolher um link fecham, e o foco volta ao botão.',
    'O logo é decorativo (`alt=""`): o nome do tenant já está escrito ao lado.',
  ],
};
