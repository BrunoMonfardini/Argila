# Plano: cada design system o mais próximo possível da sua referência

Plano de execução, PR a PR, para deixar cada design system igual à imagem dele em [`docs/referencias/`](referencias/README.md). Ele substitui os marcos A e R do [plano geral](plano-argila-e-catalogo.md), que segue com os fundos (F), o catálogo (L) e a personalização (P).

## Regras

- **A referência manda.** Cor, forma, tipografia e o desenho de cada componente seguem a imagem. Quando a imagem não mostra um caso (modo escuro, um componente que ela não tem), ele segue a mesma linguagem.
- **O contraste não cede.** Uma cor da referência que não passa no teste (4,5:1 no texto, 3:1 em bordas e foco) é ajustada o mínimo possível, e o ajuste fica registrado no CSS ao lado da cor original.
- **Só o CSS do DS muda** (`tokens/design-systems/<ds>/`): forma, paleta nativa e pele dos componentes. Componentes, inputs e comportamento não mudam, então os produtos não precisam alterar nada.
- **Todo PR traz a comparação** lado a lado com a referência (G-01) e passa pelo checkup nos modos do DS.
- Cada linha das tabelas é um PR, com commits separados por tipo e merge por rebase depois do CI verde. Marque a caixa quando o PR for mergeado.

## Onde estamos

_Atualizado em 20/10/2026._

| Marco                       | Situação |
| --------------------------- | -------- |
| G: ferramenta de comparação | Pronto   |
| AR: Argila                  | Pronto   |
| NB: Neo-brutalista          | Pronto   |
| TR: Transparente            | Pronto   |
| XP: Windows XP              | A fazer  |
| PK: Punk                    | A fazer  |

O CODA não tem imagem de referência e fica fora deste plano até ganhar uma.

---

## G: ferramenta de comparação

| ✓   | ID   | Item                                                                                                                                                                                                                                                               | Pronto quando                                                                           | Est. |
| --- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ---- |
| [x] | G-01 | `feat(scripts): comparação com a referência` (`npm run comparar -- --ds <id>`: captura a página do DS no catálogo, nos modos dele, e monta `comparacao/<ds>.html` com a imagem de referência ao lado, na mesma altura; local, fora do git e do catálogo publicado) | Um comando gera a comparação de qualquer DS com referência                              | 1    |
| [x] | G-02 | `feat(docs): página do DS no formato da referência` (a página de cada DS ganha uma "folha de estilo" com as mesmas seções da imagem, na mesma ordem, montada com os componentes de verdade; o conteúdo de cada folha vem nos itens de cada DS)                     | A página do Argila mostra a folha; os outros DS mostram a folha padrão até o item deles | 1,5  |

---

## AR: Argila — "Product UI Styleguide"

### Leitura da referência

| Aspecto     | Na imagem                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linguagem   | 3D macio "de massinha": superfícies quase brancas, volume com sombra difusa embaixo e realce de luz em cima, nada de contorno escuro                                                                                                                                                                                                                                                    |
| Cores       | Primária menta `#9FE3C7` (só em preenchimentos); superfície `#FFFFFE`; fundo `#F2F2EF`; borda `#E5E5E0`; anel de foco `#7FE0C0` com brilho; sucesso menta, aviso amarelo `#F3E08A`, erro rosa `#F09A9A`; texto cinza-escuro neutro                                                                                                                                                      |
| Tipografia  | Sans neutra; escala Display, H1, H2, H3, Body e Caption; títulos em cinza-escuro, peso médio                                                                                                                                                                                                                                                                                            |
| Forma       | Controles em pílula; cards com raio de 20px; cinco níveis de elevação, cada um com mais deslocamento e desfoque                                                                                                                                                                                                                                                                         |
| Componentes | Botão menta (padrão, hover com brilho, desabilitado cinza); busca rebaixada dentro de um aro em relevo, com lupa no fim; chips (filtro com ícone, selecionado com ✓, desabilitado); abas segmentadas (trilho cinza, aba aberta em menta) e sublinhadas (barra menta); alertas em pílula preenchida com ícone em círculo; card com camadas embaixo, miniatura de imagem e pílula de ação |

### PRs

| ✓   | ID    | Item                                                                                                                                                                                                      | Pronto quando                                                      | Est. |
| --- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---- |
| [x] | AR-01 | `feat(argila): cores da referência` (texto, links e rótulos em cinza neutro; menta só em preenchimentos, foco e destaques; feedback menta, amarelo e rosa)                                                | Nenhum texto corrido em verde; o contraste passa em claro e escuro | 1    |
| [x] | AR-02 | `feat(argila): alertas e toasts em pílula preenchida` (fundo chapado no tom, sem contorno nem faixa, ícone em círculo de contorno, texto escuro)                                                          | Os três alertas da referência reproduzidos                         | 0,5  |
| [x] | AR-03 | `feat(argila): campo rebaixado com aro em relevo` (Input, Select e grupo com ação)                                                                                                                        | A busca da referência reproduzida, com o foco menta brilhando      | 1    |
| [x] | AR-04 | `feat(argila): abas e chips` (segmentadas, sublinhadas, chips de filtro, selecionado e desabilitado)                                                                                                      | As duas abas e os três chips da referência reproduzidos            | 1    |
| [x] | AR-05 | `feat(argila): botões` (menta com volume; hover com brilho; desabilitado cinza sem volume)                                                                                                                | Os três botões da referência reproduzidos                          | 0,5  |
| [x] | AR-06 | `feat(argila): cards e elevação em camadas` (cinco níveis; card com camadas embaixo e miniatura)                                                                                                          | O card e a pilha de elevação da referência reproduzidos            | 1    |
| [x] | AR-07 | `feat(argila): escala tipográfica`                                                                                                                                                                        | A escala da referência na Fundação → Tipografia                    | 0,5  |
| [x] | AR-08 | `docs(argila): folha de estilo da referência` (Color Tokens, Typography Scale, Spacing, Radius, Elevation, Buttons, Inputs, Chips, Tabs, Alerts e Cards, na grade da imagem, com a régua fina de moldura) | A página do Argila lado a lado com `argila.jpg`                    | 1,5  |

---

## NB: Neo-brutalista — "Neo-Brutalist Design System"

### Leitura da referência

| Aspecto     | Na imagem                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linguagem   | "Bold. Loud. Systematic. Usable.": traço preto grosso, cantos retos, blocos de cor chapada, grade rígida, alto contraste                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Cores       | Ciano `#00C2CB`, magenta `#FF00FF`, amarelo `#FFD700`, preto `#000000`, branco `#FFFFFF` e papel bege `#F5F5DC`. Nos componentes ainda aparecem o **verde** dos alertas de sucesso, o **rosa claro** de um toast e o **salmão** do botão destrutivo em contorno                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Tipografia  | Títulos em caixa alta, pesados (Archivo Black); corpo Archivo; H1 96, H2 64, H3 48, H4 32, Body 18 e Caption 14 px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Forma       | Contorno preto de 3px; raio de no máximo 4px; sombras duras (0, 4 e 12px); alvo mínimo de 44px; foco sempre visível                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Componentes | Botões preenchido (ciano), contorno, texto, destrutivo (magenta e salmão), ícone quadrado; campo com erro em vermelho; checkbox e radio pretos; toggle OFF preto e ON amarelo; abas com a ativa em ciano e contador amarelo; passos numerados em ciano, amarelo e branco; paginação em quadrados com a atual em ciano; card com imagem e botão ciano; item de lista com avatar; selos coloridos; avatar quadrado ciano e redondo magenta; tooltip preto; tabela com cabeçalho preto; toasts ciano, amarelo e rosa; alertas verde, amarelo e magenta; modal em moldura cinza; barra de progresso ciano com a porcentagem; estado vazio; adesivos inclinados ("Focus always visible") |

### PRs

| ✓   | ID    | Item                                                                                                                                                                                                                                         | Pronto quando                                                | Est. |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---- |
| [x] | NB-01 | `feat(neo-brutalista): todas as cores da referência` (os seis blocos e mais verde, rosa claro e salmão como tokens da paleta nativa; feedback chapado: sucesso verde, aviso amarelo, erro magenta, informação ciano, sempre com texto preto) | As cores da referência existem e passam no contraste         | 1    |
| [x] | NB-02 | `feat(neo-brutalista): alertas, toasts e modal` (preenchidos no tom, contorno de 3px, sombra dura; modal em moldura cinza)                                                                                                                   | A seção Feedback da referência reproduzida                   | 1    |
| [x] | NB-03 | `feat(neo-brutalista): botões e controles` (as cinco variantes, ícone quadrado; toggle amarelo; checkbox e radio pretos)                                                                                                                     | As seções Buttons e Controls reproduzidas                    | 1    |
| [x] | NB-04 | `feat(neo-brutalista): abas, passos, paginação e breadcrumb` (aba ativa ciano com contador amarelo; passos coloridos; quadrados com a atual em ciano)                                                                                        | As seções Tabs, Steps, Pagination e Breadcrumbs reproduzidas | 1    |
| [x] | NB-05 | `feat(neo-brutalista): dados` (card com título em caixa alta e botão ciano; selos chapados; avatares; tooltip preto; cabeçalho da tabela preto)                                                                                              | A seção Data display reproduzida                             | 1    |
| [x] | NB-06 | `docs(neo-brutalista): folha de estilo da referência` (Foundations, Components, Data display e Feedback, com os adesivos inclinados como regras de uso)                                                                                      | A página do Neo-brutalista lado a lado com a imagem          | 1,5  |

---

## TR: Transparente — botões e cards de vidro espesso

### Leitura da referência

| Aspecto     | Na imagem                                                                                                                                                                                                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linguagem   | Vidro claro, espesso e translúcido, sobre fundo cinza-claro; aro fino e claro com brilho iridescente (arco-íris) nos cantos; reflexo no topo; sombra colorida e difusa embaixo                                                                                                                                        |
| Cores       | Fundo `#E9EAEE`; primário em degradê laranja-coral (do `#FF8A4C` ao `#E8461E`) com texto branco; destaque em degradê azul (do `#4FB2F7` ao `#1E4FD6`, o "Pro plan"); sucesso verde-água (`#2BB58A`, no switch e no checkbox); texto cinza-ardósia `#33415C`; toast com contorno laranja fino                          |
| Forma       | Tudo em pílula, inclusive campos e abas; cards com raio de uns 24px; botão de ícone quadrado de cantos arredondados                                                                                                                                                                                                   |
| Componentes | Botão primário (laranja), secundário (vidro incolor) e de ícone; busca com lupa e um segmento "+" de vidro no fim; select com checkbox verde-água à direita; switch verde-água com botão branco; abas e toast em pílula de vidro com ícone; card de vidro grande; painel com título, fechar e o botão azul "Pro plan" |

### PRs

| ✓   | ID    | Item                                                                                                                                                               | Pronto quando                                       | Est. |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ---- |
| [x] | TR-01 | `feat(transparente): as cores da referência` (primário e destaque em degradê, com contraste de 4,5:1 em todo ponto; verde-água; texto ardósia; fundo cinza-claro)  | Os botões laranja e "Pro plan" reproduzidos         | 1    |
| [x] | TR-02 | `feat(transparente): vidro claro e fino` (aro de 1px claro, brilho iridescente nos cantos, reflexo no topo, sombra colorida difusa; sem o contorno escuro de hoje) | O card e o painel da referência reproduzidos        | 1,5  |
| [x] | TR-03 | `feat(transparente): botões e campos` (secundário incolor; botão de ícone quadrado; busca com o segmento "+"; select com o checkbox verde-água)                    | As três primeiras linhas da referência reproduzidas | 1    |
| [x] | TR-04 | `feat(transparente): switch, abas e toast` (switch verde-água; abas e toast em pílula de vidro; toast com contorno laranja)                                        | A quarta linha da referência reproduzida            | 1    |
| [x] | TR-05 | `docs(transparente): folha de estilo da referência` (a folha de componentes de vidro, na mesma grade da imagem, sobre o fundo em degradê do marco F como sugestão) | A página do Transparente lado a lado com a imagem   | 1    |

---

## XP: Windows XP — "Retro-OS UI Kit"

### Leitura da referência

| Aspecto     | Na imagem                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linguagem   | Sistema operacional retrô: janelas com barra de título azul, bordas de 1px, fundo com linhas de varredura horizontais, ícones em pixel                                                                                                                                                                                                                                                  |
| Cores       | Cinza `#A0A0A0`, branco `#F0F0F0`, azul `#0078D7` e vermelho `#E81123`, cada um com uma rampa de cinco tons (do escuro ao claro, com um tom pontilhado no meio)                                                                                                                                                                                                                         |
| Tipografia  | Títulos em fonte bitmap, em caixa alta e azul (Pixelify Sans); rótulos em sans moderna; escala H1, H2, H3, Body e Caption                                                                                                                                                                                                                                                               |
| Forma       | Bordas de 1px (azul sólido no foco); raio 0 ou 4px; bisel de 1px nos botões; cartão de regras com cantos recortados em degraus de pixel                                                                                                                                                                                                                                                 |
| Componentes | Cabeçalho de janela azul com minimizar, maximizar e fechar; botões azuis com bisel (normal, hover, desabilitado cinza); barra de progresso azul com bisel num trilho arredondado; campo rebaixado com cursor; abas em formato de pasta (a ativa clara, a inativa cinza); checkbox azul com ✓ branco; toast em balão azul com ponta; modal com barra azul e botões OK e Cancel com bisel |

### PRs

| ✓   | ID    | Item                                                                                                                                                                | Pronto quando                                               | Est. |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---- |
| [ ] | XP-01 | `feat(windows-xp): as cores e as rampas da referência` (as quatro cores com cinco tons cada, como tokens; primária azul `#0078D7` ajustada só se o contraste pedir) | As rampas da referência na página do DS                     | 0,5  |
| [ ] | XP-02 | `feat(windows-xp): fundo com linhas de varredura` (o fundo nativo do DS, pelo marco F do plano geral)                                                               | A página inteira com as listras finas, sem perder contraste | 0,5  |
| [ ] | XP-03 | `feat(windows-xp): botões, barra de progresso e checkbox com bisel`                                                                                                 | Buttons, Disable (barra) e Checkbox reproduzidos            | 1    |
| [ ] | XP-04 | `feat(windows-xp): abas em pasta, campo rebaixado, toast em balão e modal`                                                                                          | Tabs, Input, Toast e Modal reproduzidos                     | 1    |
| [ ] | XP-05 | `feat(windows-xp): títulos em bitmap e cartão de regras com cantos em degrau` (a Caixa de regras e os títulos das seções)                                           | Type scale e Rules card reproduzidos                        | 0,5  |
| [ ] | XP-06 | `docs(windows-xp): folha de estilo da referência` (Color tokens, Type scale, Icon grid, Borders & radius e Component gallery)                                       | A página do Windows XP lado a lado com a imagem             | 1    |

---

## PK: Punk — app escuro de gestão de leads com cards neon

### Leitura da referência

| Aspecto     | Na imagem                                                                                                                                                                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linguagem   | Fundo preto absoluto, cards de cor chapada em néon, títulos pesados, estrela "explosão" como ornamento                                                                                                                                                                              |
| Cores       | Preto `#000000`, superfície `#111111`, rosa `#F06BB8`, amarelo `#EDF040`, verde `#3FE36B`, azul `#4C8DFF`, branco; contorno de lista `#2A2A2A`                                                                                                                                      |
| Tipografia  | Títulos em Unbounded (caixa alta na tela de entrada); corpo sans do sistema                                                                                                                                                                                                         |
| Forma       | Cards com raio de 24px; botões em pílula branca com texto preto; barra de navegação inferior com o item ativo em pílula branca                                                                                                                                                      |
| Componentes | Card chapado de indicador com trilha de pontos; calendário em faixa com o dia escolhido em rosa; chips em contorno com o selecionado em rosa; lista de conversas com avatar e contador; notificações em blocos verdes; acordeão de contato; tabela compacta; busca em pílula escura |

### PRs

| ✓   | ID    | Item                                                                                                                                                                     | Pronto quando                                       | Est. |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ---- |
| [ ] | PK-01 | `feat(punk): navegação inferior e listas` (App Shell com a barra inferior em pílula branca no celular; listas em contorno `#2A2A2A` com chevron; busca em pílula escura) | As telas Chats e Contact reproduzidas               | 1    |
| [ ] | PK-02 | `feat(punk): calendário, chips e notificações` (dia escolhido em rosa no Date Picker; chips com o selecionado em rosa; toasts e alertas de sucesso em blocos verdes)     | As telas Planned Calls e Notifications reproduzidas | 1    |
| [ ] | PK-03 | `docs(punk): folha de estilo da referência` (telas de app montadas com os componentes: entrada com a estrela, início com os cards, contatos, notificações)               | A página do Punk lado a lado com a imagem           | 1,5  |

---

## Ordem e estimativa

```text
G-01 → G-02 → AR-01 … AR-07 → AR-08
NB-01 → NB-02 … NB-05 → NB-06
(F-01 e F-02 do plano geral) → TR-01 … TR-04 → TR-05;  XP-01 → XP-02 … XP-05 → XP-06
PK-01, PK-02 → PK-03
```

| Marco                       | Est.          |
| --------------------------- | ------------- |
| G: ferramenta de comparação | 2,5 dias      |
| AR: Argila                  | 7 dias        |
| NB: Neo-brutalista          | 6,5 dias      |
| TR: Transparente            | 5,5 dias      |
| XP: Windows XP              | 4,5 dias      |
| PK: Punk                    | 3,5 dias      |
| **Total**                   | **29,5 dias** |

## Como saber que terminou

- A comparação de cada DS (G-01) mostra a página do catálogo e a referência com as mesmas seções, cores e formas.
- O contraste passa em todo DS × paleta × modo, com os ajustes de cor registrados no CSS.
- Checkup nos modos de cada DS com 0 erros, 0 rolagens e 0 alertas de contraste; CI verde em todos os PRs.
