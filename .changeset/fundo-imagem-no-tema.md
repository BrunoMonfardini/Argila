---
'@brunomonfardini/ui': minor
---

**Fundo de imagem no `ArgTheme` e nos segmentos.** Novo fundo `imagem`, aceito pelo Argila, CODA, Molde e Transparente. `ArgTheme.setBackgroundImage(url)` define a imagem, `setBackgroundVeil(0 a 1)` afina o véu para uma imagem conhecida (`clearBackgroundVeil()` volta ao padrão, que vale para qualquer imagem) e `setBackgroundMotion(true)` faz as manchas se moverem. Os segmentos ganham `backgroundImage`, `backgroundVeil` e `backgroundMotion`. `setBackground('imagem')` sem imagem usa o `degrade`, com aviso. Para quem aplica o tema sem o `ArgTheme`, `argSegmentAttributes` leva o atributo do movimento e o novo `argSegmentStyles` dá as variáveis CSS do segmento (opacidade das superfícies, imagem e véu).
