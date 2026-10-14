# Plano de execução: estilos, paletas, segmentos e novo catálogo

_Versão final de 14/10/2026, com as decisões do time. Cada PR marca sua caixa aqui quando for mergeado na `main`._

Este plano complementa o [plano de execução do design system](plano-de-execucao.md) e segue o [padrão de pipeline](padrao-de-pipeline.md): branch nova a partir da `main`, testes, lint, `jscpd` e changeset quando mexer em `projects/ui`.

## 1. Objetivo

1. Separar a aparência do Argila em **eixos independentes**: estilo (forma), paleta (cor), cores de marca, modo claro/escuro e transparência. Qualquer combinação deve funcionar, sempre com contraste AA.
2. Dar aos produtos o conceito de **segmento**: um conjunto nomeado de escolhas, como um produto com uma versão premium escura e outra versão mais vibrante.
3. Reorganizar o catálogo com **barra de ícones + painel**, **páginas em abas**, **anatomia**, **templates** e **padrões**.

## 2. Decisões tomadas

| #   | Decisão                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | A paleta `clay` atual é **ajustada** (não substituída) para os tons de café: `#26150D`, `#482616`, `#5D3721`, `#896448`, `#AB8D6F`. Passa a se chamar **Terrosa**. |
| D2  | Estilos: **Molde** (o antigo "Exemplo", renomeado), **Argila** (padrão), **Neo-brutalista**, **Punk**, **CODA**, **Transparente** e **Windows XP**.                |
| D3  | **Arcade é removido**, sem redirecionamento: não está em uso em nenhum produto.                                                                                    |
| D4  | Argila vira um estilo **3D fofo, "de massinha"**, opaco. Transparente vira **vidro fosco**, sem neumorfismo, para os dois não se confundirem.                      |
| D5  | Paletas: **Terrosa** (padrão), **Preto e branco**, **Viva**, **Pastel**, **Oceano**, **Floresta**, **Alto contraste**, mais a **paleta nativa** de cada estilo.    |
| D6  | Cores de marca: **primária, secundária e destaque**, escolhidas de uma **lista fixa de cores já validadas**. Não há cor livre com checagem em tempo de execução.   |
| D7  | Cada estilo declara os **modos que suporta**. Quando o estilo suporta os dois, o modo escuro e o claro **invertem a cor dominante** (ver 3.3).                     |
| D8  | **Transparência ajustável** (controle deslizante) em qualquer estilo: padrão 100%, 60% no Transparente, mínimo de 40%.                                             |
| D9  | **Segmentos** declarados pelo app, só com estilos, paletas e cores da lista fixa. No catálogo, os nomes de exemplo são genéricos (Essencial, Premium, Vibrante).   |
| D10 | Versão **minor** (`0.2.0` → `0.3.0`), com o `data-arg-brand` funcionando por compatibilidade.                                                                      |
| D11 | Catálogo com **todas as seções**. Atualizações, Ajuda e Ferramentas começam enxutas. Navegação por **barra de ícones + painel que abre ao clicar**.                |
| D12 | **Templates** são exemplos de uso genéricos, com código para copiar. Não são componentes exportados pelo pacote.                                                   |
| D13 | **Padrões** em duas levas, com um formato fixo de página, e espaço aberto para incluir outros depois.                                                              |
| D14 | **Anatomia** começa pelos 10 componentes mais usados.                                                                                                              |
| D15 | Itens das imagens que o Argila não tem viram **variantes do que já existe**. **Chart fica fora.**                                                                  |
| D16 | Fontes novas vêm do **Google Fonts, carregadas pelo produto**, como o CODA já faz.                                                                                 |
| D17 | **6 PRs**, maiores, com branch e PR abertos pelo `gh`.                                                                                                             |

## 3. Modelo de tema

### 3.1 Os eixos

| Eixo           | No `<html>`                                   | API (`ArgTheme`)                     | Controla                                                               |
| -------------- | --------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Estilo         | `data-arg-style`                              | `setStyle('neo-brutalista')`         | raio, espessura de borda, sombra/relevo, fontes, desfoque              |
| Paleta         | `data-arg-palette`                            | `setPalette('oceano')`               | fundo, superfícies, texto, bordas, foco, feedback, cores-base de marca |
| Cores de marca | `data-arg-primary` / `-secondary` / `-accent` | `setColors({ primary: 'cobre', … })` | sobrescrevem as cores-base da paleta, só com nomes da lista fixa       |
| Modo           | `data-arg-theme` (já existe)                  | `setColorScheme('dark')` (já existe) | claro / escuro / automático, limitado aos modos do estilo              |
| Transparência  | `--arg-surface-opacity`                       | `setSurfaceOpacity(0.6)`             | opacidade das superfícies, de 0,4 a 1                                  |
| Segmento       | `data-arg-segment`                            | `setSegment('premium')`              | aplica de uma vez todos os eixos acima                                 |

Precedência, da mais fraca para a mais forte: **padrão do Argila → paleta nativa do estilo → paleta escolhida → cores de marca → segmento**. Quem usa só CSS escreve os atributos à mão. Quem usa Angular chama o `ArgTheme`, que escreve os mesmos atributos.

### 3.2 Arquivos

```
projects/ui/tokens/
  primitives.css        ← rampas novas: café (terrosa), oceano, floresta, pastel, viva…
  semantic.css          ← tokens novos: secondary, accent, font-family-heading, surface-opacity
  styles/               ← só FORMA
    molde.css  argila.css  neo-brutalista.css  punk.css  coda.css  transparente.css  windows-xp.css
  palettes/             ← só COR
    terrosa.css  mono.css  viva.css  pastel.css  oceano.css  floresta.css  alto-contraste.css
    nativas/  molde.css  neo-brutalista.css  punk.css  coda.css  transparente.css  windows-xp.css
  colors.css            ← lista fixa de cores de marca (D6)
  themes/               ← só compatibilidade com data-arg-brand (removida numa major futura)
```

Tokens semânticos novos (todos com padrão, então os componentes atuais continuam iguais):

- `--arg-color-secondary`, `--arg-color-on-secondary`, `--arg-color-secondary-subtle`
- `--arg-color-accent`, `--arg-color-on-accent`, `--arg-color-accent-subtle`
- `--arg-font-family-heading` (padrão: a mesma do corpo)
- `--arg-surface-opacity` (padrão: 1) e `--arg-surface-blur` (calculado a partir da opacidade)
- `--arg-border-width-container`, para os cards de contorno grosso do Neo-brutalista

Onde secundária e destaque aparecem:

- **Secundária:** botão `secondary`, tag selecionada, aba ativa, choice marcado.
- **Destaque:** badge, barra de progresso, passo atual do stepper, marcadores da anatomia, indicador de notificação.

### 3.3 Modos por estilo e inversão da cor dominante

Cada estilo declara, num metadado lido pelo `ArgTheme` e pelo catálogo, os modos que suporta. Se o estilo suporta só um modo, o seletor de modo fica desabilitado nele e mostra o motivo.

Quando o estilo suporta os dois modos, a **cor dominante** (fundo e superfícies) troca de lado e a cor de ação vai para o lado oposto, para manter o contraste. Na Terrosa:

| Papel                | Claro: **bege domina**         | Escuro: **marrom domina**               |
| -------------------- | ------------------------------ | --------------------------------------- |
| Fundo                | off-white `#F4EDE4` (derivado) | café `#26150D`                          |
| Superfície           | `#FBF7F2`                      | `#33200F` (entre `#26150D` e `#482616`) |
| Superfície elevada   | `#FFFFFF`                      | `#482616`                               |
| Superfície rebaixada | bege `#E6D9C7`                 | `#1C0F09`                               |
| Texto                | `#26150D`                      | `#F4EDE4`                               |
| Texto secundário     | `#5D3721`                      | `#AB8D6F`                               |
| Primária (ação)      | marrom `#5D3721`               | bege `#AB8D6F`, com texto `#26150D`     |
| Secundária           | `#896448`                      | `#C7AE94`                               |
| Destaque             | `#482616`                      | `#D9C2A6`                               |
| Bordas               | `#D9C9B4` / `#AB8D6F`          | `#5D3721` / `#896448`                   |

Os valores finais saem do teste de contraste: se algum par ficar abaixo de AA, o valor é ajustado no PR, sem mudar o papel da cor.

Modos previstos por estilo:

| Estilo         | Modos          | Observação                                                                                                                                          |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Molde          | claro e escuro | neutro                                                                                                                                              |
| Argila         | claro e escuro | no escuro, o volume "de massinha" usa brilho em vez de sombra                                                                                       |
| Neo-brutalista | claro e escuro | claro = papel bege com tinta preta. Escuro = papel grafite com contorno off-white. Se o escuro perder a identidade, fica **só claro**               |
| Punk           | escuro e claro | escuro é o nativo. Claro = papel off-white com cards chapados e contorno preto. Mesma regra do Neo-brutalista: se não funcionar, fica **só escuro** |
| CODA           | claro e escuro | já existe                                                                                                                                           |
| Transparente   | claro e escuro | já existe                                                                                                                                           |
| Windows XP     | claro e escuro | já existe                                                                                                                                           |

### 3.4 Os estilos

| Estilo                       | Referência                    | Forma                                                                                                                                                                                                  | Fontes (Google Fonts)                         | Paleta nativa                                                                      |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Molde** (antigo "Exemplo") | tema de exemplo atual         | ponto de partida neutro: controles em pílula, contêineres arredondados, sem relevo. É o "molde" de onde um produto cria o seu estilo                                                                   | sistema                                       | azul atual do exemplo                                                              |
| **Argila** (padrão)          | "Product UI Styleguide"       | volume macio: sombra difusa embaixo + realce interno em cima, controles em pílula, cards com cantos de 1.25–1.5rem, campos rebaixados em pílula, abas segmentadas, foco com brilho                     | sistema (sem custo de carregamento no padrão) | **Terrosa**                                                                        |
| **Neo-brutalista**           | "Neo-Brutalist Design System" | contorno preto de 3px, cantos retos (raio máximo de 4px), sombra dura deslocada (4px 4px 0), blocos de cor chapada, títulos em caixa alta, alvo mínimo de 44px, foco sempre visível com moldura grossa | Archivo Black (títulos) + Archivo (corpo)     | papel bege `#F5F5DC`, preto, ciano `#00C2CB`, magenta `#FF00FF`, amarelo `#FFD700` |
| **Punk**                     | app escuro com cards neon     | fundo preto, cards de cor chapada com cantos grandes (1.5rem), botões em pílula branca, títulos pesados em caixa alta, estrela "explosão" como ornamento opcional (SVG, só nos exemplos)               | Unbounded (títulos) + sistema (corpo)         | preto, rosa `#F06BB8`, amarelo `#EDF040`, verde `#3FE36B`, azul `#4C8DFF`          |
| **CODA**                     | já existe                     | sem mudança de forma, só separada da cor                                                                                                                                                               | Silkscreen (já carregada)                     | rosa e amarelo atuais                                                              |
| **Transparente**             | já existe                     | vira **vidro fosco**: `backdrop-filter: blur()` proporcional à transparência, bordas finas claras, sem neumorfismo                                                                                     | sistema                                       | cinza e laranja atuais                                                             |
| **Windows XP**               | já existe                     | sem mudança de forma                                                                                                                                                                                   | Tahoma (sistema)                              | cinza e azul-marinho atuais                                                        |

Nos estilos de cor chapada (Neo-brutalista e Punk), o texto sobre os cards é sempre preto ou branco, escolhido pelo contraste de cada cor, nunca pelo gosto.

### 3.5 Paletas

Cada paleta define os dois modos e passa pelo teste de contraste em todos os estilos.

| Paleta         | Ideia                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- |
| Terrosa        | café, bege e off-white (3.3)                                                                |
| Preto e branco | só neutros. A primária é preta no claro e branca no escuro                                  |
| Viva           | saturada: magenta, ciano, amarelo, próxima do Punk                                          |
| Pastel         | menta, lavanda, pêssego, com superfícies quase brancas (próxima do styleguide 3D)           |
| Oceano         | azul-petróleo, areia, coral                                                                 |
| Floresta       | verde-musgo, oliva, madeira                                                                 |
| Alto contraste | preto, branco, amarelo e azul puros, contraste AAA (7:1) para texto, bordas sempre visíveis |
| Nativa         | as cores originais de cada estilo                                                           |

### 3.6 Cores de marca: lista fixa (D6)

`colors.css` traz uma **lista fixa de cerca de 16 cores** com nome, por exemplo cobre, caramelo, terracota, oliva, musgo, petróleo, ardósia, anil, ameixa, vinho, coral, mostarda, grafite, areia, menta e lavanda. Cada cor tem:

- valor no modo claro e no modo escuro;
- cor de texto por cima (`on-…`) já calculada;
- versões `hover`, `pressed` e `subtle`, derivadas como hoje.

**Toda combinação cor × paleta × modo é testada no CI.** Se uma cor não passa em alguma paleta, ela não aparece como opção nessa paleta: a lista de cores permitidas por paleta é gerada pelo teste. Com isso, o produto nunca precisa de validação em tempo de execução.

`setBrand({ primary: '#hex' })` continua existindo por compatibilidade, com aviso na documentação de que o contraste passa a ser responsabilidade do produto.

### 3.7 Segmentos (D9)

O app declara os segmentos uma vez. Só são aceitos estilos, paletas e cores existentes, e o TypeScript recusa nomes que não existem:

```ts
provideArgila({
  segments: {
    essencial: { style: 'argila', palette: 'terrosa' },
    premium: {
      style: 'argila',
      palette: 'terrosa',
      scheme: 'dark',
      colors: { accent: 'caramelo' },
    },
    vibrante: {
      style: 'punk',
      palette: 'viva',
      colors: { primary: 'coral', secondary: 'anil', accent: 'mostarda' },
    },
  },
  defaultSegment: 'essencial',
});

inject(ArgTheme).setSegment('premium');
```

Quando o segmento fixa o modo (`scheme: 'dark'`), o seletor de modo do produto pode ficar escondido.

Uso só com CSS: o `npm run argila:segmentos` gera, a partir do mesmo objeto, um CSS com `[data-arg-segment='premium'] { … }`.

### 3.8 Transparência (D8)

- `--arg-surface-opacity` vale de 0,4 a 1. Os valores fora dessa faixa são presos aos limites pelo `ArgTheme` e com `clamp()` no CSS.
- As superfícies usam `color-mix(in oklab, var(--arg-color-surface) calc(var(--arg-surface-opacity) * 100%), transparent)`.
- O desfoque cresce quando a opacidade cai: `--arg-surface-blur` vai de 0 a 16px.
- O teste de contraste calcula a cor das superfícies no **pior caso** (40% sobre o fundo da paleta), para o texto continuar legível em qualquer posição do controle.

## 4. Catálogo

### 4.1 Navegação

**Barra de ícones fixa à esquerda**, com o rótulo embaixo de cada ícone. Ao clicar, abre um **painel** com os itens da seção, que fica aberto até a pessoa escolher uma página ou clicar fora. Itens com subgrupo expandem no lugar. A busca fica no topo do painel. No celular, barra e painel ficam dentro de uma gaveta.

Ícones novos (`book`, `rocket`, `layers`, `layout`, `wrench`, `help-circle`, `accessibility`, `sparkles`) são desenhados no padrão da seção 1.2 do [design system próprio](design-system-proprio.md), como os do primeiro lote.

| Seção          | Começa com                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Início         | a página atual                                                                                                                                                |
| Atualizações   | _(enxuta)_ o `CHANGELOG.md` do pacote, renderizado                                                                                                            |
| Como começar   | instalar, importar tokens, escolher estilo/paleta/segmento, primeiro componente                                                                               |
| Acessibilidade | princípios, contraste, teclado, leitor de tela, como o Argila testa                                                                                           |
| Fundação       | Tokens, Ícones (já existem), Cores, Tipografia, Espaçamento, Raio e elevação, Movimento, **Estilos e paletas** (grade de combinações)                         |
| Componentes    | os 38 componentes atuais em famílias: Ações, Formulário, Seleção, Exibição de dados, Feedback, Carregamento, Camadas, Navegação, Domínio (Agenda, Time Slots) |
| Padrões        | leva 1 (4.4)                                                                                                                                                  |
| Templates      | Sobre templates, Empty State, Ending Screen, Error Message, Loaders, Receipt                                                                                  |
| Ferramentas    | _(enxuta)_ **Montar tema**: escolher estilo, paleta, cores, modo e transparência, e copiar o objeto do segmento ou o CSS                                      |
| Ajuda          | _(enxuta)_ perguntas frequentes, como pedir um componente, como contribuir                                                                                    |

### 4.2 Barra de tema no cabeçalho

**Estilo** (select) · **Paleta** (amostras) · **Cores** (primária, secundária, destaque, cada uma em amostras da lista fixa) · **Transparência** (controle deslizante) · **Modo** (desabilitado quando o estilo só tem um) · **Segmento de exemplo** (Essencial, Premium, Vibrante).

Tudo fica salvo no navegador e na URL, para dar para compartilhar uma combinação.

### 4.3 Página em abas

- **Cabeçalho** com título, resumo e "Atualizado em dd/mm/aaaa às hh:mm" (data do último commit do arquivo `*.docs.ts`, gerada pelo manifesto).
- **Abas**, com a aba ativa na URL (`/componentes/button/codigo`):
  - **Visão geral:** o que é, quando usar e quando não usar, anatomia, variantes, exemplos.
  - **Regras de uso:** faça e não faça, com exemplo visual.
  - **Código:** playground, exemplos com "Ver código", propriedades, tokens.
  - **Acessibilidade:** o que já existe, mais uma tabela de teclado.
- **Índice "nesta página"** à direita nas telas largas.

Campos novos no `DocPage`, todos opcionais:

```ts
category: 'Fundação' | 'Componentes' | 'Padrões' | 'Templates'; // 'Fundamentos' vira 'Fundação'
group?: string;
whenToUse?: string[];
whenNotToUse?: string[];
anatomy?: { example: Type<unknown>; parts: { label: string; description: string }[] };
keyboard?: { key: string; action: string }[];
related?: string[];
pattern?: { problem: string; solution: string };
```

**Anatomia:** o exemplo marca cada parte com `data-anatomy="1"`, e o catálogo desenha marcadores numerados na cor de destaque, com a legenda ao lado. Como é desenhada na hora, acompanha estilo e paleta.

Primeiros 10 componentes com anatomia: Button, Input, Select, Card, Dialog, Alert, Toast, Tabs, Table e Empty State.

### 4.4 Padrões

Toda página de padrão tem o mesmo formato: **Problema → Solução → Exemplo montado com componentes reais → Variações → Faça / não faça → Componentes usados**. Um padrão novo entra copiando esse formato. A página "Sobre padrões" explica como sugerir um.

- **Leva 1:** Sobre padrões, Carregamentos (já existe, ajustado ao formato), Erros e feedback, Data entry (formulários), Mostrar e ocultar, Navegação, Layout, Aplicação de cores.
- **Leva 2:** Senhas, Comprovantes, Linhas do tempo, Contextos, Encontrabilidade de ajuda, Espaços de vitrine, Home, Menu de hubs, Indicadores de experiência, Princípios aplicados à IA.

### 4.5 Templates

São telas completas e genéricas, montadas só com componentes do Argila, com "Ver código" e a explicação de cada bloco.

| Template      | Conteúdo                                                               |
| ------------- | ---------------------------------------------------------------------- |
| Empty State   | lista vazia, busca sem resultado, primeiro uso                         |
| Ending Screen | sucesso no fim de um fluxo, com próximos passos                        |
| Error Message | erro de carregamento, sem conexão, sem permissão, com "tentar de novo" |
| Loaders       | carregamento de tela cheia, de seção e de ação                         |
| Receipt       | comprovante com resumo, detalhes, compartilhar e baixar                |

### 4.6 Variantes nos componentes atuais (D15)

| Item da imagem           | Onde entra                                                       |
| ------------------------ | ---------------------------------------------------------------- |
| Pagination Dots          | `arg-pagination` com `variant="dots"`                            |
| Progress Steps / Tracker | `arg-stepper` com `orientation="vertical"` e estado de progresso |
| Bottom Sheet             | `arg-drawer` com `position="bottom"`                             |
| Linha do tempo           | padrão "Linhas do tempo", montado com List                       |
| Shortcut                 | padrão montado com Card + Icon Button                            |

## 5. PRs

Cada PR nasce da `main` atualizada, tem um commit por parte e é aberto com `gh pr create`.

| ✓   | PR   | Branch                     | Entrega                                                                                                                                                                                                                                                                                                                                                                                               | Depende de | Estimativa |
| --- | ---- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [ ] | PR-1 | `feat/motor-de-temas`      | Eixos estilo × paleta; tokens novos (secundária, destaque, fonte de título, transparência); Terrosa ajustada; os 4 estilos atuais separados em forma + cor; Arcade removido; Exemplo renomeado para Molde; `ArgTheme` (`setStyle`, `setPalette`, `setColors`, `setSurfaceOpacity`, modos por estilo); compatibilidade com `data-arg-brand`; **teste de contraste da matriz inteira**; changeset minor | —          | 5 d        |
| [ ] | PR-2 | `feat/estilos-e-paletas`   | Estilos Argila 3D, Neo-brutalista e Punk, com os dois modos; Transparente como vidro fosco; as 7 paletas e as nativas; lista fixa de cores; segmentos (`provideArgila`, `setSegment`, gerador de CSS); ajustes nos componentes que quebrarem em alguma combinação                                                                                                                                     | PR-1       | 8 d        |
| [ ] | PR-3 | `feat/catalogo-estrutura`  | Barra de ícones + painel; ícones novos; `DocPage` novo; componentes agrupados em famílias; páginas em abas com "Atualizado em" e índice; barra de tema nova; categoria Templates                                                                                                                                                                                                                      | PR-1       | 7 d        |
| [ ] | PR-4 | `feat/catalogo-conteudo`   | Como começar, Acessibilidade, Fundação (Cores, Tipografia, Espaçamento, Raio e elevação, Movimento, Estilos e paletas), Atualizações, Ajuda, Ferramentas → Montar tema; anatomia dos 10 componentes                                                                                                                                                                                                   | PR-2, PR-3 | 7 d        |
| [ ] | PR-5 | `feat/templates-e-padroes` | Os 5 templates; padrões da leva 1; variantes da tabela 4.6                                                                                                                                                                                                                                                                                                                                            | PR-3       | 9 d        |
| [ ] | PR-6 | `feat/padroes-leva-2`      | Padrões da leva 2                                                                                                                                                                                                                                                                                                                                                                                     | PR-5       | 6 d        |

**Total:** cerca de 42 dias de trabalho de uma pessoa. PR-2 e PR-3 podem andar em paralelo depois do PR-1.

## 6. Como saber que terminou

- `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm dup:check` e `pnpm format:check` passam em todo PR.
- O teste de contraste cobre **7 estilos × 8 paletas × 2 modos × cores permitidas × transparência mínima**, e falha o CI se algum par de texto ficar abaixo de AA (AAA no Alto contraste).
- Cada página nova do catálogo passa nas verificações de acessibilidade que já existem (`testing/a11y.ts`).
- Com `npm run dev`, dá para trocar estilo, paleta, cores, modo, transparência e segmento no cabeçalho, e a escolha sobrevive a recarregar a página e a um link compartilhado.
- Nenhuma marca, texto ou ilustração das referências visuais entra no repositório: só a organização e a linguagem visual.

## 7. Riscos

- **Mudança visual do padrão:** todo produto sem tema próprio passa a ver a Terrosa e o Argila 3D na `0.3.0`. O changelog explica como manter o visual anterior (`data-arg-style="molde"` + `data-arg-palette="nativa"`).
- **Tamanho da matriz de contraste:** o teste roda em Node, puro cálculo, sem navegador. Se ficar lento, divide-se por estilo.
- **`backdrop-filter`** em navegadores sem suporte: o vidro cai para a superfície opaca, sem perder contraste.
- **Neo-brutalista escuro e Punk claro** podem não ficar bons. Nesse caso o estilo fica com um modo só (D7), e o PR-2 registra o motivo aqui.
