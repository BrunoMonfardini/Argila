# Plano: design systems fiéis às referências, fundos em degradê, catálogo mais leve e personalização por importância

Plano de execução, PR a PR, para os problemas vistos no catálogo em 20/10/2026:

1. **O Argila ainda está longe da [referência](referencias/argila.jpg)** ("Product UI Styleguide"): alertas, campos, cards, abas e chips não têm o volume "de massinha", e o verde-escuro aparece em textos e links onde a referência usa cinza neutro.
2. **O catálogo mostra muita informação, mal distribuída:**
   - a barra do topo tem oito controles do mesmo peso;
   - a página de componente começa com metadados (data, "Disponível em" com seis selos, abas) antes do componente;
   - o playground lista inputs técnicas (`live`, `toneLabel`, `dismissText`) no mesmo nível das principais;
   - o conteúdo ocupa só a metade esquerda da tela.
3. **Personalizar é difícil:** tudo aparece com a mesma importância. Quem só quer "a cor da minha marca" passa por design system, paleta, três cores, modo, opacidade e segmento, sem saber por onde começar.
4. **Os outros design systems também se afastam das referências** (`docs/referencias/`):
   - **Neo-brutalista:** faltam o verde e o rosa da referência; alertas, toasts e selos estão em tons pastel, e a referência usa blocos chapados e saturados com texto preto.
   - **Transparente:** o primário é uma pílula vermelho-tijolo pesada, com contorno marrom; a referência é vidro claro e fino, com aro iridescente, primário em degradê laranja-coral e destaque em degradê azul.
   - **Windows XP:** faltam o fundo com linhas de varredura, o bisel azul dos botões, as abas em formato de pasta e as rampas das quatro cores da referência.
   - **Punk:** perto da referência; faltam detalhes das telas (barra inferior em pílula, o dia escolhido em rosa, notificações verdes).
5. **Não há fundos:** a página é sempre lisa. Falta um fundo em degradê suave, formado pelas cores primária, secundária e de destaque do tema (do quente em cima ao azul embaixo, como manchas de luz desfocadas), que o vidro do Transparente pede.

## Como usar este plano

- Cada linha das tabelas é **um PR**, com commits separados por tipo (`feat`, `test`, `docs`). Merge por rebase depois do CI verde.
- **Marque a caixa** quando o PR for mergeado, no próprio PR.
- Toda mudança visual passa pelo checkup (`npm run checkup`) nos 13 temas e é comparada com a referência; o PR traz a captura de antes e depois.
- Estimativas em dias de uma pessoa, com testes e documentação.

## Onde estamos

_Atualizado em 20/10/2026._

| Marco | Situação |
| ----- | -------- |
| A     | A fazer  |
| R     | A fazer  |
| F     | A fazer  |
| L     | A fazer  |
| P     | A fazer  |

---

## Os três níveis de personalização

A base dos marcos L e P. Toda escolha de aparência ganha um nível, e cada tela (barra do topo, Montar tema, playground, guias) mostra primeiro o nível 1 e esconde o 3 até alguém pedir.

| Nível            | Quem usa                       | O que se escolhe                                                                  | Onde aparece                                                                                 |
| ---------------- | ------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **1. Essencial** | Todo produto, no primeiro dia  | Design system, modo (claro, escuro ou automático) e **a cor da marca** (primária) | Sempre à vista: barra do topo e primeiro passo do Montar tema                                |
| **2. Ajuste**    | Produto com identidade própria | Paleta, cor secundária e de destaque, e o fundo (liso ou em degradê)              | Painel "Personalizar", aberto por um botão                                                   |
| **3. Avançado**  | Casos especiais                | Transparência, segmentos, tokens de componente, `setBrand` com cor livre          | Seção "Avançado", recolhida, com aviso do que cada um exige (contraste por conta do produto) |

No playground, a mesma ideia vale para as inputs: **principais** (as que mudam o que se vê: `variant`, `size`, `tone`), **conteúdo** (textos, como `heading`) e **acessibilidade e avançado** (`live`, `toneLabel`, `dismissText`), recolhidas.

## Decisões

Seguem a opção padrão enquanto não houver outra resposta.

| ID  | Pergunta                                                                                                                                             | Opção padrão                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| D1  | A cor de texto de links e rótulos no Argila: verde-escuro (como hoje) ou cinza-escuro neutro, com o menta só em preenchimentos (como na referência)? | Cinza neutro, com sublinhado nos links; o menta fica para botões, chips, foco e destaques         |
| D2  | A página de componente fica com três abas (Visão geral, Código, Uso e acessibilidade) em vez de quatro?                                              | Sim: "Regras de uso" e "Acessibilidade" viram uma aba só                                          |
| D3  | A barra do topo fica só com design system, modo e "Personalizar"?                                                                                    | Sim; o resto vai para o painel                                                                    |
| D4  | O fundo do catálogo no Argila ganha a grade fina da referência (linhas de régua)?                                                                    | Não: só na página do Argila (Design systems → Argila), como moldura do styleguide                 |
| D5  | O fundo padrão do Transparente fica liso (como a referência) ou em degradê (que mostra melhor o vidro)?                                              | Liso, como a referência; o degradê fica a uma escolha de distância e é o sugerido na página do DS |
| D6  | O CODA, que não tem imagem de referência, entra no marco R?                                                                                          | Não, até existir uma referência; ele ganha só o fundo (F)                                         |

---

## A: Argila fiel à referência

Só CSS do DS Argila (`tokens/design-systems/argila/`) e tokens; os outros DS não mudam. Cada item compara a captura com a parte correspondente da referência.

| ✓   | ID   | Item                                                                                                                                                                       | Pronto quando                                                                             | Est. |
| --- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- |
| [ ] | A-01 | `feat(argila): cores da referência` (texto e rótulos em cinza neutro, D1; menta `#9FE3C7` só em preenchimentos; anel de foco menta com brilho)                             | Nenhum texto corrido em verde; o contraste continua passando em claro e escuro            | 1    |
| [ ] | A-02 | `feat(argila): alertas em pílula preenchida` (fundo chapado no tom, sem contorno nem faixa lateral, ícone em círculo, texto escuro)                                        | Os quatro tons iguais aos da referência (menta, amarelo, rosa; informação em azul suave)  | 0,5  |
| [ ] | A-03 | `feat(argila): campo rebaixado com aro em relevo` (pílula com sombra interna dentro de um aro claro elevado; ícone no fim, como a busca da referência)                     | Input, Select e o grupo com ação seguem a referência; foco com o anel menta               | 1    |
| [ ] | A-04 | `feat(argila): abas e chips da referência` (segmentadas com trilho cinza e a aba aberta em menta; sublinhadas com barra menta grossa; chips menta com ✓ e ícone de filtro) | Tabs nas duas variantes e Tag selecionável batem com a referência                         | 1    |
| [ ] | A-05 | `feat(argila): cards e elevação em camadas` (cinco níveis de sombra com deslocamento crescente; card com camadas embaixo e imagem em quadrado arredondado)                 | A página Fundação → Raio e elevação mostra os cinco níveis empilhados, como na referência | 1    |
| [ ] | A-06 | `feat(argila): botões com brilho e desabilitado em pílula cinza` (hover com brilho menta; desabilitado cinza sem volume)                                                   | Padrão, hover e desabilitado iguais aos da referência                                     | 0,5  |
| [ ] | A-07 | `feat(argila): escala tipográfica` (Display, H1 a H3, Body e Caption com os tamanhos e pesos da referência; títulos em cinza-escuro)                                       | A página Fundação → Tipografia mostra a escala da referência                              | 0,5  |
| [ ] | A-08 | `docs(argila): página do Argila como o styleguide da referência` (tokens de cor, tipografia, espaçamento, raio, elevação e os componentes na mesma grade da imagem)        | A página lado a lado com `argila.jpg` mostra as mesmas seções, na mesma ordem             | 1,5  |

## R: os outros design systems fiéis às referências

Mesmo método do marco A: CSS e paleta nativa de cada DS, comparados lado a lado com a imagem. O teste de contraste confere toda cor nova.

| ✓   | ID   | Item                                                                                                                                                                                                                                                              | Pronto quando                                                                                                     | Est. |
| --- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---- |
| [ ] | R-01 | `feat(neo-brutalista): as cores da referência` (paleta nativa com ciano `#00C2CB`, magenta `#FF00FF`, amarelo `#FFD700`, o verde e o rosa claro da referência, preto, branco e papel `#F5F5DC`; tons de feedback chapados e saturados, sempre com texto preto)    | Os blocos de cor da referência existem como tokens; sucesso verde, aviso amarelo, erro magenta e informação ciano | 1    |
| [ ] | R-02 | `feat(neo-brutalista): feedback e dados em blocos chapados` (alertas e toasts preenchidos no tom, com contorno de 3px e sombra dura; selos coloridos; cabeçalho da tabela preto; passos coloridos; abas com contador)                                             | Feedback e Data display lado a lado com a referência                                                              | 1,5  |
| [ ] | R-03 | `feat(transparente): as cores da referência` (primário em degradê laranja-coral com texto branco; destaque em degradê azul; sucesso verde-água; texto cinza-ardósia)                                                                                              | O botão primário e o "Pro plan" da referência reproduzidos, com contraste de 4,5:1 em todo ponto do degradê       | 1    |
| [ ] | R-04 | `feat(transparente): vidro claro e fino` (aro de 1px claro com brilho iridescente nas bordas, reflexo no topo, sombra colorida difusa embaixo; secundário em vidro incolor; botão de ícone quadrado de vidro; switch verde-água; toast com contorno laranja)      | Botões, busca com +, select, switch, abas, toast e card lado a lado com a referência                              | 2    |
| [ ] | R-05 | `feat(windows-xp): as cores e o bisel da referência` (cinza `#A0A0A0`, branco `#F0F0F0`, azul `#0078D7` e vermelho `#E81123`, com rampas; botões e barra de progresso com bisel azul; abas em formato de pasta; checkbox azul)                                    | Botões (normal, hover e desabilitado), abas, barra de progresso e checkbox como na referência                     | 1,5  |
| [ ] | R-06 | `feat(windows-xp): fundo com linhas de varredura` (o fundo nativo do DS, pelo marco F)                                                                                                                                                                            | A página inteira tem as listras finas da referência, sem perder contraste                                         | 0,5  |
| [ ] | R-07 | `feat(punk): detalhes das telas da referência` (barra de navegação inferior em pílula branca no App Shell; dia escolhido em rosa no Date Picker; lista em contorno `#2A2A2A` com chevron; notificações em blocos verdes)                                          | As telas de exemplo do catálogo lado a lado com a referência                                                      | 1,5  |
| [ ] | R-08 | `docs: página de cada DS no formato da referência` (generaliza o A-08: o Neo-brutalista em Foundations, Components, Data display e Feedback; o Windows XP como o "Retro-OS UI Kit"; o Transparente como a folha de componentes de vidro; o Punk com telas de app) | Cada página, lado a lado com a imagem, mostra as mesmas seções na mesma ordem                                     | 2    |

## F: fundos em degradê

Um fundo formado pelas cores do tema: o primário, o secundário e o destaque se misturam num degradê suave, como manchas de luz desfocadas. Os componentes continuam sobre as superfícies de sempre, então o contraste do texto não depende do fundo.

| ✓   | ID   | Item                                                                                                                                                                                                                                     | Pronto quando                                                                                              | Est. |
| --- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---- |
| [ ] | F-01 | `feat(tokens): fundos` (`--arg-background-image`, `liso` por padrão; `degrade`, com manchas radiais de `primary`, `secondary` e `accent` misturadas ao fundo, em claro e escuro; `data-arg-background` no `<html>`)                      | Trocar a primária muda o degradê; o teste de contraste confere o texto da página sobre cada cor do degradê | 1,5  |
| [ ] | F-02 | `feat(theme): fundo no manifesto e no ArgTheme` (`fundos` aceitos por DS, com o nativo de cada um, como as linhas do Windows XP; `ArgTheme.setBackground()`; `background` nos segmentos; o DS que não aceita volta ao padrão, com aviso) | `setBackground('degrade')` funciona no Argila; num DS que não aceita, cai no padrão                        | 1    |
| [ ] | F-03 | `feat(tokens): degradê da marca para áreas de destaque` (`--arg-gradient-brand`, do primário ao secundário, para faixas, banners e o botão primário do Transparente)                                                                     | O degradê acompanha as cores de marca da lista fixa, com contraste em todo ponto                           | 0,5  |
| [ ] | F-04 | `feat(docs): fundo no Personalizar, no Montar tema e na Fundação` (escolha de fundo no nível Ajuste; a página Fundação → Fundos com as amostras em cada DS; o segmento copiado leva o fundo)                                             | Escolher "Degradê" no catálogo muda o fundo e vai para o link e para o código do Montar tema               | 1    |

## L: catálogo mais leve

| ✓   | ID   | Item                                                                                                                                                                                                                                                   | Pronto quando                                                                    | Est. |
| --- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---- |
| [ ] | L-01 | `feat(docs): barra do topo com o essencial` (design system, modo e o botão "Personalizar", D3; o painel lateral traz paleta, cores, opacidade e segmento)                                                                                              | A barra cabe numa linha em 1280px com qualquer DS, inclusive os de fonte larga   | 1    |
| [ ] | L-02 | `feat(docs): página de componente começa pelo componente` (título e resumo; em seguida, uma vitrine com o componente nos principais estados; "Disponível em" vira uma linha com a contagem e o detalhe num popover; "Atualizado em" vai para o rodapé) | O componente aparece na primeira tela, sem rolar, em 1280×800                    | 1,5  |
| [ ] | L-03 | `feat(docs): três abas` (Visão geral, Código e Uso e acessibilidade, D2; o playground vai para Código, com o código ao lado)                                                                                                                           | Links antigos (`/uso`, `/acessibilidade`) redirecionam para a aba nova           | 1    |
| [ ] | L-04 | `feat(docs): layout que usa a largura da tela` (conteúdo até 72rem; exemplos lado a lado quando couberem; índice só a partir de 90rem)                                                                                                                 | Em 1440px não sobra mais da metade da tela vazia; em 320px nada rola para o lado | 1    |
| [ ] | L-05 | `feat(docs): anatomia mais limpa` (marcadores fora do componente, ligados por uma linha curta; legenda ao lado em telas largas)                                                                                                                        | Nenhum marcador cobre texto nas 10 anatomias                                     | 1    |
| [ ] | L-06 | `feat(docs): exemplos recolhidos depois do terceiro` ("Mostrar mais exemplos"; o índice continua listando todos)                                                                                                                                       | Páginas com muitos exemplos (Input, Button) ficam com metade da altura           | 0,5  |

## P: personalização por importância

| ✓   | ID   | Item                                                                                                                                                                                                      | Pronto quando                                                                                                   | Est. |
| --- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---- |
| [ ] | P-01 | `feat(docs): níveis no painel Personalizar` (Essencial, Ajuste e Avançado, com Avançado recolhido e o aviso do que cada opção exige)                                                                      | Quem abre o painel vê primeiro a cor da marca; transparência e segmento só ao abrir "Avançado"                  | 1    |
| [ ] | P-02 | `feat(docs): Montar tema em passos` (1. design system e modo; 2. cor da marca; 3. ajustes; 4. avançado, opcional; com uma prévia ao lado, um mini styleguide no formato da referência, e o código no fim) | Do zero ao código copiado em até três escolhas, para quem só quer DS e cor                                      | 1,5  |
| [ ] | P-03 | `feat(manifesto): importância das inputs` (tag `@nivel essencial \| conteudo \| avancado` no JSDoc, lida pelo gerador do manifesto; sem tag, vale `essencial`)                                            | O manifesto traz o nível de cada input; o teste do gerador cobre a tag                                          | 1    |
| [ ] | P-04 | `feat(docs): playground por nível` (principais à vista, com nomes em português e ajuda curta; conteúdo em seguida; avançado recolhido)                                                                    | No Alert, à vista ficam só tom, título e "pode fechar"; `live`, `toneLabel` e `dismissText` ficam em "Avançado" | 1    |
| [ ] | P-05 | `docs(ui): níveis nos componentes` (marcar as inputs de acessibilidade e de ajuste fino dos 38 componentes com `@nivel`)                                                                                  | Todo componente com mais de quatro inputs tem as avançadas marcadas                                             | 1    |
| [ ] | P-06 | `docs: personalizar por nível` (o README do pacote e o "Como começar" reorganizados em Essencial → Ajuste → Avançado; os tokens mais usados primeiro na Fundação)                                         | Um produto chega à cor da marca lendo só a seção Essencial                                                      | 1    |

## Ordem e estimativa

```text
A-01 → A-02 … A-07 (em qualquer ordem) → A-08
F-01 → F-02 → F-03 → R-03, R-04, R-06   (o vidro e as listras usam os fundos)
R-01 → R-02;  R-05;  R-07                (em qualquer ordem, depois do A)
A-08 → R-08
L-01 → P-01                (o painel Personalizar nasce em L-01 e ganha os níveis em P-01)
L-02 → L-03 → L-04 → L-05, L-06
P-03 → P-04 → P-05
P-02 e P-06 por último     (usam a prévia do A-08 e os níveis de P-01)
```

| Marco                                | Est.        |
| ------------------------------------ | ----------- |
| A: Argila fiel à referência          | 7 dias      |
| L: catálogo mais leve                | 6 dias      |
| P: personalização por importância    | 6,5 dias    |
| R: os outros DS fiéis às referências | 11,5 dias   |
| F: fundos em degradê                 | 4 dias      |
| **Total**                            | **35 dias** |

## Como saber que terminou

- A página de cada DS com referência (Argila, Neo-brutalista, Punk, Windows XP e Transparente), lado a lado com a imagem, mostra as mesmas seções com a mesma linguagem visual e as mesmas cores.
- O fundo em degradê funciona em todo DS que o aceita, formado pelas cores do tema, sem perder contraste.
- Em 1280×800, toda página de componente mostra o componente na primeira tela.
- A barra do topo tem três controles; o Montar tema chega ao código em três escolhas para quem só quer DS e cor.
- Checkup nos 13 temas com 0 erros, 0 rolagens e 0 alertas de contraste; CI verde em todos os PRs.
