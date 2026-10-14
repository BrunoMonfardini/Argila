---
'@brunomonfardini/ui': minor
---

Transparência das superfícies: `--arg-surface-opacity` (de 0.4 a 1, padrão 1) deixa `--arg-color-surface`, `-raised` e `-sunken` translúcidas. As cores opacas ficam em `--arg-color-surface-solid`, `-raised-solid` e `-sunken-solid`, que é o que paletas e temas devem sobrescrever. Novo `--arg-surface-blur`, de 0 a 16px conforme a opacidade. `ArgTheme.setSurfaceOpacity()` e `clearSurfaceOpacity()`. Tooltip e Switch usam a superfície opaca.
