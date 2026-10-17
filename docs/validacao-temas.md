# Validação dos temas

_Criado em 15/10/2026, depois do PR de estilos e paletas (#68)._ Lista do que conferir antes de seguir para o PR-2 do [plano de estilos e paletas](plano-estilos-paletas-e-catalogo.md). Marque cada item quando tiver conferido.

## Situação

_Atualizado em 17/10/2026._

| O quê                                       | Situação                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR-1, estilos e paletas (#68)               | Mergeado; publicado como `0.3.0` (#70)                                                                                                                                                                                                                                                                                                        |
| Regras de commit (`chore/merge-por-rebase`) | Mergeado (#69)                                                                                                                                                                                                                                                                                                                                |
| Checkup dos temas (`fix/checkup-de-temas`)  | Mergeado (#71)                                                                                                                                                                                                                                                                                                                                |
| Checkup completo                            | **Feito em 17/10**: 42 páginas × 20 combinações em 14 min. 0 erros, 0 rolagem, 0 falhas na barra de tema. Os 60 alertas de contraste eram 3 falsos positivos repetidos (rótulos de controles desabilitados e texto só para leitor de tela, isentos pelo WCAG 1.4.3); o checkup passou a ignorá-los e a nova rodada nas páginas afetadas deu 0 |
| Painéis translúcidos do Transparente        | **Corrigido** em `fix/paineis-do-transparente`: painéis no mínimo 80% opacos e com desfoque                                                                                                                                                                                                                                                   |
| Conferência visual (seções 2 a 4)           | **Falta**: precisa de uma pessoa olhando a barra de tema e os componentes no `npm run dev`                                                                                                                                                                                                                                                    |

**Para continuar em outro computador:** `git fetch`, `git switch fix/checkup-de-temas`, `pnpm install`; com `npm run dev` aberto, rode `npm run checkup` com o computador sem suspender (~40 min).

## 1. Verificações automáticas

Rodam sozinhas; só confirme que passam.

- [x] `npm run format:check`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`. Atenção: nesta máquina, testes do catálogo (`registry.spec.ts`, `shell.spec.ts`) às vezes estouram o limite de 5 s. Se falharem só por tempo, rode de novo e confira no CI.
- [x] `npm run dup:check`
- [x] `npm run build` e `npm run build:docs`
- [x] `npm run manifest:check`
- [x] `npm run checkup` com o catálogo aberto: abrir `checkup/relatorio.html` e conferir
  - [x] Nenhum erro de console, rolagem horizontal ou falha na barra de tema
  - [x] Cada problema de contraste listado foi olhado (real ou falso positivo)
  - [ ] A grade de capturas, página por página, comparando as colunas

## 2. Barra de tema do catálogo

Em `npm run dev`, para **cada** opção:

- [ ] **Modo:** Claro, Escuro e Automático mudam a página. O botão ativo fica marcado.
- [ ] **Estilo:** Argila, Molde, CODA, Transparente e Windows XP mudam a forma (raio, borda, sombra, fonte). O seletor mostra o estilo aplicado.
- [ ] **Paleta:** "Nativa do estilo" e "Terrosa" mudam as cores. Com "Nativa", trocar o estilo troca as cores junto; com "Terrosa", as cores ficam.
- [ ] **Opacidade:** o controle muda a transparência de cards, campos e painéis. Trocar de estilo volta à opacidade do estilo (60% no Transparente, 100% nos outros).
- [ ] **Memória:** recarregar a página mantém modo, estilo, paleta e opacidade. Os seletores mostram o que está aplicado.

## 3. Componentes em cada estilo

Para cada estilo (Argila, Molde, CODA, Transparente, Windows XP), em claro e escuro, com a paleta nativa e com a Terrosa:

- [ ] **Painéis sobre o conteúdo:** calendário do Date Picker, Dialog, Drawer, Popover e Menu, Combobox, Toast, Tooltip. Ficam enquadrados, legíveis e sem o texto de trás aparecendo.
- [ ] **Formulários:** Input e Textarea, Select, Masked Input, Currency Input, File Upload, Checkbox, Radio e Switch, Field, Date Picker. Contorno, foco e erro visíveis.
- [ ] **Ações:** Button (todas as variantes e tamanhos), Icon Button, Link.
- [ ] **Dados:** Table, List, Agenda, Time Slots, Card, Avatar, Badge, Tag.
- [ ] **Navegação:** Tabs, Breadcrumb, Pagination, Stepper, App Shell.
- [ ] **Feedback e carregamento:** Alert, Empty State, Progress Bar, Skeleton, Spinner, Divider.
- [ ] **Fonte de título:** títulos de Dialog, Card, Empty State, Alert e Toast acompanham o estilo.

## 4. Compatibilidade para produtos

- [ ] Um produto com `data-arg-brand="example"`, `"coda"`, `"transparente"` ou `"windows-xp"` continua com a mesma aparência de antes.
- [ ] Um produto sem atributo nenhum vê a paleta Terrosa e o estilo Argila.
- [ ] O pacote publicado traz `tokens/temas.css`, `tokens/styles/` e `tokens/palettes/`.

## 5. Problemas conhecidos, a corrigir

- [x] **Transparente:** painéis sobre o conteúdo (calendário, diálogos, menus) estão tão translúcidos quanto os cards (60%) e sem desfoque, então o texto de trás aparece. Correção prevista: superfícies elevadas mais opacas (80% no Transparente) e desfoque atrás dos painéis.
- [x] `--arg-surface-blur` existe, e agora os painéis sobre o conteúdo usam (vidro fosco do PR-2).
- [ ] As cores de feedback (info, sucesso, aviso, erro) ainda não foram ajustadas para a Terrosa (o plano previa tons dessaturados).

## 6. Processo

- [x] PR `chore/merge-por-rebase` mergeado **por rebase**, antes dos próximos.
- [ ] Ruleset da `main` importado no GitHub (Settings → Rules → Rulesets → Import, arquivo `.github/rulesets/main.json`), para valer o merge só por rebase.
- [ ] GitHub CLI instalado (`winget install GitHub.cli`, depois `gh auth login`), para os PRs serem abertos pelo terminal.
