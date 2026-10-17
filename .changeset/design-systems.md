---
'@brunomonfardini/ui': minor
---

Estilos viram **design systems** com manifesto. `ARG_DESIGN_SYSTEMS` traz, para cada um, os modos de cor, as paletas que aceita e se aceita transparência; os tipos `ArgStyle`, `ArgPalette` e o novo `ArgPaletteOf<'coda'>` saem dele.

- O `ArgTheme` respeita o manifesto: ao trocar de design system, a paleta, o modo e a transparência que ele não aceita voltam ao padrão dele, com aviso no console em desenvolvimento. Novos sinais: `designSystem()`, `palettes()` e `acceptsTransparency()`.
- **CODA e Windows XP não aceitam mais transparência**: `setSurfaceOpacity()` é ignorado neles.
- O CSS de cada design system mudou de lugar: `tokens/design-systems/<ds>/forma.css` e `tokens/design-systems/<ds>/paletas/nativa.css`. Os caminhos antigos (`tokens/styles/<ds>.css` e `tokens/palettes/nativas/<ds>.css`) continuam funcionando e serão removidos numa versão major.
- `ARG_STYLES` fica obsoleto: use `ARG_DESIGN_SYSTEMS[ds].modos`.
- `ARG_SHARED_PALETTES` registra as paletas compartilhadas (nome e se tem arquivo em `tokens/palettes/`). Uma paleta nova entra com o CSS, uma entrada no registro e o id nos manifestos que a aceitam.
