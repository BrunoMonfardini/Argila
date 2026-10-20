# Referências visuais dos design systems

Imagens que cada design system do Argila deve seguir **o mais de perto possível**. O que cada DS aceita e as regras de uso estão no manifesto dele (`projects/ui/src/lib/design-systems/<ds>/ds.ts`) e na página dele no catálogo (Design systems → nome).

| Arquivo                                  | Design system  | Título na imagem                             |
| ---------------------------------------- | -------------- | -------------------------------------------- |
| [argila.jpg](argila.jpg)                 | Argila         | "Product UI Styleguide"                      |
| [neo-brutalista.jpg](neo-brutalista.jpg) | Neo-brutalista | "Neo-Brutalist Design System"                |
| [punk.jpg](punk.jpg)                     | Punk           | app escuro com cards neon                    |
| [windows-xp.jpg](windows-xp.jpg)         | Windows XP     | "Retro-OS UI Kit"                            |
| [transparente.jpg](transparente.jpg)     | Transparente   | botões e cards de vidro espesso (sem título) |

O CODA ainda não tem referência: ele parte do visual atual. Quando tiver, a imagem entra aqui como `coda.jpg`.

A referência do Transparente é uma renderização 3D: o CSS imita o vidro espesso (translucidez, desfoque, aro e brilho), mas não a refração real.

## Regras

- **Só para consulta do time.** As imagens são de terceiros: não entram no pacote `@argila/ui`, no catálogo publicado, em exemplos, em ícones nem em testes.
- Copia-se a **linguagem visual** (forma, tipografia, organização, cores), nunca marcas, textos, fotos ou ilustrações.
- Os textos das imagens têm erros e trechos sem sentido (por exemplo, "Disable" no lugar de "Progress"). Vale o que a imagem **mostra**.
- Trocar uma referência exige revisar o manifesto e o CSS do DS no mesmo PR.
