---
'@brunomonfardini/ui': minor
---

**Segmentos**: combinações nomeadas de aparência, declaradas uma vez pelo app.

- `provideArgila({ segments, defaultSegment })` declara os segmentos e aplica o padrão ao iniciar.
- `ArgTheme.setSegment(nome)` aplica de uma vez design system, paleta, cores, modo e transparência, e marca `data-arg-segment`; `segment()` diz qual está aplicado.
- O tipo `ArgSegment` recusa paleta que o design system não aceita.
- `argSegmentAttributes(segmento)` devolve os atributos do `<html>`, para quem não usa o `ArgTheme`.
