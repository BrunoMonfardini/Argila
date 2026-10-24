# @brunomonfardini/ui

## 0.9.0

### Minor Changes

- d6a2f61: **Véu automático no fundo de imagem.** Com o fundo `imagem` e sem véu fixado, o `ArgTheme` mede a imagem no navegador (uma cópia de 64×64) e aplica o menor véu com que o texto da página passa no contraste sobre ela; trocar a imagem, o design system, a paleta, as cores ou o modo recalcula. Se a imagem não puder ser lida (de outra origem sem CORS, ou sem navegador), fica o véu padrão de 95%, com aviso. `setBackgroundVeil()` (ou `backgroundVeil` no segmento) passa a **fixar** o véu, e `clearBackgroundVeil()` volta ao calculado; `backgroundVeilFixed()` diz qual vale. Novos na API: `argMinimumVeil`, `argImageExtremes`, `ARG_VEIL_MEASURER` (para trocar a medição em testes) e `ARG_VEIL_SAMPLE_SIZE`.

## 0.8.0

### Minor Changes

- ffa3fd4: **Argila mais perto da referência.** Alertas em pílula preenchida (menta, amarelo, rosa e azul), sem contorno nem faixa lateral, com texto e ícone escuros. Links, rótulos e os botões secundário e terciário em cinza neutro: o menta fica para os preenchimentos.

  Tokens novos de preenchimento suave por tom: `--arg-color-{info,success,warning,danger}-soft` e `--arg-color-on-{tom}-soft`, com o contraste testado em todo design system e paleta.

- 13ae2b3: **Argila: campos, abas e chips da referência.** Campos, select e área de texto ficam rebaixados dentro de um aro claro em relevo (com ação acoplada, o aro envolve o grupo e o botão fica dentro da pílula). Abas segmentadas com a aba aberta em menta e sublinhadas com a barra menta. Chips de filtro em menta claro com volume e o selecionado em menta.
- 2f8282a: **Argila: tipografia e cartões da referência.** Display e títulos maiores, em peso médio. O cartão elevado ganha as camadas empilhadas da referência (token `--arg-shadow-stack`).
- 2feb513: **Fundo em movimento.** Com `data-arg-background-motion` no `<html>`, as manchas do fundo `degrade` passeiam devagar pela página, num ciclo de 30 s. Só a posição muda: as cores e o contraste são os do degradê parado. Quem pediu movimento reduzido no sistema vê o fundo parado. As posições viram propriedades registradas (`--arg-background-spot-{1,2,3}-{x,y}`), que um produto pode sobrescrever para mudar onde cada mancha fica.
- 86d8ca6: **Fundo de imagem no `ArgTheme` e nos segmentos.** Novo fundo `imagem`, aceito pelo Argila, CODA, Molde e Transparente. `ArgTheme.setBackgroundImage(url)` define a imagem, `setBackgroundVeil(0 a 1)` afina o véu para uma imagem conhecida (`clearBackgroundVeil()` volta ao padrão, que vale para qualquer imagem) e `setBackgroundMotion(true)` faz as manchas se moverem. Os segmentos ganham `backgroundImage`, `backgroundVeil` e `backgroundMotion`. `setBackground('imagem')` sem imagem usa o `degrade`, com aviso. Para quem aplica o tema sem o `ArgTheme`, `argSegmentAttributes` leva o atributo do movimento e o novo `argSegmentStyles` dá as variáveis CSS do segmento (opacidade das superfícies, imagem e véu).
- aaeb3ef: **Fundo de imagem nos tokens.** Com `data-arg-background="imagem"` no `<html>` e a imagem em `--arg-background-photo` (ex.: `url("assets/fundo.jpg")`), o `base.css` pinta a imagem desfocada (`--arg-background-blur`, 48px por padrão) numa camada fixa atrás da página, com as manchas translúcidas da primária, da secundária e do destaque por cima (elas se movem com `data-arg-background-motion`). Cobrindo as duas, um véu com a cor de fundo (`--arg-background-veil`) mantém o texto legível: o padrão, 95%, vale para qualquer imagem, inclusive com pixels pretos ou brancos puros; para uma imagem conhecida, um véu mais fino pode ser calculado. O `body` não pode ter fundo próprio. A escolha pelo `ArgTheme` e pelos segmentos vem numa próxima versão.
- 8f56aeb: **Fundos em degradê.** O fundo da página pode ser `liso` (padrão) ou `degrade`: manchas suaves da primária, da secundária e do destaque, misturadas ao fundo, que acompanham a paleta e as cores de marca. Escolha com `ArgTheme.setBackground('degrade')`, `background: 'degrade'` num segmento ou `data-arg-background="degrade"` no `<html>`. Cada DS declara os `fundos` que aceita no manifesto (Argila, CODA, Molde e Transparente aceitam o degradê); um fundo não aceito volta ao padrão, com aviso. O teste de contraste confere o texto sobre cada mancha. Novo token `--arg-gradient-brand`, da primária à secundária, para faixas e banners.
- 03eaeb3: **Ícone `car`.** Carro de perfil, no padrão dos ícones do Argila: para botões de corrida (Uber, 99) e trajetos. Registre com `provideArgIcons([argIconCar])`.
- 72d4a0c: **Neo-brutalista: passos, tabela e dados da referência.** Passos com o feito em bloco ciano, o atual em bloco amarelo e todos contornados em preto. Cabeçalho da tabela em bloco preto. Barra de progresso ciano. Tooltip preto. Título do card em caixa alta.
- 53cd63d: **Neo-brutalista com as cores da referência.** A paleta nativa ganha os blocos de feedback chapados, sempre com texto preto: informação ciano, sucesso verde, aviso amarelo e erro magenta `#FF00FF`. Ganha também o rosa claro, o salmão e a tinta preta (`--arg-color-nb-*`). Alertas, toasts e selos ficam em blocos chapados com contorno preto. O destrutivo vira o bloco magenta; o switch ligado, o bloco amarelo com contorno; a aba ativa, um bloco ciano.
- 5dea63c: **Conversão OKLab.** `argSrgbToOklab(r, g, b)` e `argOklabToSrgb(lab)` convertem entre sRGB (canais de 0 a 1) e OKLab, o espaço em que o `color-mix(in oklab, …)` dos tokens mistura as cores. O teste de contraste e o catálogo passam a usar a mesma conversão.
- 72a4e16: **Punk mais perto da referência.** Alertas e toasts viram blocos chapados no tom, com texto preto, como as notificações verdes da referência (novos `*-soft` da paleta Néon: verde, amarelo, azul e coral). Listas e a busca com o contorno discreto `#2A2A2A`.
- 329bc43: **Transparente mais perto da referência.** Primário em degradê laranja-coral com faixa de brilho e sombra colorida (texto branco com 4,5:1 no meio); destaque no azul do "Pro plan"; texto em cinza-ardósia; secundário em vidro incolor com texto ardósia. O vidro fica mais claro e fino (aro de 1,5px) e a borda iridescente mais visível. Switch ligado em degradê verde-água e toast com contorno laranja fino.
- eba9924: **Windows XP mais perto da referência.** As rampas de cinco tons das quatro cores da referência (`--arg-color-xp-{cinza,branco,azul,vermelho}-{1..5}`); as linhas de varredura viram o fundo nativo do DS (`fundos: ['linhas', 'liso']`), agora visíveis também quando o `<body>` tem fundo; títulos em caixa alta e o título da página em azul; botões e barra de progresso com bisel (o primário em azul com o topo mais claro); abas em pasta com as fechadas em cinza. O fundo padrão de cada DS não leva atributo: trocar de DS leva o padrão de um ao padrão do outro.

### Patch Changes

- 95e4b47: **Calendário do campo de data aceita clique.** Clicar num dia do calendário do `input[arg-date]` não fazia nada: o diálogo fica dentro do `arg-date-toggle`, cujo host tem `pointer-events: none`, e herdava o none. O diálogo agora devolve `pointer-events: auto`. Um teste em `scripts/` confere que todo botão e diálogo dentro de um host assim libera o clique.

## 0.7.0

### Minor Changes

- bbaf085: `curatedComponents` na API pública: a lista completa dos componentes curados de um design system (o núcleo mínimo, quando declarado, e os extras).
- 7269498: O CODA ganha pele própria para o núcleo mínimo: contorno de 2px, cantos pequenos e rótulos que quebram a linha em vez de estourar (a Silkscreen é larga).
- 1279910: O manifesto de cada design system ganha `linguagem`: a linguagem visual em uma frase, mostrada no catálogo.
- 4b36e2b: **Novo design system: Punk** (`data-arg-style="punk"`), como na referência: fundo preto, pílulas brancas com texto preto, cantos grandes, plano (sem sombra) e títulos em Unbounded (Google Fonts, carregada pelo produto).

  - Paleta nativa Néon (rosa, amarelo, verde e azul sobre o preto) e as paletas Viva e Alto contraste.
  - **Só modo escuro**: o `ArgTheme` fixa o escuro, e o teste de contraste e as cores de marca seguem os modos de cada manifesto.
  - Pele própria para o núcleo mínimo e para Agenda, Avatar, Date Picker, Drawer, List, Table e Time Slots. Breadcrumb e Pagination ficam fora do Punk.

- 3a04472: **O Windows XP segue o "Retro-OS UI Kit"**: paleta Retro (fundo cinza-claro, azul de destaque e vermelho, no lugar do azul-marinho), títulos em Pixelify Sans (Google Fonts, carregada pelo produto), fundo com linhas de varredura finas, raio de 4px, botões em relevo de 1px, abas em pasta e ícones de traço quadrado, sem suavização.

  - Pele própria para o núcleo mínimo, o Menu (item em foco na faixa azul) e os ícones.
  - Agenda, Drawer e Time Slots ficam fora do Windows XP.

- 617ced0: Ícones novos para a navegação do catálogo: `book`, `rocket`, `layers`, `layout`, `wrench`, `help-circle`, `accessibility` e `sparkles`.
- bee8f93: Exclusivos do Neo-brutalista: `arg-nb-sticker` (selo inclinado para regras e avisos curtos) e `arg-nb-rules` (caixa de regras de uso com título, um `<aside>` com nome acessível).
- c234166: Exclusivos do Punk: `arg-punk-stat-card` (card de indicador em cor chapada), `arg-punk-dot-track` (trilha de pontos com alça, acessível como `progressbar`) e `arg-punk-burst` (estrela decorativa, escondida do leitor de tela).
- 410fb5b: Variantes da referência:

  - `arg-pagination` ganha `variant="dots"`: um ponto por página (o atual em pílula), cada um com o nome "Página 2", para carrosséis e passos com poucas páginas.
  - `ArgDrawer.open(..., { side: 'bottom' })` sobe a gaveta de baixo em qualquer largura (bottom sheet).

- b000275: Exclusivos do Windows XP: `arg-xp-window` (janela com barra de título e botões de minimizar, maximizar e fechar, com nome e eventos próprios) e `arg-xp-balloon` (balão de aviso com `role="status"`).

## 0.6.0

### Minor Changes

- 651ebcf: Variantes vindas da referência do Argila, em todos os design systems:

  - `arg-tabs` ganha `variant="segmented"`: trilho rebaixado em pílula, com a aba aberta em relevo. O teclado e o ARIA não mudam.
  - `arg-tag` ganha `selectable` com `[(selected)]` (chip de filtro): o texto vira um botão de alternância com `aria-pressed` e, ligado, mostra um ✓ no preenchimento suave da marca. Também ganha `disabled`.

- 975f265: **O Argila ganha a forma "de massinha"** da referência: controles em pílula, cartões com cantos de 20px e sem contorno, volume com sombra difusa e realce de luz, campos rebaixados, botão primário no preenchimento suave da marca com brilho no hover. Vale para todo produto sem `data-arg-style` (o Argila é o padrão).

  - Cinco níveis de elevação: `--arg-shadow-1` a `--arg-shadow-5`. No padrão eles reaproveitam `sm`, `md` e `lg`; o Argila define os cinco.
  - O CSS do Argila fica em `tokens/design-systems/argila/` (forma e pele de 19 componentes) e chega pelo `argila.css`. Cada design system ganhou um `index.css`; o `temas.css` importa os índices.
  - Para manter o visual plano de antes, use `data-arg-style="molde"`.
  - O `arg-icon-button` ganha a classe `arg-icon-button` no elemento.

- 370f39f: **Cores de marca da lista fixa.** `ARG_BRAND_COLORS` traz 16 cores (cobre, caramelo, terracota, oliva, musgo, petróleo, ardósia, anil, ameixa, vinho, coral, mostarda, grafite, areia, menta e lavanda) para a primária, a secundária e o destaque.

  - `ArgTheme.setColors({ primary, secondary, accent })` só aplica as que passam no contraste no design system e na paleta atuais (`allowedColors()`, de `ARG_ALLOWED_COLORS`), avisa das outras em desenvolvimento e revalida ao trocar de design system ou paleta. `clearColors()` volta às cores da paleta.
  - Sem Angular: `data-arg-primary`, `data-arg-secondary` e `data-arg-accent` no `<html>`, com o `temas.css` (que traz o `tokens/colors.css` por último).
  - `setBrand()` com cor livre continua funcionando.

- f463649: **Novo design system: Neo-brutalista** (`data-arg-style="neo-brutalista"`), como na referência: papel bege, contorno preto de 3px, cantos retos, sombra dura deslocada, blocos de cor chapada com texto preto, caixa alta nos botões, alvo de 44px e foco sempre visível. Títulos em Archivo Black e corpo em Archivo, carregados pelo produto (Google Fonts).

  - Paleta nativa Papel CMY e as paletas Pastel (nova, compartilhada), Preto e branco e Alto contraste. Claro e escuro (papel grafite com contorno off-white). Sem transparência.
  - Pele própria para o núcleo mínimo e para Avatar, Breadcrumb, List, Pagination, Stepper e Table.

- cd8f5d5: **O Transparente vira vidro espesso**, como na referência: superfícies translúcidas com desfoque, aro claro, brilho no topo, borda iridescente nos botões e cartões, botões em pílula de 48px (56px no grande) e o primário em gradiente.

  - Paleta Vidro: fundo cinza-claro, laranja de marca, azul de destaque e verde-água para o que está ligado (checkbox, radio e switch).
  - Pele própria para o núcleo mínimo e para Combobox, Drawer, Menu e Popover.
  - Alternativas: sem `backdrop-filter` o vidro fica 85% opaco; com `prefers-reduced-transparency`, opaco e sem iridescência; em `forced-colors`, sem iridescência.

- 82a1854: `arg-input-group` junta um campo e um botão de ação no fim (`argInputAction`, num `arg-icon-button`), numa peça só: buscar, adicionar, limpar. O botão mantém nome próprio e a ordem do Tab. Importe com `ARG_INPUT_GROUP`.
- ea06469: **A paleta padrão passa a ser a Massinha**: menta sobre superfícies quase brancas, a nativa do Argila. Todo produto sem paleta própria muda de aparência. Para manter o visual café de antes, use `data-arg-palette="terrosa"`.

  - A Terrosa vira uma paleta compartilhada, em `tokens/palettes/terrosa.css` (chega com o `temas.css`).
  - Paletas compartilhadas novas: `oceano`, `floresta`, `mono` (preto e branco), `alto-contraste` (texto em AAA) e `viva`. Cada design system aceita algumas: Argila (Terrosa, Oceano, Floresta, Preto e branco, Alto contraste), Transparente (Oceano, Terrosa, Preto e branco), CODA (Viva, Preto e branco, Alto contraste), Windows XP (Alto contraste) e Molde (Terrosa).
  - **CODA e Windows XP deixam de aceitar a Terrosa**: o `ArgTheme` troca para a paleta nativa, com aviso em desenvolvimento.
  - Token novo `--arg-color-primary-soft` (com `--arg-color-on-primary-soft`): o preenchimento suave da marca, definido por toda paleta.
  - Os tons de desabilitado do CODA, do Transparente e do Windows XP passam de bege para cinza neutro.
  - O Molde (base interna para criar design systems) troca os neutros bege por cinza.

- e64fa3e: **Segmentos**: combinações nomeadas de aparência, declaradas uma vez pelo app.

  - `provideArgila({ segments, defaultSegment })` declara os segmentos e aplica o padrão ao iniciar.
  - `ArgTheme.setSegment(nome)` aplica de uma vez design system, paleta, cores, modo e transparência, e marca `data-arg-segment`; `segment()` diz qual está aplicado.
  - O tipo `ArgSegment` recusa paleta que o design system não aceita.
  - `argSegmentAttributes(segmento)` devolve os atributos do `<html>`, para quem não usa o `ArgTheme`.

## 0.5.0

### Minor Changes

- c8f689a: `ARG_SHARED_PALETTES` registra as paletas compartilhadas (nome e se tem arquivo em `tokens/palettes/`), e a lista `paletas` dos manifestos só aceita paletas registradas. Uma paleta nova entra com o CSS, uma entrada no registro e o id nos manifestos que a aceitam; o tipo `ArgPalette` e as checagens de contraste acompanham sozinhos.

## 0.4.0

### Minor Changes

- 8b9196d: Estilos viram **design systems** com manifesto. `ARG_DESIGN_SYSTEMS` traz, para cada um, os modos de cor, as paletas que aceita e se aceita transparência; os tipos `ArgStyle`, `ArgPalette` e o novo `ArgPaletteOf<'coda'>` saem dele.

  - O `ArgTheme` respeita o manifesto: ao trocar de design system, a paleta, o modo e a transparência que ele não aceita voltam ao padrão dele, com aviso no console em desenvolvimento. Novos sinais: `designSystem()`, `palettes()` e `acceptsTransparency()`.
  - **CODA e Windows XP não aceitam mais transparência**: `setSurfaceOpacity()` é ignorado neles.
  - O CSS de cada design system mudou de lugar: `tokens/design-systems/<ds>/forma.css` e `tokens/design-systems/<ds>/paletas/nativa.css`. Os caminhos antigos (`tokens/styles/<ds>.css` e `tokens/palettes/nativas/<ds>.css`) continuam funcionando e serão removidos numa versão major.
  - `ARG_STYLES` fica obsoleto: use `ARG_DESIGN_SYSTEMS[ds].modos`.

## 0.3.1

### Patch Changes

- 981658c: Painéis sobre o conteúdo (Dialog, Popover, Menu, Combobox, calendário do Date Picker, Toast e "pular para o conteúdo") ficam no mínimo 80% opacos e desfocam o que está atrás. Com a transparência baixa (Transparente a 60%, ou qualquer estilo abaixo de 80%), o texto de trás não aparece mais através deles. O novo token `--arg-surface-raised-alpha` controla essa opacidade.

## 0.3.0

### Minor Changes

- b66e81a: `ArgTheme.setStyle()` e `setPalette()`, com os sinais `style()`, `palette()` e `schemes()` (modos de cor que o estilo suporta). Estilos podem suportar um modo só: `setColorScheme()` passa a trocar um modo não suportado pelo modo padrão do estilo. Novos tipos `ArgStyle` e `ArgPalette` e as constantes `ARG_STYLES` e `ARG_PALETTES`.
- e21ed81: CODA separado em estilo (`tokens/styles/coda.css`) e paleta nativa (`tokens/palettes/nativas/coda.css`), com secundária grafite e destaque amarelo. Dá para usar o estilo CODA com outra paleta. `data-arg-brand="coda"` continua funcionando; `tokens/themes/coda.css` foi removido.
- eafb571: Aparência em dois eixos independentes, no `<html>`: `data-arg-style` (forma) e `data-arg-palette` (cor). Sem `data-arg-palette`, vale a paleta nativa do estilo. Novo `tokens/temas.css` com todos os estilos e paletas. O tema "Exemplo" vira o estilo **Molde** (`tokens/styles/molde.css` + `tokens/palettes/nativas/molde.css`); `data-arg-brand="example"` continua funcionando. `tokens/themes/example-brand.css` foi removido.
- 9d326dc: Novo token `--arg-font-family-heading` para títulos (padrão: a mesma fonte do corpo), usado em Dialog, Card, Empty State, Alert, Toast, na marca do App Shell e nos `h1`–`h6` do `base.css`. O `ArgTheme.setBrand()` aceita `fontFamilyHeading`.
- e21ccf3: Paleta padrão ajustada para a Terrosa: tons de café, bege e off-white. A primária é marrom no modo claro e bege no escuro. Os nomes dos tokens não mudam; só os valores de `--arg-core-clay-*` e `--arg-core-neutral-*`.
- 564e6bc: Tema Arcade removido (`tokens/themes/arcade.css` e `data-arg-brand="arcade"`), sem substituto: não estava em uso. A pasta `tokens/themes/` deixa de existir; estilos e paletas ficam em `tokens/styles/` e `tokens/palettes/`.
- 4faa281: Novas cores de marca: secundária (`--arg-color-secondary`) e destaque (`--arg-color-accent`), cada uma com `on-*`, `-hover`, `-pressed` e `-subtle`. O `ArgTheme.setBrand()` aceita `secondary`, `onSecondary`, `accent` e `onAccent`.
- 5d328a4: Transparência das superfícies: `--arg-surface-opacity` (de 0.4 a 1, padrão 1) deixa `--arg-color-surface`, `-raised` e `-sunken` translúcidas. As cores opacas ficam em `--arg-color-surface-solid`, `-raised-solid` e `-sunken-solid`, que é o que paletas e temas devem sobrescrever. Novo `--arg-surface-blur`, de 0 a 16px conforme a opacidade. `ArgTheme.setSurfaceOpacity()` e `clearSurfaceOpacity()`. Tooltip e Switch usam a superfície opaca.
- 601f003: Transparente separado em estilo (`tokens/styles/transparente.css`) e paleta nativa (`tokens/palettes/nativas/transparente.css`). A transparência agora vem de `--arg-surface-opacity: 0.6` (ajustável com `ArgTheme.setSurfaceOpacity()`), e as superfícies da paleta são opacas. `data-arg-brand="transparente"` continua funcionando; `tokens/themes/transparente.css` foi removido.
- 22cbacb: Windows XP separado em estilo (`tokens/styles/windows-xp.css`) e paleta nativa (`tokens/palettes/nativas/windows-xp.css`), com secundária, destaque e cores de feedback mais escuras no modo claro. `data-arg-brand="windows-xp"` continua funcionando; `tokens/themes/windows-xp.css` foi removido.

## 0.2.0

### Minor Changes

- 07e4222: Componente `arg-agenda`: calendário de dia e de semana no padrão "grid" do ARIA APG, com os agendamentos posicionados pelo horário (lado a lado quando simultâneos, em tons), teclado completo (setas passam para a semana vizinha, Home/End, Ctrl+Home/End, PageUp/PageDown, Enter e Espaço), saídas `eventSelect` e `slotSelect`, `[(date)]`, `[(view)]` e grade ajustável (`start`, `end`, `step`). Cada célula diz o horário, o dia e o que há nela.
- f27f370: Componente `arg-alert` sobre `<div>`, com os tons `info`, `success`, `warning` e `danger`. O `role` vem do tom (`status` ou `alert`, trocável por `live`), o ícone combina com o tom e o nome do tom é lido antes do texto. Tem título opcional, ações (`arg-alert-action`) e botão de fechar (`dismissible`, `(dismissed)`). Também os ícones `info`, `check-circle`, `alert-triangle` e `alert-circle`.
- bf74ded: Componente `arg-app-shell`: cabeçalho com a marca do tenant (`brandName`, `brandLogo`, `brandHref` e a cor da marca do `ArgTheme`), menu lateral (`[arg-app-shell-nav]`), ações do cabeçalho (`[arg-app-shell-actions]`), área principal e link "Pular para o conteúdo". Abaixo de `compactBelow` px (768) de largura do próprio shell, o menu vira gaveta (`popover="auto"`) aberta por um botão de menu. Também o ícone `menu`.
- c47c3ee: Componentes `arg-badge` (status com seis tons), `arg-tag` (removível por clique, Enter, Espaço, Delete e Backspace, com o botão chamado "Remover {texto}") e `arg-avatar` (foto com `alt`, ou as iniciais quando não há foto ou ela falha).
- 83ac633: Componentes `nav[arg-breadcrumb]` e `li[arg-breadcrumb-item]` (importe `ARG_BREADCRUMB`): trilha de navegação sobre `<nav>` com nome e lista ordenada, página atual com `current` (`aria-current="page"`) e separador desenhado pelo CSS, sem ser lido.
- 9bb0f6a: Componente `arg-card` sobre `<article>`, `<section>`, `<div>` ou `<li>`, com áreas de imagem, cabeçalho, título, descrição, conteúdo e ações, e as variantes `outlined` e `elevated`. Com `arg-card-link` no título, o card inteiro fica clicável sem quebrar os botões internos. Importe tudo com `ARG_CARD`.
- e1d25b2: Controles de escolha (importe `ARG_CHOICE`): `arg-checkbox` (com `indeterminate`), `arg-radio` e `arg-switch` sobre o `<input>` nativo, `label[arg-choice]` para o rótulo de cada opção e `arg-choice-group` (`<fieldset>` com título, ajuda, erro anunciado e `name` comum para os radios).
- 9e544b0: Componente `input[arg-combobox]`, no padrão "combobox with list autocomplete" do ARIA APG: sugestões de uma lista local (`options`, filtrada sem acentos) ou de uma busca assíncrona (`search`, com espera entre teclas, `minChars` e descarte de respostas atrasadas), estados de carregando e vazio, anúncio do total de resultados, teclado completo (↓ ↑ com volta, Enter, Esc, Alt+↓/↑, Tab) com `aria-activedescendant`. Valor é o `value` da opção, com Reactive Forms e formulários de signals. Também `filterOptions`.
- 99a5822: Componente `arg-icon` e `provideArgIcons`: ícones desenhados pelo time, registrados por produto, com nome checado na compilação e tamanhos pelos tokens `--arg-icon-size-*`.
- 0dc4774: Componente `input[arg-currency]`: valor em reais com os dígitos entrando pela direita ("R$ 123,45") e o valor do formulário em centavos, como inteiro (`12345`), ou `null` vazio. Funciona com Reactive Forms, com formulários de signals (`[formField]`, com `touch` no blur) e com `[(value)]`; `inputmode="numeric"`. Também as funções `formatCents` e `parseCents`.
- 6b4f04d: Componente `input[arg-date]`: data com digitação direta em "dd/mm/aaaa" e um botão que abre o calendário num `<dialog>` modal, no padrão "date picker dialog" do ARIA APG (setas, Home/End, PageUp/PageDown, Shift para o ano, Enter, Esc). O formulário recebe a data em ISO. `min`, `max` e `blocked` limitam e bloqueiam dias (riscados no calendário); com Reactive Forms, o campo valida sozinho (`incomplete`, `date`, `dateMin`, `dateMax`, `dateBlocked`). Funções de data exportadas (`formatBr`, `parseBr`, `addDays`, `dateProblem`…). Também os ícones `calendar`, `chevron-left` e `chevron-right`.
- 0bd29c5: Serviço `ArgDialog` sobre o `<dialog>` nativo: `open(Componente, { data, size, label, dismissable })` devolve um `ArgDialogRef` com o resultado em `closed`, e `confirm({ title, message, confirmText, tone })` é a confirmação pronta (`role="alertdialog"`). Foco preso pelo `showModal()`, Esc e clique fora fecham, e o foco volta a quem abriu. Diretivas `argDialogTitle` e `argDialogDescription`; áreas `arg-dialog-content` e `arg-dialog-actions`.
- fb3eb5f: Componente `arg-divider` sobre o `<hr>`: horizontal e vertical (com `aria-orientation`), espaçamento por token e modo `decorative`.
- 114eba7: Serviço `ArgDrawer`: gaveta modal sobre o mesmo `<dialog>` do `ArgDialog`, presa à lateral (`side: start | end`) no desktop e subindo de baixo em telas abaixo de 40rem. Tamanhos `sm`, `md` e `lg`; mesmas áreas, `ArgDialogRef`, foco preso, Esc e devolução do foco do Dialog.
- 5a9aff3: Componente `arg-empty-state` sobre `<section>` ou `<div>`: ícone decorativo, título com nível configurável (`level`), texto, ações (`arg-empty-state-action`) e borda tracejada opcional (`bordered`). O padrão "Carregamento de lista" passa a usá-lo.
- 1299616: Componente `arg-field` e diretiva `argFieldControl` (importe `ARG_FIELD`): rótulo, ajuda e erro ligados ao controle por ids, `aria-invalid` e `aria-required` no controle, e o erro anunciado para leitores de tela quando aparece.
- c2208bb: Componente `arg-file-upload`: campo de arquivos sobre o `<input type="file">` nativo, com área para arrastar e soltar, prévia de imagens, recusa por tipo (`accept`) e tamanho (`maxSize`) com o motivo na lista, envio com progresso por um `uploader` (com "Tentar de novo" no erro) e anúncios para o leitor de tela. O valor é a lista de arquivos aceitos (`File[]`). Também as funções `fileProblem`, `acceptsType` e `formatSize` e o ícone `upload`.
- 56a17f2: `--arg-core-font-sans` passa a usar só a fonte do sistema operacional (`system-ui`); a Inter sai da lista.
- d0dfbdd: Componente `arg-icon-button`: botão só com ícone, com `label` obrigatório (vira o nome acessível; sem ele o template não compila), as mesmas variantes, tamanhos e estados do Button, e variante `tertiary` por padrão.
- a2cc4b5: Ícone `external-link` (`argIconExternalLink`), para links que abrem em outra aba.
- 4162080: Primeiro lote de ícones completo: 31 ícones novos (`arrow-left`, `arrow-right`, `chevron-down`, `chevron-up`, `minus`, `pencil`, `trash`, `copy`, `download`, `search`, `filter`, `more-horizontal`, `more-vertical`, `refresh`, `x-circle`, `lock`, `eye`, `eye-off`, `clock`, `user`, `users`, `phone`, `mail`, `map-pin`, `dollar`, `image`, `paw`, `scissors`, `bell`, `settings`, `log-out`), exportados como `argIcon*` e em `argIconsAll`.
- 97ebc52: Componentes `arg-input` e `arg-textarea` sobre os controles nativos: funcionam com Reactive Forms, formulários de signals (`[formField]`) e `[value]`; dentro do `arg-field` ligam-se sozinhos ao rótulo, à ajuda e ao erro; estados de erro, desabilitado e somente leitura; tokens `--arg-input-*`. O estilo provisório do `arg-field` passa a valer só para `<select>`.
- 46192e8: Componente `arg-link`: link de texto sempre sublinhado, variante `muted` e modo `external` (abre em nova aba, com ícone e aviso para leitor de tela; o ícone é registrado pelo próprio componente).
- 17578ac: Componente `input[arg-mask]` para CPF, CNPJ (inclusive o alfanumérico de 2026), CEP e telefone: mostra o valor com máscara, entrega ao formulário só os caracteres que contam e mantém o cursor no lugar ao editar no meio. Com Reactive Forms, valida sozinho (`incomplete`, `cpf`, `cnpj`, `cep`, `phone`); para formulários de signals, as funções `isValidCpf`, `isValidCnpj`, `isValidCep` e `isValidPhone`. Também `applyMask` e `unmask`.
- bbd1198: Componentes `arg-menu` e `arg-menu-item` e diretiva `argMenuTrigger` (importe `ARG_MENU`), no padrão "menu button" do ARIA APG: setas (com volta), Home e End, busca por letra, Esc e escolha de item fecham e devolvem o foco ao botão, Tab fecha, itens desabilitados são pulados e `tone="danger"` para ações destrutivas. O Popover passa a compartilhar com o Menu as bases `ArgPopoverBase` e `ArgPopoverTriggerBase`.
- c3e6fe6: Componente `nav[arg-pagination]`: `total` de páginas e `[(page)]`, botões Anterior e Próxima (com `aria-disabled` nas pontas, sem perder o foco), números com reticências (`pageItems`), página atual com `aria-current="page"`, "Página 3 de 12" visível e anunciado ao trocar. Em largura pequena, ficam só Anterior, Próxima e a posição.
- e6fbbce: Componente `arg-popover` e diretiva `argPopoverTrigger` (importe `ARG_POPOVER`): painel com conteúdo livre sobre o `popover="auto"` nativo, aberto por `popovertarget`, posicionado por anchor CSS junto do gatilho e virando de lado para não sair da tela. Clique fora e Esc fecham, e o foco volta ao botão. `show()`, `hide()`, `toggle()`, `isOpen` e `(openChange)`.
- 96d6288: Componente `arg-progress` sobre o `<progress>` nativo: determinado com `value` e `max`, indeterminado sem `value`, `label` obrigatório como nome acessível, `valueText` para o valor lido e tamanhos `sm` e `md`.
- 0f7e2f6: Componente `arg-select` sobre o `<select>` nativo: visual do `arg-input` com seta em CSS, Reactive Forms e formulários de signals, ligação automática ao `arg-field`. O `arg-field` deixa de estilizar `<select>` por conta própria (use `arg-select`).
- d84b67c: Componente `arg-stepper`: indicador de etapas (`steps`, `current`) numa lista ordenada com nome. Feita, atual e pendente se distinguem pela forma (✓ no marcador cheio, anel grosso, só contorno), pelo peso do texto e por texto para o leitor de tela (", concluída", ", atual", ", pendente"); a atual tem `aria-current="step"`. Orientação horizontal ou vertical e `navigable` para voltar às etapas feitas (`(stepSelect)`).
- 3e04637: Componente `arg-table` (importe `ARG_TABLE`): tabela sobre a `<table>` nativa com `caption`, colunas (`key`, `label`, `sortable`, `align`, `format`), células próprias por `argTableCell`, ordenação pelos títulos com `aria-sort`, seta e anúncio (local ou `serverSort`), seleção de linhas com "Selecionar todas" indeterminado (`[(selected)]`), carregando (`aria-busy`, marcadores) e vazio (`emptyText` ou `argTableEmpty`). No celular, a tabela rola de lado numa região focável. Também `compareValues`.
- 2b57ff1: Componentes `arg-tabs` e `arg-tab` (importe `ARG_TABS`), no padrão "tabs" do ARIA APG: lista com nome, abas ligadas aos painéis por `aria-controls` e `aria-labelledby`, setas (com volta), Home e End pelo `RovingFocus`, abas desabilitadas puladas, `[(selected)]` pelo `value` (ou `label`) e ativação `automatic` ou `manual`.
- 58f12f4: Novos temas de exemplo em `tokens/themes/`: CODA, Transparente, Arcade e Windows XP. Novos tokens semânticos `--arg-border-width-control`, `--arg-shadow-control` e `--arg-shadow-field` (contorno e relevo de botões e campos); o padrão mantém o visual atual.
- da722aa: Componente `fieldset[arg-time-slots]`: grade de horários livres e ocupados sobre rádios nativos (as setas andam pelos livres e escolhem; ocupados riscados, tracejados e lidos como "ocupado"), com `loading` (`aria-busy`, marcadores e anúncio de quantos horários livres há ao terminar) e texto para o dia sem horários. Valor "HH:MM" ou `null`, com Reactive Forms e formulários de signals.
- 24ca4f8: Serviço `ArgToast`: avisos curtos no canto da tela com `show(mensagem, { title, tone, duration, action })`, que devolve um `ArgToastRef` com o motivo do fechamento. Fila com até 3 avisos visíveis, tempo pausado com o mouse em cima ou o foco dentro, anúncio pelo leitor de tela (educado ou interrompendo, pelo tom) e pilha na camada de topo (`popover="manual"`).
- ebee052: Diretiva `argTooltip`: balão em `popover="manual"` posicionado por anchor CSS (com recurso em JS para navegadores sem suporte). Abre no foco e no hover, fecha no blur, ao sair e com Esc, deixa levar o mouse até o balão e vira `aria-describedby` do gatilho, a menos que repita o nome dele. Posições `top`, `bottom`, `left` e `right`, com troca automática de lado.

### Patch Changes

- c777e4f: Documenta as inputs `variant`, `size` e `disabled` do Button e `size` do Spinner (JSDoc, visível no editor e no catálogo).
- 165dd09: Tema CODA: tamanhos de fonte um degrau menores, porque a Silkscreen é bem mais larga que a fonte do sistema.
- ca656f4: No tema escuro, `--arg-color-text-link` clareia 10% (mistura com branco) para passar de 4.5:1 sobre `--arg-color-surface-raised`: links dentro de diálogos, popovers e menus ficavam em 4.3:1. A cor da marca do tenant continua valendo.

## 0.1.0

### Minor Changes

- 2b570ce: Novos componentes `arg-spinner` (carregamento), `arg-skeleton` (placeholder com shimmer) e lista (`ul[arg-list]`, `li[arg-list-item]`, `a|button[arg-list-action]`, ou `ARG_LIST` para importar tudo). O `arg-button` com `loading` passa a usar o `arg-spinner`, sem mudança visual. No Storybook, a seção "Padrões" mostra como combiná-los.
- dad6fa9: Primeira versão: tokens em três camadas (primitivos, semânticos, componente), tema claro/escuro, serviço `ArgTheme` para marca por tenant e componente `arg-button`.
- bfa1d24: Tokens semânticos de carregamento (`--arg-loading-bg`, `--arg-loading-highlight`, `--arg-loading-shimmer-duration`, `--arg-loading-spin-duration`): sobrescritos no `:root`, mudam o skeleton e o spinner do produto inteiro. O `arg-skeleton` ganha `animated` para desligar o brilho por instância. Durações do shimmer e do spinner passam a vir de tokens, com os mesmos valores (com "reduzir movimento", o spinner gira em 2,1s em vez de 2s).

### Patch Changes

- 8336f49: Pacote publicado no GitHub Packages como `@brunomonfardini/ui` (antes `@argila/ui`, nunca publicado). Veja no README do pacote como configurar o `.npmrc` do produto.
