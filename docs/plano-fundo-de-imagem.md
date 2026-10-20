# Plano: fundo de imagem desfocada e cores tiradas da imagem

Plano de execução, PR a PR, para duas coisas que o Argila ainda não faz:

1. **Fundo de imagem:** uma imagem do produto atrás da página, desfocada, com as cores de marca passando devagar por cima dela.
2. **Cores a partir de uma imagem:** no Montar tema do catálogo, enviar uma imagem e receber o `provideArgila` com as três cores principais dela, o modo e o fundo.

## O que já existe

| Peça                                                                                                                                               | Onde                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Fundo `degrade`: três manchas radiais (primária, secundária, destaque) a 12% sobre o fundo, como luz desfocada. São **estáticas** e não têm imagem | `tokens/semantic.css` (`--arg-color-background-tint-*`), `tokens/base.css` |
| `background` no segmento, `ArgTheme.setBackground()` e os `fundos` aceitos por DS (Argila, CODA, Molde e Transparente aceitam o `degrade`)         | `design-system.ts`, `theme.ts`, `segments.ts`, `<ds>/ds.ts`                |
| Cores de marca de uma **lista fixa** de 16 nomes, filtrada pelo contraste em cada DS × paleta (`allowedColors()`). Hex livre não entra             | `colors.ts`, `colors.generated.ts`                                         |
| Montar tema: gera o `provideArgila` e o HTML a partir do estado do `ArgTheme`                                                                      | `projects/docs/src/app/pages/theme-builder/`                               |

Faltam: a imagem como fundo, o desfoque, o movimento entre as cores e a leitura das cores de uma imagem.

## Regras

- **O contraste não cede.** O texto da página passa sobre qualquer imagem: um véu com a cor de fundo fica entre a imagem e o conteúdo, e o teste de contraste confere o pior caso (um pixel preto ou branco puro sob o véu).
- **As cores continuam na lista fixa.** A imagem não vira hex livre. Cada cor tirada dela vai para o nome mais próximo da lista que passa no contraste no DS, na paleta e no modo escolhidos. Assim o tema gerado passa nos mesmos testes de qualquer outro.
- **A imagem não sai do navegador.** A extração roda no catálogo, em `<canvas>`, sem enviar nada. O catálogo é estático na Vercel.
- **Movimento opcional e respeitoso:** sem movimento com `prefers-reduced-motion: reduce`, e desligável no segmento.
- Cada linha das tabelas é um PR, com changeset, commits separados por tipo e merge por rebase depois do CI verde. Toda mudança visual passa pelo checkup (`npm run checkup -- --estilos argila,coda,transparente`).

## Decisões

Seguem a opção padrão enquanto não houver outra resposta.

| ID  | Pergunta                                                                                                        | Opção padrão                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | O movimento das cores é um fundo novo ou uma opção dos fundos?                                                  | Uma opção: `backgroundMotion: true` vale para o `degrade` e para o `imagem`. Sem ela, o fundo fica parado, como hoje                                                                                                                        |
| D2  | Como o produto informa a imagem?                                                                                | Por URL no segmento (`backgroundImage: 'assets/fundo.jpg'`), aplicada como a variável CSS `--arg-background-photo`. A opacidade das superfícies funciona do mesmo jeito. Sem Angular, a mesma variável no CSS do produto                    |
| D3  | Desfoque em tempo real (`filter: blur`) ou imagem já desfocada?                                                 | `filter: blur()` numa camada fixa (`html::before`), com `scale(1.1)` para esconder as bordas. É o mais simples para o produto. O guia recomenda uma imagem pequena (até 400 px de largura), porque desfocada ela não perde nada e fica leve |
| D4  | Imagens de uma cor só (como a azul de exemplo) dão três tons de azul, mas a lista tem um azul forte só (`anil`) | O extrator escolhe os três nomes **diferentes** mais próximos (`anil`, `petroleo`, `ardosia` no exemplo) e mostra a distância de cada um. Se faltar cor na lista, ela ganha cores novas num PR à parte (IM-07)                              |
| D5  | Quais DS aceitam o fundo `imagem`?                                                                              | Os que já aceitam o `degrade`: Argila, CODA, Molde e Transparente (vidro sobre a imagem é o caso mais forte). Neo-brutalista, Punk e Windows XP ficam de fora                                                                               |

## Como fica no produto

```ts
provideArgila({
  segments: {
    meuSegmento: {
      style: 'transparente',
      scheme: 'dark',
      colors: { primary: 'anil', secondary: 'petroleo', accent: 'ardosia' },
      surfaceOpacity: 0.65,
      background: 'imagem',
      backgroundImage: 'assets/fundo.jpg',
      backgroundMotion: true,
    },
  },
  defaultSegment: 'meuSegmento',
});
```

Camadas, de baixo para cima: a cor de fundo, a imagem desfocada, as manchas das três cores (paradas ou em movimento), o véu e o conteúdo.

---

## IM: fundo de imagem

| ✓   | ID    | Item                                                                                                                                                                                                                                                                                                                                                                                             | Pronto quando                                                                                                                         | Est. |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| [ ] | IM-01 | `feat(tokens): fundo em movimento` (as posições das manchas do `degrade` viram propriedades registradas com `@property` e andam devagar, num ciclo de uns 30 s, com `data-arg-background-motion` no `<html>`; nada se move com `prefers-reduced-motion`; as cores e o contraste são os mesmos de hoje)                                                                                           | Com o atributo, as manchas se movem no Argila e no Transparente; com movimento reduzido, ficam paradas; o teste de contraste não muda | 1    |
| [ ] | IM-02 | `feat(tokens): fundo imagem` (`data-arg-background='imagem'`: camada fixa `html::before` com `--arg-background-photo`, `filter: blur(var(--arg-background-blur))`, por padrão 48px, e as manchas por cima; véu `--arg-background-veil` com a cor de fundo; `tokens/base.css` ganha a camada)                                                                                                     | Uma imagem qualquer fica desfocada atrás da página em claro e escuro, sem borda visível e sem rolar junto                             | 1    |
| [ ] | IM-03 | `test(scripts): contraste sobre o véu` (em `scripts/lib/pares.ts`, o texto da página sobre o véu misturado ao preto e ao branco puros, em cada DS que aceita `imagem`; o teste diz a opacidade mínima do véu e ela vira o valor do token)                                                                                                                                                        | O teste falha se o véu ficar mais fino que o mínimo; os 4 DS passam em claro e escuro                                                 | 0,5  |
| [ ] | IM-04 | `feat(theme): imagem e movimento no ArgTheme e no segmento` (`'imagem'` em `ArgBackgroundName` e nos `fundos` dos 4 DS; `ArgTheme.setBackgroundImage(url)` e `setBackgroundMotion(on)`; `backgroundImage` e `backgroundMotion` no `ArgSegment`; `argSegmentAttributes` leva o atributo do movimento; a URL é escapada antes de ir para `url("…")`; `imagem` sem URL cai no `degrade`, com aviso) | `provideArgila` com o exemplo acima mostra a imagem; specs de `theme` e `segments` cobrem URL com aspas, sem URL e DS que não aceita  | 1    |
| [ ] | IM-05 | `feat(docs): fundo de imagem no catálogo` (Fundação → Fundos ganha o `imagem` e o movimento, com uma imagem de exemplo do próprio catálogo; a barra de tema oferece "Imagem" e "Movimento"; o Montar tema leva os campos novos para o segmento e para o HTML)                                                                                                                                    | Escolher "Imagem" no catálogo muda o fundo e o código do Montar tema traz `background`, `backgroundImage` e `backgroundMotion`        | 1    |

## CI: cores a partir de uma imagem

| ✓   | ID    | Item                                                                                                                                                                                                                                                                                                                                                                                                                                         | Pronto quando                                                                                                                                    | Est. |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| [ ] | CI-01 | `feat(docs): extrator de cores` (funções puras em `projects/docs/src/app/pages/theme-builder/image-colors.ts`: recebem os pixels (`Uint8ClampedArray`) de uma cópia de 64×64; k-means em OKLab com k=6; descartam os grupos quase pretos ou quase brancos para a marca, mas usam a luminosidade média para sugerir o modo, `dark` abaixo de 0,5; ordenam por área × croma; devolvem as cores com a fatia de cada uma)                        | Specs com imagens sintéticas: três faixas de cor dão as três cores na ordem da área; uma imagem escura sugere `dark`; mesma entrada, mesma saída | 1    |
| [ ] | CI-02 | `feat(docs): cor da imagem para a lista fixa` (para cada cor extraída, o nome de `ARG_BRAND_COLORS` mais próximo em ΔE OKLab, usando o valor `claro` ou `escuro` conforme o modo; só nomes de `allowedColors()` do papel; três nomes diferentes; se o mais próximo já foi usado ou não passa, o seguinte)                                                                                                                                    | Specs: a imagem azul de exemplo dá `anil`, `petroleo` e `ardosia` em `dark`; nenhum resultado fica fora de `allowedColors()`                     | 1    |
| [ ] | CI-03 | `feat(docs): enviar imagem no Montar tema` (uma seção "A partir de uma imagem" com o `arg-file-upload`, só imagens e até 10 MB; a imagem é lida com `createImageBitmap` e desenhada num `<canvas>` fora da tela; mostra a cor original ao lado do nome escolhido, com a distância; "Aplicar" chama `setColorScheme`, `setColors` e `setBackground('imagem')` com a imagem como `blob:` local, e o código do Montar tema se atualiza sozinho) | Enviar a imagem de exemplo muda o catálogo inteiro e o segmento copiado traz as três cores, `scheme: 'dark'` e o fundo; nada sai do navegador    | 1,5  |
| [ ] | CI-04 | `feat(docs): imagem no código e no link` (a URL `blob:` não vai para o código nem para o link: o segmento copiado usa `backgroundImage: 'assets/fundo.jpg'` com um comentário "troque pelo caminho da sua imagem"; o link guarda as cores e o modo, sem a imagem; aviso na tela explicando isso)                                                                                                                                             | O código copiado compila num produto novo com a imagem em `src/assets`; recarregar a página mantém as cores                                      | 0,5  |
| [ ] | CI-05 | `docs: fundo de imagem e cores da imagem` (`projects/ui/README.md`: o fundo `imagem`, o movimento e as dicas de imagem leve; `docs/como-alterar.md`: como mexer no véu e no desfoque; página Ajuda do catálogo: como usar o envio de imagem)                                                                                                                                                                                                 | Um produto chega ao fundo de imagem lendo só o README do pacote                                                                                  | 0,5  |

## Depois, se precisar

| ✓   | ID    | Item                                                                                                                                                                                                                                                                                      | Pronto quando                                                                 | Est. |
| --- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---- |
| [ ] | IM-06 | `feat(docs): baixar a imagem pronta` (no Montar tema, um botão gera a versão leve da imagem enviada, com 400 px de largura em WebP, para o produto usar como `assets/fundo.webp`)                                                                                                         | A imagem baixada tem menos de 40 KB e fica igual à prévia depois de desfocada | 0,5  |
| [ ] | IM-07 | `feat(tokens): mais cores na lista fixa` (se o extrator mostrar distâncias grandes com frequência, por exemplo azuis vivos como o da imagem de exemplo, novas cores em `colors.ts`, como um `cobalto`, geradas com `pnpm colors` e validadas pelo teste de contraste em todo DS × paleta) | As distâncias de CI-02 caem nas imagens de teste; o teste de contraste passa  | 1    |

## Ordem e estimativa

IM-01 → IM-02 → IM-03 → IM-04 → IM-05 entregam o fundo (5 dias de uma pessoa). CI-01 e CI-02 não dependem do IM e podem correr em paralelo; CI-03 e CI-04 precisam do IM-04 (4,5 dias). No total, cerca de 9,5 dias, mais 1,5 se entrarem IM-06 e IM-07.

## Como saber que terminou

- No catálogo publicado, enviar a imagem de exemplo no Montar tema deixa o catálogo escuro, com a imagem desfocada no fundo e as manchas azuis se movendo, e o código copiado reproduz isso num produto.
- `npm run test` confere o contraste do texto sobre o véu em todo DS que aceita `imagem`.
- O checkup não acusa texto com pouco contraste nem rolagem horizontal com o fundo `imagem` ligado.
