# Validação dos temas

_Criado em 15/10/2026, depois do PR de estilos e paletas (#68)._ Lista do que conferir antes de seguir para o PR-2 do [plano de estilos e paletas](plano-estilos-paletas-e-catalogo.md). Marque cada item quando tiver conferido.

## Situação

_Atualizado em 15/10/2026._

| O quê                                                                 | Situação                                                                                                                               |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| PR-1, estilos e paletas (#68)                                         | Mergeado na `main`                                                                                                                     |
| Regras de commit (`chore/merge-por-rebase`)                           | Branch no GitHub, PR a abrir. Mergear por rebase antes dos próximos                                                                    |
| Checkup dos temas (`fix/checkup-de-temas`)                            | Branch no GitHub, PR a abrir. Já tem: correção da barra de tema, testes de estrutura, teste da barra e o `npm run checkup`             |
| Checkup completo (5 estilos × 2 paletas × 2 modos × todas as páginas) | Em andamento (~40 min). Amostra rodada sem problemas: Argila e Transparente, claro e escuro, páginas Date Picker, Button e Icon Button |
| Testes neste branch                                                   | Rodaram só os testes novos, o da barra de tema, o lint e a checagem de tipos dos scripts. Suíte completa e build ainda não             |
| Painéis translúcidos do Transparente                                  | Conhecido, correção depois do resultado do checkup (seção 5)                                                                           |

## 1. Verificações automáticas

Rodam sozinhas; só confirme que passam.

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`. Atenção: nesta máquina, testes do catálogo (`registry.spec.ts`, `shell.spec.ts`) às vezes estouram o limite de 5 s. Se falharem só por tempo, rode de novo e confira no CI.
- [ ] `npm run dup:check`
- [ ] `npm run build` e `npm run build:docs`
- [ ] `npm run manifest:check`
- [ ] `npm run checkup` com o catálogo aberto: abrir `checkup/relatorio.html` e conferir
  - [ ] Nenhum erro de console, rolagem horizontal ou falha na barra de tema
  - [ ] Cada problema de contraste listado foi olhado (real ou falso positivo)
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

- [ ] **Transparente:** painéis sobre o conteúdo (calendário, diálogos, menus) estão tão translúcidos quanto os cards (60%) e sem desfoque, então o texto de trás aparece. Correção prevista: superfícies elevadas mais opacas (80% no Transparente) e desfoque atrás dos painéis.
- [ ] `--arg-surface-blur` existe, mas nenhum componente usa ainda (vidro fosco do PR-2).
- [ ] As cores de feedback (info, sucesso, aviso, erro) ainda não foram ajustadas para a Terrosa (o plano previa tons dessaturados).

## 6. Processo

- [ ] PR `chore/merge-por-rebase` mergeado **por rebase**, antes dos próximos.
- [ ] Ruleset da `main` importado no GitHub (Settings → Rules → Rulesets → Import, arquivo `.github/rulesets/main.json`), para valer o merge só por rebase.
- [ ] GitHub CLI instalado (`winget install GitHub.cli`, depois `gh auth login`), para os PRs serem abertos pelo terminal.
