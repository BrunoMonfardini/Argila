# Ícones do Argila

Todos os ícones são desenhados pelo time. O padrão completo está em
[docs/design-system-proprio.md](../../../docs/design-system-proprio.md#12-ícones).

## Resumo do padrão

- Grade de 24×24 (`viewBox="0 0 24 24"`), desenho entre 2 e 22 (margem de 2 px).
- Só traço: `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, pontas e junções `round`.
- Só `<path>`, `<circle>`, `<rect>` e `<line>`, sem `<g>`, `transform` ou `style`.
- Nome do arquivo em kebab-case, pela **forma**: `trash.svg`, não `delete.svg`.

## Ícone novo

1. Salve o SVG nesta pasta (`<nome>.svg`).
2. Rode `pnpm icons`: o gerador valida o arquivo e atualiza
   `src/lib/icon/icons.generated.ts`. Se o SVG fugir do padrão, ele explica o porquê.
3. Abra o PR com o SVG e o arquivo gerado. O CI roda `pnpm icons:check`.
