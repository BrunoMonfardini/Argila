# @brunomonfardini/ui

## 0.1.0

### Minor Changes

- 2b570ce: Novos componentes `arg-spinner` (carregamento), `arg-skeleton` (placeholder com shimmer) e lista (`ul[arg-list]`, `li[arg-list-item]`, `a|button[arg-list-action]`, ou `ARG_LIST` para importar tudo). O `arg-button` com `loading` passa a usar o `arg-spinner`, sem mudança visual. No Storybook, a seção "Padrões" mostra como combiná-los.
- dad6fa9: Primeira versão: tokens em três camadas (primitivos, semânticos, componente), tema claro/escuro, serviço `ArgTheme` para marca por tenant e componente `arg-button`.
- bfa1d24: Tokens semânticos de carregamento (`--arg-loading-bg`, `--arg-loading-highlight`, `--arg-loading-shimmer-duration`, `--arg-loading-spin-duration`): sobrescritos no `:root`, mudam o skeleton e o spinner do produto inteiro. O `arg-skeleton` ganha `animated` para desligar o brilho por instância. Durações do shimmer e do spinner passam a vir de tokens, com os mesmos valores (com "reduzir movimento", o spinner gira em 2,1s em vez de 2s).

### Patch Changes

- 8336f49: Pacote publicado no GitHub Packages como `@brunomonfardini/ui` (antes `@argila/ui`, nunca publicado). Veja no README do pacote como configurar o `.npmrc` do produto.
