# @brunomonfardini/ui

## 0.2.0

### Minor Changes

- 99a5822: Componente `arg-icon` e `provideArgIcons`: ícones desenhados pelo time, registrados por produto, com nome checado na compilação e tamanhos pelos tokens `--arg-icon-size-*`.
- fb3eb5f: Componente `arg-divider` sobre o `<hr>`: horizontal e vertical (com `aria-orientation`), espaçamento por token e modo `decorative`.
- 1299616: Componente `arg-field` e diretiva `argFieldControl` (importe `ARG_FIELD`): rótulo, ajuda e erro ligados ao controle por ids, `aria-invalid` e `aria-required` no controle, e o erro anunciado para leitores de tela quando aparece.
- 56a17f2: `--arg-core-font-sans` passa a usar só a fonte do sistema operacional (`system-ui`); a Inter sai da lista.
- d0dfbdd: Componente `arg-icon-button`: botão só com ícone, com `label` obrigatório (vira o nome acessível; sem ele o template não compila), as mesmas variantes, tamanhos e estados do Button, e variante `tertiary` por padrão.
- a2cc4b5: Ícone `external-link` (`argIconExternalLink`), para links que abrem em outra aba.
- 46192e8: Componente `arg-link`: link de texto sempre sublinhado, variante `muted` e modo `external` (abre em nova aba, com ícone e aviso para leitor de tela; o ícone é registrado pelo próprio componente).

### Patch Changes

- c777e4f: Documenta as inputs `variant`, `size` e `disabled` do Button e `size` do Spinner (JSDoc, visível no editor e no catálogo).

## 0.1.0

### Minor Changes

- 2b570ce: Novos componentes `arg-spinner` (carregamento), `arg-skeleton` (placeholder com shimmer) e lista (`ul[arg-list]`, `li[arg-list-item]`, `a|button[arg-list-action]`, ou `ARG_LIST` para importar tudo). O `arg-button` com `loading` passa a usar o `arg-spinner`, sem mudança visual. No Storybook, a seção "Padrões" mostra como combiná-los.
- dad6fa9: Primeira versão: tokens em três camadas (primitivos, semânticos, componente), tema claro/escuro, serviço `ArgTheme` para marca por tenant e componente `arg-button`.
- bfa1d24: Tokens semânticos de carregamento (`--arg-loading-bg`, `--arg-loading-highlight`, `--arg-loading-shimmer-duration`, `--arg-loading-spin-duration`): sobrescritos no `:root`, mudam o skeleton e o spinner do produto inteiro. O `arg-skeleton` ganha `animated` para desligar o brilho por instância. Durações do shimmer e do spinner passam a vir de tokens, com os mesmos valores (com "reduzir movimento", o spinner gira em 2,1s em vez de 2s).

### Patch Changes

- 8336f49: Pacote publicado no GitHub Packages como `@brunomonfardini/ui` (antes `@argila/ui`, nunca publicado). Veja no README do pacote como configurar o `.npmrc` do produto.
