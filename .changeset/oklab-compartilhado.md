---
'@brunomonfardini/ui': minor
---

**Conversão OKLab.** `argSrgbToOklab(r, g, b)` e `argOklabToSrgb(lab)` convertem entre sRGB (canais de 0 a 1) e OKLab, o espaço em que o `color-mix(in oklab, …)` dos tokens mistura as cores. O teste de contraste e o catálogo passam a usar a mesma conversão.
