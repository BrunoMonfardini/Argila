# Validação visual dos temas

Roteiro para uma pessoa conferir, no catálogo, o que os testes automáticos não veem: se cada design system está bonito, legível e fiel à referência. Marque cada item quando tiver conferido.

_Atualizado em 19/10/2026, com os sete design systems e o catálogo novo._

## Como conferir

1. `npm run dev` e abra <http://localhost:4200>, ou use o [catálogo publicado](https://argila-catalogo.vercel.app).
2. Escolha o design system, a paleta e o modo na barra do topo. A escolha fica no endereço: dá para mandar o link de um problema para o time.
3. Para comparar todas as combinações lado a lado, rode o checkup com o catálogo aberto (o ciclo completo leva uns 40 minutos; dá para filtrar, veja o [README](../README.md#6-verificar-antes-de-abrir-o-pr)):

   ```bash
   npm run checkup
   ```

   E abra `checkup/relatorio.html`.

## 1. Verificações automáticas

Rodam no CI de todo PR; aqui é só confirmar.

- [x] Formatação, lint, tipos, testes (com contraste de todo par de cores em cada DS × paleta × modo), duplicação, arquitetura e catálogo
- [x] Checkup completo sem erros de console, rolagem horizontal ou falhas na barra de tema
- [ ] A grade de capturas do `checkup/relatorio.html`, página por página, comparando as colunas

## 2. Barra de tema do catálogo

- [ ] **Estilo:** os sete design systems (Argila, Molde, CODA, Transparente, Windows XP, Neo-brutalista e Punk) mudam forma e cores; o seletor mostra o aplicado.
- [ ] **Paleta:** só aparecem as paletas que o DS aceita (no Punk: Nativa, Viva e Alto contraste).
- [ ] **Cores:** só aparecem as cores de marca que passam no contraste no DS e na paleta atuais; escolher uma muda a primária, a secundária ou o destaque.
- [ ] **Modo:** Claro, Escuro e Automático; o que o DS não tem fica desabilitado (o Punk só tem escuro).
- [ ] **Opacidade:** muda a transparência das superfícies; fica desabilitada no CODA, Windows XP, Neo-brutalista e Punk.
- [ ] **Segmento:** Essencial, Premium e Vibrante aplicam tudo de uma vez.
- [ ] **Memória e link:** recarregar a página mantém a escolha; abrir o link copiado reproduz a combinação; um link com escolha inválida (`?ds=punk&paleta=terrosa`) cai no padrão e mostra um aviso.

## 3. Componentes em cada design system

Para cada DS, nos modos que ele tem, com a paleta nativa e com uma compartilhada:

- [ ] **Painéis sobre o conteúdo:** calendário do Date Picker, Dialog, Drawer (também o de baixo), Popover, Menu, Combobox, Toast e Tooltip ficam enquadrados e legíveis, sem o texto de trás aparecendo.
- [ ] **Formulários:** Input e Textarea, Select, Masked Input, Currency Input, File Upload, Checkbox, Radio e Switch, Field e Date Picker, com contorno, foco e erro visíveis.
- [ ] **Ações:** Button (todas as variantes e tamanhos), Icon Button e Link.
- [ ] **Dados:** Table, List, Agenda, Time Slots, Card, Avatar, Badge e Tag.
- [ ] **Navegação:** Tabs (sublinhadas e segmentadas), Breadcrumb, Pagination (números e pontos), Stepper e App Shell.
- [ ] **Feedback e carregamento:** Alert, Empty State, Progress Bar, Skeleton, Spinner e Divider.
- [ ] **Exclusivos:** a Janela e o Balão no Windows XP; o Sticker e a Caixa de regras no Neo-brutalista; o Card de indicador, a Trilha de pontos e a Estrela no Punk.
- [ ] **Fiel à referência:** a página de cada DS (Design systems → nome) lado a lado com a imagem em `docs/referencias/`.

## 4. Compatibilidade para produtos

- [ ] Um produto sem atributo nenhum vê o Argila com a paleta Massinha.
- [ ] Um produto com o atributo antigo `data-arg-brand` (`example`, `coda`, `transparente` ou `windows-xp`) continua com a aparência de antes.
- [ ] O pacote publicado traz `tokens/argila.css`, `tokens/temas.css`, `tokens/design-systems/` e `tokens/palettes/`.

## 5. Pontos em aberto

- [ ] As cores de feedback (informação, sucesso, aviso e erro) na paleta Terrosa ainda são as padrão; a ideia original era usar tons dessaturados. Decidir se ajusta.

## Histórico

- **15/10/2026:** roteiro criado depois do PR de estilos e paletas (#68).
- **17/10/2026:** checkup completo (42 páginas × 20 combinações) sem erros; painéis do Transparente corrigidos (#73).
- **18/10/2026:** sete design systems e catálogo novo concluídos (#71 a #106): sete design systems, catálogo novo, templates e padrões. Ruleset da `main` ativo e GitHub CLI em uso.
