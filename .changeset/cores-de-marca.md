---
'@brunomonfardini/ui': minor
---

**Cores de marca da lista fixa.** `ARG_BRAND_COLORS` traz 16 cores (cobre, caramelo, terracota, oliva, musgo, petróleo, ardósia, anil, ameixa, vinho, coral, mostarda, grafite, areia, menta e lavanda) para a primária, a secundária e o destaque.

- `ArgTheme.setColors({ primary, secondary, accent })` só aplica as que passam no contraste no design system e na paleta atuais (`allowedColors()`, de `ARG_ALLOWED_COLORS`), avisa das outras em desenvolvimento e revalida ao trocar de design system ou paleta. `clearColors()` volta às cores da paleta.
- Sem Angular: `data-arg-primary`, `data-arg-secondary` e `data-arg-accent` no `<html>`, com o `temas.css` (que traz o `tokens/colors.css` por último).
- `setBrand()` com cor livre continua funcionando.
