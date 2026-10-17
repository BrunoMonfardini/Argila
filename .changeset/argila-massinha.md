---
'@brunomonfardini/ui': minor
---

**O Argila ganha a forma "de massinha"** da referência: controles em pílula, cartões com cantos de 20px e sem contorno, volume com sombra difusa e realce de luz, campos rebaixados, botão primário no preenchimento suave da marca com brilho no hover. Vale para todo produto sem `data-arg-style` (o Argila é o padrão).

- Cinco níveis de elevação: `--arg-shadow-1` a `--arg-shadow-5`. No padrão eles reaproveitam `sm`, `md` e `lg`; o Argila define os cinco.
- O CSS do Argila fica em `tokens/design-systems/argila/` (forma e pele de 19 componentes) e chega pelo `argila.css`. Cada design system ganhou um `index.css`; o `temas.css` importa os índices.
- Para manter o visual plano de antes, use `data-arg-style="molde"`.
- O `arg-icon-button` ganha a classe `arg-icon-button` no elemento.
