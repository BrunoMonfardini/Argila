---
'@brunomonfardini/ui': minor
---

**Véu automático no fundo de imagem.** Com o fundo `imagem` e sem véu fixado, o `ArgTheme` mede a imagem no navegador (uma cópia de 64×64) e aplica o menor véu com que o texto da página passa no contraste sobre ela; trocar a imagem, o design system, a paleta, as cores ou o modo recalcula. Se a imagem não puder ser lida (de outra origem sem CORS, ou sem navegador), fica o véu padrão de 95%, com aviso. `setBackgroundVeil()` (ou `backgroundVeil` no segmento) passa a **fixar** o véu, e `clearBackgroundVeil()` volta ao calculado; `backgroundVeilFixed()` diz qual vale. Novos na API: `argMinimumVeil`, `argImageExtremes`, `ARG_VEIL_MEASURER` (para trocar a medição em testes) e `ARG_VEIL_SAMPLE_SIZE`.
