---
'@brunomonfardini/ui': minor
---

Componente `input[arg-currency]`: valor em reais com os dígitos entrando pela direita ("R$ 123,45") e o valor do formulário em centavos, como inteiro (`12345`), ou `null` vazio. Funciona com Reactive Forms, com formulários de signals (`[formField]`, com `touch` no blur) e com `[(value)]`; `inputmode="numeric"`. Também as funções `formatCents` e `parseCents`.
