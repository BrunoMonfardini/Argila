---
'@brunomonfardini/ui': minor
---

**Fundos em degradê.** O fundo da página pode ser `liso` (padrão) ou `degrade`: manchas suaves da primária, da secundária e do destaque, misturadas ao fundo, que acompanham a paleta e as cores de marca. Escolha com `ArgTheme.setBackground('degrade')`, `background: 'degrade'` num segmento ou `data-arg-background="degrade"` no `<html>`. Cada DS declara os `fundos` que aceita no manifesto (Argila, CODA, Molde e Transparente aceitam o degradê); um fundo não aceito volta ao padrão, com aviso. O teste de contraste confere o texto sobre cada mancha. Novo token `--arg-gradient-brand`, da primária à secundária, para faixas e banners.
