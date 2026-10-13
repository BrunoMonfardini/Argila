---
'@brunomonfardini/ui': minor
---

Componente `input[arg-date]`: data com digitação direta em "dd/mm/aaaa" e um botão que abre o calendário num `<dialog>` modal, no padrão "date picker dialog" do ARIA APG (setas, Home/End, PageUp/PageDown, Shift para o ano, Enter, Esc). O formulário recebe a data em ISO. `min`, `max` e `blocked` limitam e bloqueiam dias (riscados no calendário); com Reactive Forms, o campo valida sozinho (`incomplete`, `date`, `dateMin`, `dateMax`, `dateBlocked`). Funções de data exportadas (`formatBr`, `parseBr`, `addDays`, `dateProblem`…). Também os ícones `calendar`, `chevron-left` e `chevron-right`.
