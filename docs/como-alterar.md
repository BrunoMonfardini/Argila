# Como alterar

Receitas passo a passo para as mudanças mais comuns. Para saber onde fica cada arquivo, veja o [Mapa do projeto](mapa-do-projeto.md). Todos os comandos rodam na pasta `Argila`, no Git Bash ou no terminal do VS Code (veja o [README](../README.md)).

**Antes de qualquer mudança:** crie uma branch a partir da `main` atualizada (`git switch main && git pull && git switch -c feat/minha-mudanca`) e deixe o catálogo aberto com `npm run dev`, para ver o efeito na hora.

## Índice

1. [Ver um componente funcionando](#1-ver-um-componente-funcionando)
2. [Mudar a aparência de um componente em todos os design systems](#2-mudar-a-aparência-de-um-componente-em-todos-os-design-systems)
3. [Mudar a aparência de um componente num design system só](#3-mudar-a-aparência-de-um-componente-num-design-system-só)
4. [Mudar o comportamento ou criar uma input](#4-mudar-o-comportamento-ou-criar-uma-input)
5. [Mostrar um caso novo no catálogo (exemplo)](#5-mostrar-um-caso-novo-no-catálogo-exemplo)
6. [Mudar um token (cor, espaço, raio, fonte)](#6-mudar-um-token-cor-espaço-raio-fonte)
7. [Criar uma paleta compartilhada](#7-criar-uma-paleta-compartilhada)
8. [Criar um ícone](#8-criar-um-ícone)
9. [Criar um componente](#9-criar-um-componente)
10. [Criar um componente exclusivo de um design system](#10-criar-um-componente-exclusivo-de-um-design-system)
11. [Criar um design system](#11-criar-um-design-system)
12. [Criar uma página de padrão, template ou texto](#12-criar-uma-página-de-padrão-template-ou-texto)
13. [Fechar a mudança e abrir o PR](#13-fechar-a-mudança-e-abrir-o-pr)

## 1. Ver um componente funcionando

1. `npm run dev` e abra <http://localhost:4200> (ou use o catálogo publicado, <https://argila-catalogo.vercel.app>).
2. Na barra de ícones à esquerda, clique em **Componentes** e escolha o componente; ou digite o nome na busca do painel.
3. A página tem quatro abas:
   - **Visão geral:** o playground (mude as inputs e veja o código), a anatomia e os exemplos, cada um com "Ver código";
   - **Regras de uso:** quando usar, faça e não faça, e as regras do design system escolhido;
   - **Código:** as propriedades (inputs) e os tokens do componente;
   - **Acessibilidade:** leitor de tela, contraste e teclado.
4. Na barra do topo, troque o **Estilo** (design system), a **Paleta**, o **Modo**, as **Cores** e a **Opacidade**: a página inteira acompanha. A linha "Disponível em" mostra se o componente é curado, herdado ou fora em cada DS.
5. Para achar o código: o [mapa](mapa-do-projeto.md#os-componentes) tem o link da pasta de cada componente.

## 2. Mudar a aparência de um componente em todos os design systems

Exemplo: deixar o Badge com mais espaço interno.

1. Abra o CSS do componente: `projects/ui/src/lib/badge/badge.css`.
2. Os **tokens do componente** (`--arg-badge-*`) ficam no topo, no `:host`. Prefira mudar o valor de um deles a mexer nas regras abaixo.
3. Use **só tokens semânticos** (`var(--arg-space-2)`, `var(--arg-color-primary)`), nunca um valor solto (`8px`, `#333`): é o que deixa o componente acompanhar cada DS e paleta.
4. Confira no catálogo, trocando o estilo na barra do topo: os DS com pele própria podem sobrescrever o que você mudou (veja a receita 3).
5. Rode `npm run test` (o teste de contraste avisa se a mudança deixou texto ilegível) e, para mudanças visuais, o checkup daquele componente:

   ```bash
   npm run checkup -- --paginas badge
   ```

## 3. Mudar a aparência de um componente num design system só

Exemplo: botões mais arredondados só no CODA.

1. Abra a pele do componente no DS: `projects/ui/tokens/design-systems/coda/componentes/button.css`.
2. Toda regra começa pela raiz do DS (`:root[data-arg-style='coda']`) e de preferência **só redefine tokens** do componente:

   ```css
   :root[data-arg-style='coda'] .arg-button {
     --arg-button-radius: var(--arg-radius-full);
   }
   ```

3. O componente não tem pele nesse DS (é "herdado")? Para criar uma:
   1. Crie `tokens/design-systems/<ds>/componentes/<componente>.css`.
   2. Inclua o arquivo no `index.css` da pasta do DS.
   3. Acrescente o componente em `curados` no manifesto `projects/ui/src/lib/design-systems/<ds>/ds.ts`.

   O teste de arquitetura falha se uma pele existir sem o componente estar em `curados`, ou o contrário.

4. Use as classes estáveis do componente (`.arg-button`, `.arg-card`), não o seletor de atributo: componentes criados por código (Dialog, Toast) não têm o atributo.

## 4. Mudar o comportamento ou criar uma input

Exemplo: uma input `pill` no Tag.

1. No `.ts` do componente, declare a input com `input()` e **JSDoc** (o catálogo mostra o comentário na tabela de propriedades e cria o controle no playground):

   ```ts
   /** Cantos totalmente arredondados. */
   readonly pill = input(false, { transform: booleanAttribute });
   ```

2. Ligue ao template ou ao `host` (por exemplo, uma classe `arg-tag--pill`) e ao CSS.
3. No `.spec.ts`, teste o comportamento novo e a acessibilidade (`expect(a11yViolations(root)).toEqual([])`).
4. Mostre no catálogo: um exemplo novo (receita 5) ou uma regra a mais no `.docs.ts`.
5. Rode `npm run manifest` (ou deixe o modo watch do manifesto aberto, veja o README) para o catálogo ver a input nova.
6. Mudou o pacote: `npm run changeset` com `minor` (nova funcionalidade) ou `patch` (correção).

## 5. Mostrar um caso novo no catálogo (exemplo)

1. Crie `projects/ui/src/lib/<componente>/examples/<componente>-<caso>.example.ts`: um componente standalone, com `selector: 'doc-<componente>-<caso>-example'`. Copie um exemplo vizinho como ponto de partida.
2. No `<componente>.docs.ts`, acrescente em `examples`: `{ name: 'Nome do caso', description: '…', component: ComponenteCasoExample }`.
3. O catálogo mostra o exemplo e o código dele, lido do próprio arquivo pelo manifesto. O teste do catálogo confere que todo exemplo passa nas verificações de acessibilidade.

## 6. Mudar um token (cor, espaço, raio, fonte)

| Para mudar…                                   | Onde                                                                         |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| O valor padrão de um token, em todos os DS    | `projects/ui/tokens/semantic.css`                                            |
| A forma de um DS (raio, borda, sombra, fonte) | `projects/ui/tokens/design-systems/<ds>/forma.css`                           |
| As cores próprias de um DS                    | `projects/ui/tokens/design-systems/<ds>/paletas/nativa.css`                  |
| As cores de uma paleta compartilhada          | `projects/ui/tokens/palettes/<paleta>.css`                                   |
| As cores de marca da lista fixa               | `projects/ui/src/lib/design-systems/colors.ts`, depois `npm run colors`      |
| O fundo em degradê (manchas e força)          | `--arg-color-background-tint-*` e `--arg-background-image` no `semantic.css` |
| Os fundos que um DS aceita                    | `fundos` no `ds.ts` do DS (sem o campo, só o liso)                           |
| O desfoque do fundo de imagem                 | `--arg-background-blur` no `semantic.css`                                    |
| A força das manchas sobre a imagem            | `--arg-background-glow-*` no `semantic.css` (ficam sob o véu)                |
| O véu padrão do fundo de imagem               | `--arg-background-veil` no `semantic.css`: veja abaixo                       |
| O movimento das manchas                       | `@keyframes arg-background-drift` no `semantic.css`                          |
| As camadas do fundo de imagem                 | `html::before` (imagem) e `html::after` (manchas e véu) no `base.css`        |

O véu padrão é o menor com que `text`, `text-muted` e `text-link` passam sobre um pixel preto ou branco puro em todo DS que aceita o fundo `imagem`. Mudou uma cor de texto ou de fundo? O teste "contraste sobre o fundo de imagem" diz, quando falha, a opacidade mínima que o véu precisa (`veilMinimo`): ponha esse valor no token.

Depois rode `npm run test`: o teste de contraste confere cada par de cores em cada DS × paleta × modo e diz qual par caiu abaixo de 4,5:1. A página **Fundação** do catálogo mostra os valores de agora de cada token.

## 7. Criar uma paleta compartilhada

1. Crie `projects/ui/tokens/palettes/<id>.css`, com a raiz `:root[data-arg-palette='<id>']`. Copie uma paleta vizinha: o teste confere que ela define as cores de marca e não mexe em forma.
2. Importe o arquivo em `projects/ui/tokens/temas.css`, junto das outras paletas.
3. Registre em `projects/ui/src/lib/design-systems/palettes.ts`: `<id>: { nome: 'Nome', arquivo: true }`.
4. Acrescente o `<id>` na lista `paletas` do manifesto de cada DS que a aceitar.
5. Rode `npm run colors` (a lista de cores de marca aceitas muda com a paleta) e `npm run test`. A barra de tema e o checkup passam a oferecer a paleta sozinhos.

## 8. Criar um ícone

1. Desenhe no padrão (grade 24×24, só traço, `stroke="currentColor"`) e salve em `projects/ui/icons/<nome>.svg`. O padrão completo está em [`projects/ui/icons/README.md`](../projects/ui/icons/README.md).
2. Rode `npm run icons`: ele valida o SVG e gera o código. Se o desenho fugir do padrão, ele explica o porquê.
3. O ícone aparece em **Fundação → Ícones** no catálogo e passa a valer em `<arg-icon name="<nome>" />`.

## 9. Criar um componente

1. Crie a pasta `projects/ui/src/lib/<nome>/` seguindo o formato de um componente parecido (veja [Um componente por dentro](mapa-do-projeto.md#um-componente-por-dentro)):
   - `<nome>.ts`: standalone, `OnPush`, seletor de atributo sobre o elemento nativo quando ele existe (`button[arg-…]`), inputs com JSDoc;
   - `<nome>.css`: só tokens;
   - `<nome>.spec.ts`: comportamento e acessibilidade, com 80% de cobertura ou mais;
   - `<nome>.docs.ts`, com `group` (a família na navegação), e `examples/`.
2. Exporte em `projects/ui/src/public-api.ts`.
3. Registre a página em `projects/docs/src/app/registry.ts` (`ALL_DOC_PAGES`). O `npm run manifest:check` falha se um componente exportado ficar sem página.
4. Acrescente o nome em `ARG_COMPONENTS` (`projects/ui/src/lib/design-systems/design-system.ts`). O teste de arquitetura falha se uma pasta de componente ficar fora da lista.
5. Acrescente uma linha na tabela do [mapa](mapa-do-projeto.md#os-componentes). O teste do mapa falha se o componente faltar.
6. Confira o [checklist de componente pronto](#checklist-de-um-componente-pronto) e crie um changeset `minor`.

## 10. Criar um componente exclusivo de um design system

Um exclusivo só existe num DS (como a Janela do Windows XP).

1. Crie a pasta `projects/ui/src/lib/design-systems/<ds>/exclusivos/<prefixo>-<nome>/`, com os mesmos arquivos de um componente. O nome e o seletor começam pelo `prefixo` do DS: `xp-window` e `arg-xp-window`.
2. No `.docs.ts`, use `group: 'Exclusivos'` e `designSystem: '<ds>'`: o catálogo mostra a página só com esse DS escolhido.
3. Acrescente o nome em `exclusivos` no manifesto do DS.
4. Exporte em `public-api.ts`, registre no `registry.ts` e acrescente a linha na tabela de Exclusivos do [mapa](mapa-do-projeto.md#exclusivos).

O teste de arquitetura confere prefixo, pasta e seletor.

## 11. Criar um design system

1. Copie as duas pastas do Molde, a base neutra:
   - `projects/ui/tokens/design-systems/molde/` para `projects/ui/tokens/design-systems/<id>/`;
   - `projects/ui/src/lib/design-systems/molde/` para `projects/ui/src/lib/design-systems/<id>/`.
2. Nos CSS copiados, troque a raiz `:root[data-arg-style='molde']` por `:root[data-arg-style='<id>']` e tire o seletor antigo `data-arg-brand`.
3. No `ds.ts` novo, preencha:
   - `id`, `nome`, `linguagem`, `modos`, `transparencia`, `paletas` e `regras`;
   - `componentes`: `nucleoMinimo: true` quando o DS for curar o núcleo mínimo.

   Tire `interno: true` para o DS ser oferecido aos produtos.

4. Registre o manifesto em `projects/ui/src/lib/design-systems/design-systems.ts` e importe o `index.css` em `projects/ui/tokens/temas.css`.
5. Rode `npm run colors` e `npm run test`: o teste de contraste passa a cobrir o DS novo e diz o que ajustar.
6. O catálogo cria sozinho a página `/design-systems/<id>` e a opção na barra de tema. Acrescente a linha na tabela de design systems do [mapa](mapa-do-projeto.md#os-design-systems).

## 12. Criar uma página de padrão, template ou texto

| Tipo                  | Onde                                                     | Formato                                                                                                                                                                |
| --------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Padrão                | `projects/ui/src/patterns/<nome>.docs.ts` e `examples/`  | `category: 'Padrões'`, com `pattern: { problem, solution }`, `guidelines` e `related`. Problema → Solução → Exemplo → Variações → Faça e não faça → Componentes usados |
| Template              | `projects/ui/src/templates/<nome>.docs.ts` e `examples/` | `category: 'Templates'`, com exemplos de telas prontas                                                                                                                 |
| Texto (guia, "Sobre") | `projects/ui/src/docs/pages/<nome>.docs.ts`              | `content: [{ heading, body, code? }]`                                                                                                                                  |

Padrões e templates usam **só componentes do núcleo mínimo**, para funcionarem em todos os DS; o teste `scripts/nucleo-minimo.spec.ts` confere. Registre a página em `projects/docs/src/app/registry.ts`.

## 13. Fechar a mudança e abrir o PR

1. Rode as checagens (as mesmas do CI): no VS Code, **Terminal → Run Task → Verificar tudo**, ou os comandos da seção 6 do [README](../README.md#6-verificar-antes-de-abrir-o-pr).
2. Mudança visual? Rode o checkup das páginas afetadas (`npm run checkup -- --paginas <nome>`) com o catálogo aberto.
3. Crie o changeset: `npm run changeset` (mudou o pacote) ou `npm run changeset -- --empty` (só catálogo, documentação ou CI).
4. Faça commits separados por tipo (`feat:`, `test:`, `docs:`) e abra o PR. O merge é por rebase, depois do CI verde.

## Checklist de um componente pronto

- [ ] Só tokens semânticos e de componente; nenhuma cor, espaço ou raio literal
- [ ] Seletor de atributo sobre o elemento nativo, quando ele existe
- [ ] Teclado completo, conforme o padrão do ARIA APG
- [ ] Funciona em claro, escuro, alto contraste (`forced-colors`) e com `prefers-reduced-motion`
- [ ] Toda input com JSDoc
- [ ] `*.spec.ts` com cobertura de 80% ou mais, incluindo acessibilidade
- [ ] `*.docs.ts` com resumo, família (`group`), pelo menos um exemplo e "faça / não faça"
- [ ] Exportado no `public-api.ts`, registrado no catálogo e no [mapa](mapa-do-projeto.md#os-componentes)
- [ ] Changeset `minor`
