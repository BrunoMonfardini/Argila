---
'@brunomonfardini/ui': patch
---

**Calendário do campo de data aceita clique.** Clicar num dia do calendário do `input[arg-date]` não fazia nada: o diálogo fica dentro do `arg-date-toggle`, cujo host tem `pointer-events: none`, e herdava o none. O diálogo agora devolve `pointer-events: auto`. Um teste em `scripts/` confere que todo botão e diálogo dentro de um host assim libera o clique.
