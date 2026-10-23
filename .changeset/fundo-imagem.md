---
'@brunomonfardini/ui': minor
---

**Fundo de imagem nos tokens.** Com `data-arg-background="imagem"` no `<html>` e a imagem em `--arg-background-photo` (ex.: `url("assets/fundo.jpg")`), o `base.css` pinta a imagem desfocada (`--arg-background-blur`, 48px por padrão) numa camada fixa atrás da página. Por cima ficam as manchas translúcidas da primária, da secundária e do destaque, que se movem com `data-arg-background-motion`, e um véu com a cor de fundo (`--arg-background-veil`) que mantém o texto legível. O `body` não pode ter fundo próprio. A escolha pelo `ArgTheme` e pelos segmentos vem numa próxima versão.
