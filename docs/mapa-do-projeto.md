# Mapa do projeto

Onde fica cada coisa no Argila e por onde começar para ver ou mudar. O passo a passo de cada tipo de mudança está em [Como alterar](como-alterar.md).

## Em uma frase

O Argila é **uma biblioteca de componentes Angular** (`projects/ui`, publicada como `@brunomonfardini/ui`) com **sete design systems** que mudam a aparência dos mesmos componentes, e **um catálogo** (`projects/docs`) que mostra tudo funcionando: `npm run dev` abre em <http://localhost:4200>; a versão publicada fica em <https://argila-catalogo.vercel.app>.

```text
Argila/
├── projects/ui/                ← a biblioteca (o que os produtos instalam)
│   ├── src/lib/<componente>/     um componente por pasta
│   ├── src/lib/design-systems/   manifestos dos DS, paletas, cores e exclusivos
│   ├── src/lib/theme/            ArgTheme e provideArgila (tema em tempo de execução)
│   ├── src/docs/                 formato das páginas e as páginas de texto do catálogo
│   ├── src/patterns/             padrões do catálogo (não publicados)
│   ├── src/templates/            templates do catálogo (não publicados)
│   ├── tokens/                   todo o CSS de tema: tokens, DS, paletas
│   └── icons/                    os SVGs dos ícones
├── projects/docs/              ← o catálogo (aplicação Angular)
├── scripts/                    ← geradores (ícones, cores, manifesto) e checagens
├── docs/                       ← guias (índice em docs/README.md)
└── .github/workflows/          ← CI, publicação do pacote e do catálogo
```

## Um componente por dentro

Todo componente segue o mesmo formato. Exemplo, o Button:

| Arquivo                                                          | Para que serve                                                                              | Quando mexer                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------ |
| [`button.ts`](../projects/ui/src/lib/button/button.ts)           | O componente: seletor, inputs (com JSDoc) e comportamento                                   | Mudar o que ele faz ou aceita        |
| [`button.css`](../projects/ui/src/lib/button/button.css)         | A aparência padrão, só com tokens; os tokens do componente (`--arg-button-*`) ficam no topo | Mudar a aparência em **todos** os DS |
| [`button.spec.ts`](../projects/ui/src/lib/button/button.spec.ts) | Testes unitários, incluindo acessibilidade                                                  | Sempre que o comportamento mudar     |
| [`button.docs.ts`](../projects/ui/src/lib/button/button.docs.ts) | A página do catálogo: resumo, exemplos, regras, acessibilidade e anatomia                   | Mudar o texto da página              |
| [`examples/`](../projects/ui/src/lib/button/examples)            | Os exemplos vivos da página (o código mostrado no catálogo é o próprio arquivo)             | Mostrar um caso novo                 |
| `tokens/design-systems/<ds>/componentes/button.css`              | A **pele** do componente num DS: redefine tokens e detalhes só daquele DS                   | Mudar a aparência **num DS só**      |

Alguns componentes têm um `.html` separado (o template) ou mais de um `.ts`: o Dialog, por exemplo, tem `dialog.ts` (o serviço) e `dialog-container.ts`. Tudo que é público sai de [`projects/ui/src/public-api.ts`](../projects/ui/src/public-api.ts).

## Os componentes

O nome abre a página no catálogo publicado; a pasta abre o código. "Pele própria em" diz em quais design systems o componente tem aparência curada; nos outros, ele usa a aparência padrão. "Todos" são os seis DS oferecidos aos produtos.

Componentes fora de algum DS: Agenda, Drawer e Time Slot Picker não fazem parte do Windows XP; Breadcrumb e Pagination não fazem parte do Punk. O catálogo esconde esses componentes quando o DS está escolhido.

### Ações

| Componente                                                                | Pasta                                                   | Como usar                 | Pele própria em |
| ------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------- | --------------- |
| [Button](https://argila-catalogo.vercel.app/componentes/button)           | [`lib/button`](../projects/ui/src/lib/button)           | `button[arg-button]`      | todos           |
| [Icon Button](https://argila-catalogo.vercel.app/componentes/icon-button) | [`lib/icon-button`](../projects/ui/src/lib/icon-button) | `button[arg-icon-button]` | todos           |
| [Link](https://argila-catalogo.vercel.app/componentes/link)               | [`lib/link`](../projects/ui/src/lib/link)               | `a[arg-link]`             | todos           |

### Formulário

| Componente                                                                      | Pasta                                                         | Como usar             | Pele própria em           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------- | ------------------------- |
| [Combobox](https://argila-catalogo.vercel.app/componentes/combobox)             | [`lib/combobox`](../projects/ui/src/lib/combobox)             | `input[arg-combobox]` | Transparente              |
| [Currency Input](https://argila-catalogo.vercel.app/componentes/currency-input) | [`lib/currency-input`](../projects/ui/src/lib/currency-input) | `input[arg-currency]` | nenhum (aparência padrão) |
| [Date Picker](https://argila-catalogo.vercel.app/componentes/date-picker)       | [`lib/date-picker`](../projects/ui/src/lib/date-picker)       | `input[arg-date]`     | Punk                      |
| [Field](https://argila-catalogo.vercel.app/componentes/field)                   | [`lib/field`](../projects/ui/src/lib/field)                   | `arg-field`           | todos                     |
| [File Upload](https://argila-catalogo.vercel.app/componentes/file-upload)       | [`lib/file-upload`](../projects/ui/src/lib/file-upload)       | `arg-file-upload`     | nenhum (aparência padrão) |
| [Input e Textarea](https://argila-catalogo.vercel.app/componentes/input)        | [`lib/input`](../projects/ui/src/lib/input)                   | `input[arg-input]`    | todos                     |
| [Masked Input](https://argila-catalogo.vercel.app/componentes/masked-input)     | [`lib/masked-input`](../projects/ui/src/lib/masked-input)     | `input[arg-mask]`     | nenhum (aparência padrão) |
| [Select](https://argila-catalogo.vercel.app/componentes/select)                 | [`lib/select`](../projects/ui/src/lib/select)                 | `select[arg-select]`  | todos                     |

### Seleção

| Componente                                                                                       | Pasta                                         | Como usar          | Pele própria em |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------- | ------------------ | --------------- |
| [Checkbox, Radio e Switch](https://argila-catalogo.vercel.app/componentes/checkbox-radio-switch) | [`lib/choice`](../projects/ui/src/lib/choice) | `arg-choice-group` | todos           |
| [Tag](https://argila-catalogo.vercel.app/componentes/tag)                                        | [`lib/tag`](../projects/ui/src/lib/tag)       | `arg-tag`          | todos           |

### Exibição de dados

| Componente                                                        | Pasta                                           | Como usar           | Pele própria em      |
| ----------------------------------------------------------------- | ----------------------------------------------- | ------------------- | -------------------- |
| [Avatar](https://argila-catalogo.vercel.app/componentes/avatar)   | [`lib/avatar`](../projects/ui/src/lib/avatar)   | `arg-avatar`        | Neo-brutalista, Punk |
| [Badge](https://argila-catalogo.vercel.app/componentes/badge)     | [`lib/badge`](../projects/ui/src/lib/badge)     | `span[arg-badge]`   | todos                |
| [Card](https://argila-catalogo.vercel.app/componentes/card)       | [`lib/card`](../projects/ui/src/lib/card)       | `article[arg-card]` | todos                |
| [Divider](https://argila-catalogo.vercel.app/componentes/divider) | [`lib/divider`](../projects/ui/src/lib/divider) | `hr[arg-divider]`   | todos                |
| [Icon](https://argila-catalogo.vercel.app/componentes/icon)       | [`lib/icon`](../projects/ui/src/lib/icon)       | `arg-icon`          | Windows XP           |
| [List](https://argila-catalogo.vercel.app/componentes/list)       | [`lib/list`](../projects/ui/src/lib/list)       | `ul[arg-list]`      | Neo-brutalista, Punk |
| [Table](https://argila-catalogo.vercel.app/componentes/table)     | [`lib/table`](../projects/ui/src/lib/table)     | `arg-table`         | Neo-brutalista, Punk |

### Feedback

| Componente                                                                  | Pasta                                                     | Como usar                                 | Pele própria em |
| --------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- | --------------- |
| [Alert](https://argila-catalogo.vercel.app/componentes/alert)               | [`lib/alert`](../projects/ui/src/lib/alert)               | `div[arg-alert]`                          | todos           |
| [Empty State](https://argila-catalogo.vercel.app/componentes/empty-state)   | [`lib/empty-state`](../projects/ui/src/lib/empty-state)   | `section[arg-empty-state]`                | todos           |
| [Progress Bar](https://argila-catalogo.vercel.app/componentes/progress-bar) | [`lib/progress-bar`](../projects/ui/src/lib/progress-bar) | `progress[arg-progress]`                  | todos           |
| [Toast](https://argila-catalogo.vercel.app/componentes/toast)               | [`lib/toast`](../projects/ui/src/lib/toast)               | `inject(ArgToast).show('Salvo')`          | todos           |
| [Tooltip](https://argila-catalogo.vercel.app/componentes/tooltip)           | [`lib/tooltip`](../projects/ui/src/lib/tooltip)           | `argTooltip="Texto"` em qualquer elemento | todos           |

### Carregamento

| Componente                                                          | Pasta                                             | Como usar      | Pele própria em           |
| ------------------------------------------------------------------- | ------------------------------------------------- | -------------- | ------------------------- |
| [Skeleton](https://argila-catalogo.vercel.app/componentes/skeleton) | [`lib/skeleton`](../projects/ui/src/lib/skeleton) | `arg-skeleton` | nenhum (aparência padrão) |
| [Spinner](https://argila-catalogo.vercel.app/componentes/spinner)   | [`lib/spinner`](../projects/ui/src/lib/spinner)   | `arg-spinner`  | todos                     |

### Camadas

| Componente                                                        | Pasta                                           | Como usar                            | Pele própria em          |
| ----------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------ | ------------------------ |
| [Dialog](https://argila-catalogo.vercel.app/componentes/dialog)   | [`lib/dialog`](../projects/ui/src/lib/dialog)   | `inject(ArgDialog).open(Componente)` | todos                    |
| [Drawer](https://argila-catalogo.vercel.app/componentes/drawer)   | [`lib/drawer`](../projects/ui/src/lib/drawer)   | `inject(ArgDrawer).open(Componente)` | Transparente, Punk       |
| [Menu](https://argila-catalogo.vercel.app/componentes/menu)       | [`lib/menu`](../projects/ui/src/lib/menu)       | `arg-menu`                           | Transparente, Windows XP |
| [Popover](https://argila-catalogo.vercel.app/componentes/popover) | [`lib/popover`](../projects/ui/src/lib/popover) | `arg-popover`                        | Transparente             |

### Navegação

| Componente                                                              | Pasta                                                 | Como usar             | Pele própria em           |
| ----------------------------------------------------------------------- | ----------------------------------------------------- | --------------------- | ------------------------- |
| [App Shell](https://argila-catalogo.vercel.app/componentes/app-shell)   | [`lib/app-shell`](../projects/ui/src/lib/app-shell)   | `arg-app-shell`       | nenhum (aparência padrão) |
| [Breadcrumb](https://argila-catalogo.vercel.app/componentes/breadcrumb) | [`lib/breadcrumb`](../projects/ui/src/lib/breadcrumb) | `nav[arg-breadcrumb]` | Neo-brutalista            |
| [Pagination](https://argila-catalogo.vercel.app/componentes/pagination) | [`lib/pagination`](../projects/ui/src/lib/pagination) | `nav[arg-pagination]` | Neo-brutalista            |
| [Stepper](https://argila-catalogo.vercel.app/componentes/stepper)       | [`lib/stepper`](../projects/ui/src/lib/stepper)       | `arg-stepper`         | Neo-brutalista            |
| [Tabs](https://argila-catalogo.vercel.app/componentes/tabs)             | [`lib/tabs`](../projects/ui/src/lib/tabs)             | `arg-tabs`            | todos                     |

### Domínio

| Componente                                                                    | Pasta                                                 | Como usar                  | Pele própria em |
| ----------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------- | --------------- |
| [Agenda](https://argila-catalogo.vercel.app/componentes/agenda)               | [`lib/agenda`](../projects/ui/src/lib/agenda)         | `arg-agenda`               | Punk            |
| [Time Slot Picker](https://argila-catalogo.vercel.app/componentes/time-slots) | [`lib/time-slots`](../projects/ui/src/lib/time-slots) | `fieldset[arg-time-slots]` | Punk            |

### Exclusivos

Componentes que só existem num design system. Moram dentro da pasta do DS, com o prefixo dele no nome.

| Componente                                                                                  | Pasta                                                                                                                                   | Como usar                     | Pele própria em      |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------------------- |
| [Balão (Windows XP)](https://argila-catalogo.vercel.app/componentes/xp-balloon)             | [`lib/design-systems/windows-xp/exclusivos/xp-balloon`](../projects/ui/src/lib/design-systems/windows-xp/exclusivos/xp-balloon)         | `div[arg-xp-balloon]`         | só no Windows XP     |
| [Janela (Windows XP)](https://argila-catalogo.vercel.app/componentes/xp-window)             | [`lib/design-systems/windows-xp/exclusivos/xp-window`](../projects/ui/src/lib/design-systems/windows-xp/exclusivos/xp-window)           | `section[arg-xp-window]`      | só no Windows XP     |
| [Caixa de regras (Neo-brutalista)](https://argila-catalogo.vercel.app/componentes/nb-rules) | [`lib/design-systems/neo-brutalista/exclusivos/nb-rules`](../projects/ui/src/lib/design-systems/neo-brutalista/exclusivos/nb-rules)     | `aside[arg-nb-rules]`         | só no Neo-brutalista |
| [Sticker (Neo-brutalista)](https://argila-catalogo.vercel.app/componentes/nb-sticker)       | [`lib/design-systems/neo-brutalista/exclusivos/nb-sticker`](../projects/ui/src/lib/design-systems/neo-brutalista/exclusivos/nb-sticker) | `span[arg-nb-sticker]`        | só no Neo-brutalista |
| [Card de indicador (Punk)](https://argila-catalogo.vercel.app/componentes/punk-stat-card)   | [`lib/design-systems/punk/exclusivos/punk-stat-card`](../projects/ui/src/lib/design-systems/punk/exclusivos/punk-stat-card)             | `article[arg-punk-stat-card]` | só no Punk           |
| [Estrela explosão (Punk)](https://argila-catalogo.vercel.app/componentes/punk-burst)        | [`lib/design-systems/punk/exclusivos/punk-burst`](../projects/ui/src/lib/design-systems/punk/exclusivos/punk-burst)                     | `arg-punk-burst`              | só no Punk           |
| [Trilha de pontos (Punk)](https://argila-catalogo.vercel.app/componentes/punk-dot-track)    | [`lib/design-systems/punk/exclusivos/punk-dot-track`](../projects/ui/src/lib/design-systems/punk/exclusivos/punk-dot-track)             | `arg-punk-dot-track`          | só no Punk           |

Também em `src/lib`, sem página própria: [`internal/`](../projects/ui/src/lib/internal) (utilitários dos componentes: anúncios para leitor de tela, foco, ids únicos; não são públicos) e [`theme/`](../projects/ui/src/lib/theme) (o `ArgTheme`).

## Os design systems

O DS escolhido (`data-arg-style` no `<html>`) muda forma, cores e a pele dos componentes. Cada um mora em dois lugares: o manifesto (TypeScript) e o CSS.

| DS              | Manifesto (o que aceita)                                                                            | CSS (como fica)                                                                                | Página no catálogo                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Argila (padrão) | [`design-systems/argila/ds.ts`](../projects/ui/src/lib/design-systems/argila/ds.ts)                 | [`tokens/design-systems/argila/`](../projects/ui/tokens/design-systems/argila)                 | [/design-systems/argila](https://argila-catalogo.vercel.app/design-systems/argila)                 |
| CODA            | [`design-systems/coda/ds.ts`](../projects/ui/src/lib/design-systems/coda/ds.ts)                     | [`tokens/design-systems/coda/`](../projects/ui/tokens/design-systems/coda)                     | [/design-systems/coda](https://argila-catalogo.vercel.app/design-systems/coda)                     |
| Transparente    | [`design-systems/transparente/ds.ts`](../projects/ui/src/lib/design-systems/transparente/ds.ts)     | [`tokens/design-systems/transparente/`](../projects/ui/tokens/design-systems/transparente)     | [/design-systems/transparente](https://argila-catalogo.vercel.app/design-systems/transparente)     |
| Windows XP      | [`design-systems/windows-xp/ds.ts`](../projects/ui/src/lib/design-systems/windows-xp/ds.ts)         | [`tokens/design-systems/windows-xp/`](../projects/ui/tokens/design-systems/windows-xp)         | [/design-systems/windows-xp](https://argila-catalogo.vercel.app/design-systems/windows-xp)         |
| Neo-brutalista  | [`design-systems/neo-brutalista/ds.ts`](../projects/ui/src/lib/design-systems/neo-brutalista/ds.ts) | [`tokens/design-systems/neo-brutalista/`](../projects/ui/tokens/design-systems/neo-brutalista) | [/design-systems/neo-brutalista](https://argila-catalogo.vercel.app/design-systems/neo-brutalista) |
| Punk            | [`design-systems/punk/ds.ts`](../projects/ui/src/lib/design-systems/punk/ds.ts)                     | [`tokens/design-systems/punk/`](../projects/ui/tokens/design-systems/punk)                     | [/design-systems/punk](https://argila-catalogo.vercel.app/design-systems/punk)                     |
| Molde (interno) | [`design-systems/molde/ds.ts`](../projects/ui/src/lib/design-systems/molde/ds.ts)                   | [`tokens/design-systems/molde/`](../projects/ui/tokens/design-systems/molde)                   | não tem: é a base para criar um DS novo                                                            |

Dentro da pasta de CSS de cada DS:

```text
tokens/design-systems/<ds>/
  forma.css            raio, borda, sombra, fonte e espaços do DS
  paletas/nativa.css   as cores próprias do DS (a paleta "Nativa")
  componentes/<c>.css  a pele de cada componente curado
  index.css            junta tudo (só @import)
```

O manifesto (`ds.ts`) é a única fonte do que o DS aceita: modos (claro e escuro), paletas, transparência, fundos (liso, degradê), componentes curados (`nucleoMinimo` e `curados`) e fora (`fora`), exclusivos, fontes e regras de uso. O `ArgTheme`, os testes de contraste, o checkup e o catálogo leem dali. A lista de todos os DS está em [`design-systems.ts`](../projects/ui/src/lib/design-systems/design-systems.ts).

## Tokens e temas

| Arquivo ou pasta                                                                          | O que tem                                                                                                                          |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`tokens/primitives.css`](../projects/ui/tokens/primitives.css)                           | Camada 1: valores brutos (`--arg-core-*`). Só a camada semântica usa                                                               |
| [`tokens/semantic.css`](../projects/ui/tokens/semantic.css)                               | Camada 2: tokens por uso (`--arg-color-primary`, `--arg-radius-control`…) com o valor padrão. É o contrato que os componentes usam |
| [`tokens/argila.css`](../projects/ui/tokens/argila.css)                                   | O que o produto importa primeiro: primitivos, semânticos e o DS Argila                                                             |
| [`tokens/temas.css`](../projects/ui/tokens/temas.css)                                     | Os outros DS, as paletas compartilhadas e as cores de marca                                                                        |
| [`tokens/palettes/`](../projects/ui/tokens/palettes)                                      | Paletas compartilhadas: Terrosa, Oceano, Floresta, Preto e branco, Alto contraste, Viva e Pastel                                   |
| [`tokens/colors.css`](../projects/ui/tokens/colors.css)                                   | **Gerado** pelo `npm run colors`: as 16 cores de marca da lista fixa                                                               |
| [`tokens/base.css`](../projects/ui/tokens/base.css)                                       | Opcional: fonte, cores e foco do documento                                                                                         |
| `tokens/styles/`, `tokens/palettes/nativas/`                                              | Caminhos antigos, mantidos por compatibilidade até a próxima versão major                                                          |
| [`src/lib/design-systems/palettes.ts`](../projects/ui/src/lib/design-systems/palettes.ts) | O registro das paletas compartilhadas                                                                                              |
| [`src/lib/design-systems/colors.ts`](../projects/ui/src/lib/design-systems/colors.ts)     | A lista fixa de cores de marca; `colors.generated.ts` diz quais passam no contraste em cada DS × paleta                            |
| [`src/lib/theme/theme.ts`](../projects/ui/src/lib/theme/theme.ts)                         | `ArgTheme`: troca DS, paleta, modo, cores, transparência, fundo e segmento em tempo de execução                                    |

## O catálogo (`projects/docs`)

| Onde                                                                         | O que é                                                                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`app/registry.ts`](../projects/docs/src/app/registry.ts)                    | A lista de todas as páginas (`ALL_DOC_PAGES`). Página nova entra aqui                                              |
| [`app/app.routes.ts`](../projects/docs/src/app/app.routes.ts)                | As rotas: `/componentes/<slug>/<aba>`, `/design-systems/<id>`, `/fundacao/…`                                       |
| [`app/shell/`](../projects/docs/src/app/shell)                               | O layout: barra de ícones e painel (`nav-rail`, `navigation.ts`) e barra de tema (`theme-bar`, `theme-choices.ts`) |
| [`app/pages/component-page/`](../projects/docs/src/app/pages/component-page) | A página de componente, padrão e template: abas, índice, anatomia e regras                                         |
| [`app/pages/design-system/`](../projects/docs/src/app/pages/design-system)   | A página de cada DS, montada do manifesto                                                                          |
| [`app/pages/foundation/`](../projects/docs/src/app/pages/foundation)         | Fundação: Cores, Tipografia, Espaçamento, Raio e elevação, Movimento                                               |
| [`app/pages/theme-builder/`](../projects/docs/src/app/pages/theme-builder)   | Montar tema (seção Ferramentas)                                                                                    |
| [`app/playground/`](../projects/docs/src/app/playground)                     | O playground, com um controle por input                                                                            |
| [`app/availability.ts`](../projects/docs/src/app/availability.ts)            | Curado, herdado, fora ou exclusivo: a situação de cada página em cada DS                                           |
| [`app/segments.ts`](../projects/docs/src/app/segments.ts)                    | Os segmentos de exemplo da barra de tema                                                                           |
| `src/generated/manifest.json`                                                | **Gerado** pelo `npm run manifest` (fora do git): inputs, tokens, código dos exemplos e data de cada página        |

As páginas de texto (Como começar, Acessibilidade, Ajuda e as "Sobre") ficam em [`projects/ui/src/docs/pages/`](../projects/ui/src/docs/pages), no mesmo formato das páginas de componente ([`doc-page.ts`](../projects/ui/src/docs/doc-page.ts)).

## Scripts e checagens

| Arquivo                                                                           | Comando              | O que faz                                                                                     |
| --------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------- |
| [`scripts/gerar-manifesto.ts`](../scripts/gerar-manifesto.ts)                     | `npm run manifest`   | Lê o código e gera o manifesto do catálogo                                                    |
| [`scripts/gerar-icones.ts`](../scripts/gerar-icones.ts)                           | `npm run icons`      | Valida os SVGs de `projects/ui/icons/` e gera `icons.generated.ts`                            |
| [`scripts/gerar-cores.ts`](../scripts/gerar-cores.ts)                             | `npm run colors`     | Gera `tokens/colors.css` e a lista de cores aceitas por DS × paleta                           |
| [`scripts/comparar-referencia.ts`](../scripts/comparar-referencia.ts)             | `npm run comparar`   | Captura a página de cada DS e monta `comparacao/<ds>.html` com a imagem de referência ao lado |
| [`scripts/checkup-visual.ts`](../scripts/checkup-visual.ts)                       | `npm run checkup`    | Percorre o catálogo em todos os temas no Chrome e gera `checkup/relatorio.html`               |
| [`scripts/contraste-dos-tokens.spec.ts`](../scripts/contraste-dos-tokens.spec.ts) | `npm run test`       | Contraste de todo par de cores, em todo DS × paleta × modo                                    |
| [`scripts/arquitetura.spec.ts`](../scripts/arquitetura.spec.ts)                   | `npm run test`       | Regras dos DS: pele só para curados, exclusivos com prefixo…                                  |
| [`scripts/nucleo-minimo.spec.ts`](../scripts/nucleo-minimo.spec.ts)               | `npm run test`       | Templates e padrões usam só o núcleo mínimo                                                   |
| [`scripts/mapa-do-projeto.spec.ts`](../scripts/mapa-do-projeto.spec.ts)           | `npm run test`       | Este mapa tem todo componente que existe                                                      |
| [`.dependency-cruiser.cjs`](../.dependency-cruiser.cjs)                           | `npm run arch:check` | Quem pode importar quem (um DS nunca importa outro, por exemplo)                              |

## Configuração do repositório

| Arquivo                                            | Para quê                                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `.vscode/`                                         | Extensões recomendadas, formatação ao salvar, tarefas e depuração (veja [VS Code](../README.md#vs-code) no README) |
| `jest.config.mjs`, `jest.setup.ts`                 | Testes (Jest, com três projetos: `ui`, `docs` e `scripts`) e limites de cobertura                                  |
| `eslint.config.js`, `.prettierrc`, `.editorconfig` | Lint e formatação                                                                                                  |
| `.jscpd.json`                                      | Detecção de código duplicado                                                                                       |
| `commitlint.config.js`, `.husky/`                  | Mensagem de commit e checagens antes do commit                                                                     |
| `.changeset/`                                      | As mudanças pendentes para a próxima versão do pacote                                                              |
| `.github/workflows/ci.yml`                         | O CI de todo PR (`verify` e `pr-checks`)                                                                           |
| `.github/workflows/release.yml`                    | Versão e publicação do pacote                                                                                      |
| `.github/workflows/catalogo.yml`                   | Publicação do catálogo na Vercel                                                                                   |
