---
'@brunomonfardini/ui': minor
---

**Fundo de imagem nos tokens.** Com `data-arg-background="imagem"` no `<html>` e a imagem em `--arg-background-photo` (ex.: `url("assets/fundo.jpg")`), o `base.css` pinta a imagem desfocada (`--arg-background-blur`, 48px por padrão) numa camada fixa atrás da página, com as manchas translúcidas da primária, da secundária e do destaque por cima (elas se movem com `data-arg-background-motion`). Cobrindo as duas, um véu com a cor de fundo (`--arg-background-veil`) mantém o texto legível: o padrão, 95%, vale para qualquer imagem, inclusive com pixels pretos ou brancos puros; para uma imagem conhecida, um véu mais fino pode ser calculado. O `body` não pode ter fundo próprio. A escolha pelo `ArgTheme` e pelos segmentos vem numa próxima versão.
