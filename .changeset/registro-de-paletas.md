---
'@brunomonfardini/ui': minor
---

`ARG_SHARED_PALETTES` registra as paletas compartilhadas (nome e se tem arquivo em `tokens/palettes/`), e a lista `paletas` dos manifestos só aceita paletas registradas. Uma paleta nova entra com o CSS, uma entrada no registro e o id nos manifestos que a aceitam; o tipo `ArgPalette` e as checagens de contraste acompanham sozinhos.
