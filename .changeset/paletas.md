---
'@brunomonfardini/ui': minor
---

**A paleta padrão passa a ser a Massinha**: menta sobre superfícies quase brancas, a nativa do Argila. Todo produto sem paleta própria muda de aparência. Para manter o visual café de antes, use `data-arg-palette="terrosa"`.

- A Terrosa vira uma paleta compartilhada, em `tokens/palettes/terrosa.css` (chega com o `temas.css`).
- Paletas compartilhadas novas: `oceano`, `floresta`, `mono` (preto e branco), `alto-contraste` (texto em AAA) e `viva`. Cada design system aceita algumas: Argila (Terrosa, Oceano, Floresta, Preto e branco, Alto contraste), Transparente (Oceano, Terrosa, Preto e branco), CODA (Viva, Preto e branco, Alto contraste), Windows XP (Alto contraste) e Molde (Terrosa).
- **CODA e Windows XP deixam de aceitar a Terrosa**: o `ArgTheme` troca para a paleta nativa, com aviso em desenvolvimento.
- Token novo `--arg-color-primary-soft` (com `--arg-color-on-primary-soft`): o preenchimento suave da marca, definido por toda paleta.
- Os tons de desabilitado do CODA, do Transparente e do Windows XP passam de bege para cinza neutro.
- O Molde (base interna para criar design systems) troca os neutros bege por cinza.
