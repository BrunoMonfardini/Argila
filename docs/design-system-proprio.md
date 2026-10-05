# Design system 100% nosso: passo a passo

Plano para o Argila deixar de depender de ferramentas de terceiros de design system: o catálogo de componentes (hoje o Storybook) vira uma aplicação Angular nossa, e os componentes continuam sem bibliotecas de UI de fora.

O plano tem 6 fases. Cada uma termina com algo funcionando e pode ir para a `main` sozinha, por PR, seguindo o [padrão de pipeline](padrao-de-pipeline.md). O Storybook só é removido na fase 3, quando o catálogo próprio já faz tudo o que ele fazia.

## Sumário

- [O que "100% nosso" significa](#o-que-100-nosso-significa)
- [Como fica o repositório no final](#como-fica-o-repositório-no-final)
- [Fase 1: Fundamentos próprios](#fase-1-fundamentos-próprios)
- [Fase 2: Catálogo próprio](#fase-2-catálogo-próprio)
- [Fase 3: Migrar do Storybook e removê-lo](#fase-3-migrar-do-storybook-e-removê-lo)
- [Fase 4: Componentes sem bibliotecas de terceiros](#fase-4-componentes-sem-bibliotecas-de-terceiros)
- [Fase 5: Qualidade](#fase-5-qualidade)
- [Fase 6: Publicação do pacote e do catálogo](#fase-6-publicação-do-pacote-e-do-catálogo)
- [Checklist de um componente pronto](#checklist-de-um-componente-pronto)
- [Ordem e estimativa](#ordem-e-estimativa)

---

## O que "100% nosso" significa

**Nenhum objeto de terceiros no design system.** Tudo o que alguém vê ou usa do Argila é criado pelo time:

- **Ativos visuais:** ícones desenhados por nós (nenhum conjunto como Lucide, Tabler ou Material Icons), fonte do sistema operacional (nenhuma fonte baixada), ilustrações próprias.
- **Componentes:** escritos sobre HTML nativo (nenhuma biblioteca de UI: Angular CDK, Spartan, PrimeNG, Material).
- **Documentação e catálogo:** aplicação Angular nossa (nenhum Storybook, Docusaurus ou similar).

O que fica é a **infraestrutura** sobre a qual qualquer projeto roda. Ela não aparece para quem usa o design system, e reescrevê-la não traz nada ao produto:

| Camada                        | Exemplos                                                                | Decisão                                         |
| ----------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| **Design system**             | Tokens, ícones, fonte, componentes, temas, catálogo, documentação       | **Construímos tudo.** Zero objetos de terceiros |
| **Base da plataforma**        | Angular, TypeScript, Node, navegador (HTML, CSS, `<dialog>`, `popover`) | Usamos. É a fundação, não o design system       |
| **Ferramentas de engenharia** | pnpm, Vitest, ESLint, Prettier, ng-packagr, GitHub Actions              | Usamos. Não aparecem para quem consome o pacote |

### Inventário de terceiros: o que sai e o que fica

Todas as dependências do repositório hoje, e o destino de cada uma:

| Dependência                                                                              | Para que serve hoje                           | Destino                                                                           |
| ---------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| `storybook`, `@storybook/angular-vite`, `@storybook/addon-docs`, `@storybook/addon-a11y` | Catálogo de componentes                       | **Sai** na fase 3, substituído pelo catálogo próprio                              |
| `vite`, `@analogjs/vite-plugin-angular`                                                  | Compilação do Storybook                       | **Sai** na fase 3 (o catálogo usa o compilador do próprio Angular)                |
| `@angular-devkit/architect`, `@angular-devkit/core`, `@angular/animations`               | Exigidos só pelo Storybook                    | **Sai** na fase 3                                                                 |
| Fonte Inter (citada no token `--arg-core-font-sans`)                                     | Tipografia                                    | **Sai** na fase 1, trocada pela fonte do sistema                                  |
| `@angular/*`, `rxjs`, `tslib`, `typescript`                                              | Plataforma                                    | Fica (base)                                                                       |
| `@angular/build`, `@angular/cli`, `@angular/compiler-cli`, `ng-packagr`                  | Compilar e empacotar                          | Fica (base)                                                                       |
| `vitest`, `@vitest/coverage-v8`, `jsdom`                                                 | Testes e cobertura                            | Fica (ferramenta)                                                                 |
| `eslint`, `@eslint/js`, `typescript-eslint`, `angular-eslint`, `@angular-eslint/builder` | Lint                                          | Fica (ferramenta)                                                                 |
| `prettier`, `jscpd`                                                                      | Formatação e detecção de duplicação           | Fica (ferramenta)                                                                 |
| `husky`, `lint-staged`, `@commitlint/*`, `@changesets/cli`, `@types/node`                | Hooks, padrão de commit, versionamento, tipos | Fica (ferramenta)                                                                 |
| `axe-core` (hoje dentro do addon a11y)                                                   | Verificação automática de acessibilidade      | **Decisão D1** (seção 5.2): sai com o Storybook; voltar só nos testes é uma opção |

Consequências práticas:

- **O pacote publicado** (`@brunomonfardini/ui`) continua com **zero dependências de runtime** além do Angular e do `tslib`.
- **Ficam proibidos:** bibliotecas de UI, conjuntos de ícones, fontes externas, CDNs e ferramentas de documentação de terceiros.
- **A regra do repositório:** uma dependência nova só entra se for da camada "Base" ou "Ferramentas", e mesmo assim por PR com justificativa e aprovação do time.

---

## Como fica o repositório no final

```text
projects/
  ui/                          → a biblioteca publicada (já existe)
    tokens/                    → CSS dos tokens (já existe)
    icons/                     → SVGs dos ícones, desenhados pelo time (fase 1)
    src/lib/<componente>/
      <componente>.ts          → componente
      <componente>.html|.css
      <componente>.spec.ts     → testes unitários
      <componente>.docs.ts     → página no catálogo (substitui o .stories.ts)
      examples/                → um exemplo por arquivo, renderizado e exibido como código
  docs/                        → o catálogo: aplicação Angular nossa (fase 2)
    src/app/
      shell/                   → layout, barra lateral, busca, barra de tema
      pages/                   → início, tokens, ícones, página de componente
      playground/              → controles gerados a partir das inputs
scripts/
  gerar-manifesto.ts           → lê o código e gera o manifesto do catálogo
  gerar-icones.ts              → transforma os SVGs em constantes TypeScript
```

`npm run dev` passa a abrir o catálogo próprio (`ng serve docs`), no mesmo endereço de hoje.

---

## Fase 1: Fundamentos próprios

Os tokens já são nossos (`projects/ui/tokens/`). Falta completar a base visual.

### 1.1 Tipografia

Hoje o token `--arg-core-font-sans` começa por `'Inter'`, uma fonte que o produto precisa baixar do Google Fonts ou de um CDN.

Decisão: **usar a fonte do sistema operacional** (`system-ui`). Ela não é um objeto de terceiros que o Argila carrega ou distribui: é a fonte que o próprio aparelho do usuário já tem. Abre instantaneamente, não tem licença a gerenciar e combina com cada sistema.

```css
--arg-core-font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

A identidade visual vem dos tokens (cor, raio, espaçamento, peso e tamanho da fonte), não de uma fonte específica.

### 1.2 Ícones

**Todos os ícones são desenhados pelo time.** Nenhum é copiado ou adaptado de conjuntos de terceiros, mesmo os de licença aberta.

#### Padrão de desenho

| Regra         | Valor                                                                           |
| ------------- | ------------------------------------------------------------------------------- |
| Grade         | 24×24 px, com 2 px de margem de segurança (área útil de 20×20)                  |
| Traço         | 2 px, pontas e junções arredondadas (`stroke-linecap/linejoin="round"`)         |
| Preenchimento | Nenhum (`fill="none"`); a forma vem só do traço                                 |
| Cor           | `stroke="currentColor"`: o ícone herda a cor do texto ao redor                  |
| Arquivo       | `projects/ui/icons/<nome>.svg`, só com `<path>`, `<circle>`, `<rect>`, `<line>` |
| Nome          | Pela **forma**, não pelo uso: `trash` (não `delete`), `arrow-left` (não `back`) |

O nome pela forma importa porque o mesmo desenho serve em contextos diferentes: a lixeira é "excluir" numa tabela e "esvaziar" num carrinho.

#### Primeiro lote (cerca de 40 ícones)

Os que os componentes do inventário (fase 4) e os produtos usam desde o início:

- **Navegação:** `arrow-left`, `arrow-right`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `menu`, `x`, `external-link`
- **Ações:** `plus`, `minus`, `pencil`, `trash`, `copy`, `download`, `upload`, `search`, `filter`, `more-horizontal`, `more-vertical`, `refresh`
- **Estado:** `check`, `check-circle`, `alert-circle`, `alert-triangle`, `info`, `x-circle`, `lock`, `eye`, `eye-off`
- **Domínio:** `calendar`, `clock`, `user`, `users`, `phone`, `mail`, `map-pin`, `dollar`, `image`, `paw` (vet), `scissors` (barbearia), `bell`, `settings`, `log-out`

#### Do SVG ao código

Cada ícone vira uma **constante TypeScript**, em vez de um sprite (um arquivo `.svg` único com todos):

```text
projects/ui/icons/plus.svg               → desenhado pelo time
        ↓  node scripts/gerar-icones.ts   (valida o padrão, limpa atributos, gera o código)
projects/ui/src/lib/icon/icons.generated.ts
        export const argIconPlus: ArgIconDef = { name: 'plus', svg: '<path d="M12 5v14M5 12h14"/>' };
        export type ArgIconName = 'plus' | 'trash' | 'calendar' | …;
```

O script é nosso e não usa otimizadores de terceiros: ele rejeita o SVG que foge do padrão (grade diferente de 24, `fill`, cor fixa) e remove o que não é desenho (metadados do editor, `id`, `class`).

O produto registra só os ícones que usa:

```ts
// app.config.ts do produto
providers: [provideArgIcons([argIconPlus, argIconTrash, argIconCalendar])];
```

```html
<arg-icon name="plus" />
```

| Critério                | Sprite (`sprite.svg`)                               | Constantes TypeScript (escolhido) |
| ----------------------- | --------------------------------------------------- | --------------------------------- |
| Tamanho no produto      | Todos os ícones, sempre                             | Só os ícones registrados          |
| Configuração no produto | Copiar o arquivo para os assets e acertar o caminho | Nenhuma: vem no import            |
| Nome errado             | O ícone some em silêncio                            | Erro de compilação                |
| SSR e offline           | Depende de onde o arquivo está hospedado            | Funciona                          |

#### Regras de uso

- **Tamanho por token:** `--arg-icon-size-sm` (16 px), `--arg-icon-size-md` (20 px), `--arg-icon-size-lg` (24 px). Sem tamanho informado, o ícone acompanha o texto ao redor (`1.25em`).
- **Cor:** sempre herdada (`currentColor`). Dentro de um botão primário fica na cor do texto do botão; num link, na cor da marca. Nunca se define cor no ícone.
- **Acessibilidade:**
  - Ícone ao lado de texto é decorativo e fica oculto para leitores de tela (o padrão).
  - Ícone com significado sozinho recebe `label`: `<arg-icon name="alert-triangle" label="Atenção" />`.
  - Botão só com ícone usa o **Icon Button**, que exige `label`; sem ele, não compila.
- **Dentro dos componentes:** `<button arg-button><arg-icon name="plus" /> Novo agendamento</button>` (o botão já tem espaçamento para isso); na lista, o ícone vai em `arg-list-leading`. Os componentes internos (Select, Date Picker, Alert) usam os mesmos ícones, nunca SVG solto no código.
- **Ícone novo:** desenhado no padrão, revisado no PR como qualquer código, e aparece sozinho na página **Ícones** do catálogo.

### 1.3 Critério de pronto da fase

- [x] Token de fonte sem `Inter`; nenhuma fonte ou ícone carregado de um domínio externo.
- [ ] Primeiro lote de ícones desenhado no padrão e validado pelo `gerar-icones.ts`.
- [x] `arg-icon` e `provideArgIcons` com testes; nome de ícone inválido não compila.

---

## Fase 2: Catálogo próprio

É o substituto do Storybook: uma aplicação Angular dentro do mesmo workspace, que importa os componentes **direto do código-fonte** da biblioteca e se monta a partir de um **manifesto** gerado do próprio código.

### 2.1 Criar a aplicação

```bash
npm run ng -- generate application docs --prefix=doc --style=css --ssr=false
```

No `tsconfig.json` da raiz, aponte o caminho do pacote para o código-fonte, não para o `dist`. Assim o catálogo recarrega na hora quando um componente muda:

```json
"paths": {
  "@brunomonfardini/ui": ["./projects/ui/src/public-api.ts"]
}
```

No `angular.json`, adicione os tokens aos estilos globais do catálogo:

```json
"styles": [
  "projects/ui/tokens/argila.css",
  "projects/ui/tokens/base.css",
  "projects/ui/tokens/themes/example-brand.css",
  "projects/docs/src/styles.css"
]
```

O catálogo **usa os próprios componentes do Argila** na sua interface (lista na barra lateral, botões, spinner). Ele é o primeiro cliente do design system: se algo fica feio ou difícil no catálogo, fica feio ou difícil num produto.

### 2.2 O formato de documentação: `*.docs.ts`

Cada componente ganha um arquivo `<componente>.docs.ts`, que substitui o `.stories.ts`. O tipo fica em `projects/ui/src/docs/doc-page.ts`:

```ts
import { Type } from '@angular/core';

export type DocCategory = 'Fundamentos' | 'Componentes' | 'Padrões';

export interface DocExample {
  /** Título do exemplo na página, ex.: "Variantes". */
  name: string;
  description?: string;
  /** Componente standalone do arquivo em examples/. */
  component: Type<unknown>;
}

export interface DocPage {
  slug: string; // usado na URL: /componentes/button
  title: string;
  category: DocCategory;
  /** Primeiro parágrafo da página: para que serve e quando usar. */
  summary: string;
  /** Componente documentado; habilita o playground e a tabela de propriedades. */
  component?: Type<unknown>;
  /** Elemento hospedeiro, para componentes de atributo: 'button' em button[arg-button]. */
  hostElement?: string;
  /** Texto projetado no playground, ex.: "Salvar". */
  playgroundContent?: string;
  examples: DocExample[];
  /** Regras de uso: faça / não faça. */
  guidelines?: { do: string[]; dont: string[] };
}
```

Exemplo, `button.docs.ts`:

```ts
import { DocPage } from '../../docs/doc-page';
import { ArgButton } from './button';
import { ButtonVariantsExample } from './examples/button-variants.example';
import { ButtonLoadingExample } from './examples/button-loading.example';

export const BUTTON_DOCS: DocPage = {
  slug: 'button',
  title: 'Button',
  category: 'Componentes',
  summary: 'Dispara uma ação. Use uma única variante primária por tela.',
  component: ArgButton,
  hostElement: 'button',
  playgroundContent: 'Salvar',
  examples: [
    { name: 'Variantes', component: ButtonVariantsExample },
    { name: 'Carregando', component: ButtonLoadingExample },
  ],
  guidelines: {
    do: ['Use verbos no rótulo: "Salvar", "Enviar convite"'],
    dont: ['Não use a variante danger para ações reversíveis'],
  },
};
```

Cada exemplo é um componente pequeno, num arquivo próprio. **O mesmo arquivo é renderizado na página e exibido como código**, então o código mostrado nunca fica diferente do que roda:

```ts
// examples/button-variants.example.ts
import { Component } from '@angular/core';
import { ArgButton } from '../button';

@Component({
  selector: 'doc-button-variants-example',
  imports: [ArgButton],
  template: `
    <button arg-button variant="primary">Primário</button>
    <button arg-button variant="secondary">Secundário</button>
    <button arg-button variant="tertiary">Terciário</button>
    <button arg-button variant="danger">Excluir</button>
  `,
})
export class ButtonVariantsExample {}
```

Os arquivos `*.docs.ts` e `examples/` **não entram no pacote publicado**: o `public-api.ts` não os exporta, e o ng-packagr só empacota o que é exportado.

### 2.3 O manifesto: o código é a fonte da verdade

`scripts/gerar-manifesto.ts` roda antes do catálogo (`predev` e `prebuild:docs`) e grava `projects/docs/src/generated/manifest.json`. Ele usa a API do compilador TypeScript (dependência que já temos) para ler o código e extrair:

| Informação                      | De onde vem                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Propriedades de cada componente | Campos inicializados com `input(...)`                                              |
| Tipo de cada propriedade        | O `T` de `InputSignal<T>`; uniões de strings viram opções (`'sm' \| 'md' \| 'lg'`) |
| Valor padrão                    | O primeiro argumento de `input(...)`                                               |
| Descrição                       | O comentário JSDoc acima da propriedade                                            |
| Seletor                         | O `selector` do `@Component`                                                       |
| Código de cada exemplo          | O texto do arquivo em `examples/`                                                  |
| Lista de tokens                 | As linhas `--arg-*: valor;` de `tokens/semantic.css`                               |

Esqueleto do script (Node 24 executa TypeScript direto: `node scripts/gerar-manifesto.ts`):

```ts
import ts from 'typescript';
import { globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const arquivos = globSync('projects/ui/src/lib/**/*.ts', {
  exclude: (f) => /\.(spec|docs|example)\.ts$/.test(f),
});
const program = ts.createProgram(arquivos, { strict: true });
const checker = program.getTypeChecker();

function lerInputs(classe: ts.ClassDeclaration) {
  return classe.members.filter(ts.isPropertyDeclaration).flatMap((prop) => {
    const init = prop.initializer;
    if (!init || !ts.isCallExpression(init) || init.expression.getText() !== 'input') return [];
    const simbolo = checker.getSymbolAtLocation(prop.name)!;
    const tipoSinal = checker.getTypeOfSymbolAtLocation(simbolo, prop);
    const tipoValor = checker.getTypeArguments(tipoSinal as ts.TypeReference)[0];
    return [
      {
        nome: prop.name.getText(),
        tipo: checker.typeToString(tipoValor),
        opcoes: tipoValor.isUnion()
          ? tipoValor.types
              .filter((t) => t.isStringLiteral())
              .map((t) => (t as ts.StringLiteralType).value)
          : undefined,
        padrao: init.arguments[0]?.getText(),
        descricao: ts.displayPartsToString(simbolo.getDocumentationComment(checker)),
      },
    ];
  });
}
// ... percorrer as classes com @Component, ler examples/ e semantic.css, gravar o JSON
```

O manifesto é gerado, nunca editado à mão, e fica no `.gitignore`. Documentação que vem do código não envelhece: mudou a input, mudou a página.

### 2.4 Navegação e rotas

- `projects/docs/src/app/registry.ts` importa todos os `*.docs.ts` em uma lista. O CI confere que todo componente exportado no `public-api.ts` tem uma página (seção 5.3).
- Rotas: `/` (início), `/fundamentos/tokens`, `/fundamentos/icones`, `/:categoria/:slug` (página de componente ou padrão).
- Barra lateral montada a partir do registro, agrupada por categoria, com o `ARG_LIST` do próprio Argila.
- Busca: um campo que filtra a barra lateral por título e resumo. Não precisa de biblioteca.

### 2.5 A página de um componente

Cada página tem, nesta ordem:

1. **Título e resumo** (do `DocPage`).
2. **Playground**: o componente ao vivo, com os controles ao lado (2.6).
3. **Exemplos**: cada um renderizado, com o botão "Ver código" mostrando o texto do arquivo (do manifesto).
4. **Propriedades**: tabela com nome, tipo, padrão e descrição (do manifesto).
5. **Tokens do componente**: as variáveis `--arg-<componente>-*` que podem ser ajustadas por instância.
6. **Faça / Não faça** (do `DocPage`).
7. **Acessibilidade**: teclado, leitor de tela e contraste, escrito pelo time.

Para destacar a sintaxe no bloco de código, um componente `doc-code` simples basta: ele envolve palavras-chave, strings e tags HTML em `<span>` com classes de cor, usando expressões regulares. Não precisa de biblioteca de highlight.

### 2.6 O playground

Os controles são gerados do manifesto, sem configuração por componente:

| Tipo da input                             | Controle                 |
| ----------------------------------------- | ------------------------ |
| União de strings (`'sm' \| 'md' \| 'lg'`) | Grupo de botões de opção |
| `boolean`                                 | Caixa de seleção         |
| `string`                                  | Campo de texto           |
| `number`                                  | Campo numérico           |

O componente é criado dinamicamente com a API pública do Angular. Para componentes de atributo (`button[arg-button]`), o `hostElement` cria o elemento nativo certo:

```ts
import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  createComponent,
  inject,
} from '@angular/core';

export class Playground {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);
  private ref?: ComponentRef<unknown>;

  render(page: DocPage, container: HTMLElement): void {
    const host = document.createElement(page.hostElement ?? 'div');
    container.replaceChildren(host);
    this.ref = createComponent(page.component!, {
      environmentInjector: this.injector,
      hostElement: host,
      projectableNodes: [[document.createTextNode(page.playgroundContent ?? '')]],
    });
    this.appRef.attachView(this.ref.hostView);
  }

  /** Chamado por cada controle quando o valor muda. */
  update(input: string, value: unknown): void {
    this.ref?.setInput(input, value);
  }

  destroy(): void {
    this.ref?.destroy();
  }
}
```

O estado dos controles vai para a URL (`?variant=danger&loading=true`), para dar para mandar o link de uma configuração específica para alguém.

### 2.7 Barra de tema e páginas de fundamentos

- **Barra de tema** no topo do catálogo: Claro/Escuro/Automático e a lista de marcas, aplicadas com o próprio serviço `ArgTheme`. É o mesmo código que os produtos usam.
- **Página Tokens**: gerada do manifesto. Cada token semântico aparece com a amostra (cor, espaço ou raio desenhados com o próprio token) e o valor atual, que muda ao trocar o tema.
- **Página Ícones**: a grade de ícones com busca; clicar copia `<arg-icon name="..." />`.

### 2.8 Scripts

```json
"predev": "node scripts/gerar-manifesto.ts",
"dev": "ng serve docs --open",
"build:docs": "node scripts/gerar-manifesto.ts && ng build docs"
```

Durante o `dev`, o manifesto precisa ser regerado quando um componente muda. Use o modo watch do próprio Node, em um segundo terminal, sem dependência nova:

```bash
node --watch-path=projects/ui/src --watch-path=projects/ui/tokens scripts/gerar-manifesto.ts
```

### 2.9 Critério de pronto da fase

- [ ] `npm run dev` abre o catálogo próprio, com todas as páginas que existem hoje no Storybook.
- [ ] Playground, exemplos com código, tabela de propriedades e barra de tema funcionando.
- [ ] O catálogo usa os componentes do Argila na própria interface.
- [ ] Testes unitários do gerador de manifesto e do playground (são código nosso como qualquer outro).

---

## Fase 3: Migrar do Storybook e removê-lo

Só comece quando a fase 2 estiver na `main`.

1. Para cada `*.stories.ts`, crie o `*.docs.ts` e os arquivos de `examples/` equivalentes. Cada story vira um exemplo.
2. `introducao.mdx` vira a página inicial do catálogo; `foundations.mdx` vira a página Tokens; `patterns/loading.stories.ts` vira um `DocPage` da categoria Padrões.
3. Compare lado a lado (Storybook em 6006, catálogo em 4200) até não faltar nada.
4. Remova o Storybook em um PR só:

   ```bash
   pnpm remove storybook @storybook/angular-vite @storybook/addon-a11y @storybook/addon-docs vite @analogjs/vite-plugin-angular @angular-devkit/architect @angular-devkit/core @angular/animations
   rm -rf projects/ui/.storybook
   rm projects/ui/src/introducao.mdx projects/ui/src/foundations.mdx
   find projects/ui/src -name "*.stories.ts" -delete
   ```

5. No `angular.json`, apague os targets `storybook` e `build-storybook` do projeto `ui`. No `package.json`, troque `build-storybook` por `build:docs`.
6. No CI, troque o passo `pnpm build-storybook` por `pnpm build:docs`, e o artefato `storybook-static` por `dist/docs/browser`.
7. Atualize o README, o guia de comandos e o `padrao-de-pipeline.md`.

Critério de pronto: `grep -ri storybook` no repositório (fora do `CHANGELOG.md`) não encontra nada, e o CI está verde.

---

## Fase 4: Componentes sem bibliotecas de terceiros

### 4.1 Regras

1. **HTML nativo primeiro.** Antes de escrever comportamento em TypeScript, veja se o navegador já faz. Hoje ele faz muito do que antes exigia o Angular CDK:

   | Necessidade                                              | Recurso nativo do navegador                                               |
   | -------------------------------------------------------- | ------------------------------------------------------------------------- |
   | Modal com foco preso e tecla Esc                         | `<dialog>` com `showModal()`                                              |
   | Menu suspenso, tooltip, popover que fecha ao clicar fora | Atributo `popover` e `popovertarget`                                      |
   | Posicionar um popover junto do botão                     | CSS anchor positioning (`anchor-name`, `position-anchor`)                 |
   | Conteúdo expansível                                      | `<details>` e `<summary>`                                                 |
   | Campos de formulário e validação                         | `<input>`, `<select>`, `<textarea>` com `ControlValueAccessor` do Angular |
   | Abas, listas e grades navegáveis por seta                | Sem equivalente nativo: implemente o padrão "roving tabindex" do ARIA APG |

2. **Seletor de atributo sobre o elemento nativo**, quando ele existe (`button[arg-button]`, `input[arg-input]`). O teclado, os formulários e os leitores de tela já funcionam.
3. **Comportamento compartilhado vira utilitário nosso**, testado, em `projects/ui/src/lib/internal/`: navegação por setas (roving tabindex), geração de ids únicos, anúncio para leitor de tela (`aria-live`). Escrito uma vez, usado por todos os componentes (DRY).
4. **Siga o [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/)** para cada padrão (abas, combobox, menu). É a especificação, não uma biblioteca.

### 4.2 Inventário de componentes

**41 componentes**: 4 já existem e 37 são novos, organizados em 6 ondas. Cada onda depende só das anteriores; dentro de uma onda, os componentes são independentes e podem ser feitos em paralelo. Cada componente (ou grupo da mesma linha) é um PR.

**Já existem:** Button, List, Spinner, Skeleton.

#### Onda 1: base de formulários e ícones

| Componente              | Base nativa                        | O que construímos                                               |
| ----------------------- | ---------------------------------- | --------------------------------------------------------------- |
| Icon                    | `<svg>` inline                     | Registro de ícones, tamanhos por token, `label` opcional        |
| Icon Button             | `<button>`                         | Botão só com ícone; `label` obrigatório                         |
| Link                    | `<a>`                              | Estilo, variante de link externo com ícone                      |
| Divider                 | `<hr>`                             | Horizontal e vertical                                           |
| Field                   | `<label>`, `aria-describedby`      | Rótulo, ajuda e erro ligados ao campo por ids                   |
| Input, Textarea         | `<input>`, `<textarea>`            | Estilo, estados, `ControlValueAccessor`                         |
| Checkbox, Radio, Switch | `<input type="checkbox \| radio">` | Estilo, estado indeterminado (checkbox), `ControlValueAccessor` |
| Select                  | `<select>`                         | Estilo e `ControlValueAccessor`                                 |

#### Onda 2: exibição e feedback simples

| Componente         | Base nativa                    | O que construímos                                       |
| ------------------ | ------------------------------ | ------------------------------------------------------- |
| Badge, Tag, Avatar | `<span>`, `<img>`              | Variantes de cor; tag removível; avatar com iniciais    |
| Card               | `<article>`, `<section>`       | Áreas de cabeçalho, conteúdo e ações                    |
| Alert              | `<div role="status \| alert">` | Variantes info, sucesso, aviso e erro, com ícone        |
| Empty State        | `<section>`                    | Ícone, título, texto e ação para telas sem dados        |
| Progress Bar       | `<progress>`                   | Determinado e indeterminado                             |
| Tooltip            | `popover="manual"`             | Abrir no foco e no hover, posicionamento por anchor CSS |

#### Onda 3: camadas (sobre a tela)

| Componente | Base nativa                   | O que construímos                                         |
| ---------- | ----------------------------- | --------------------------------------------------------- |
| Dialog     | `<dialog>`                    | Abrir por serviço, confirmação, devolver o foco ao fechar |
| Drawer     | `<dialog>`                    | Painel lateral; no celular, sobe de baixo                 |
| Popover    | `popover`, anchor positioning | Conteúdo livre junto de um gatilho                        |
| Menu       | `popover` + `role="menu"`     | Navegação por setas e por letra                           |
| Toast      | `popover="manual"`            | Fila, tempo de exibição, `aria-live`                      |

#### Onda 4: navegação

| Componente | Base nativa                   | O que construímos                                      |
| ---------- | ----------------------------- | ------------------------------------------------------ |
| App Shell  | `<header>`, `<nav>`, `<main>` | Cabeçalho com marca do tenant, menu lateral responsivo |
| Tabs       | `role="tablist"`              | Navegação por setas (roving tabindex)                  |
| Breadcrumb | `<nav>`, `<ol>`               | Separadores e item atual (`aria-current`)              |
| Pagination | `<nav>`                       | Páginas, anterior e próxima                            |
| Stepper    | `<ol>`                        | Etapas com estado (feita, atual, pendente)             |

#### Onda 5: domínio dos produtos

| Componente       | Base nativa                   | O que construímos                                                             |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| Currency Input   | `<input inputmode="decimal">` | R$ com centavos; valor numérico em centavos no formulário                     |
| Masked Input     | `<input>`                     | Máscaras de telefone, CPF, CNPJ e CEP, com validação de dígitos               |
| Date Picker      | `<input>` + `<dialog>`        | Calendário mensal navegável por teclado, datas bloqueadas                     |
| Time Slot Picker | `role="radiogroup"`           | Grade de horários livres e ocupados: o centro da agenda de vet e barbearia    |
| File Upload      | `<input type="file">`         | Arrastar e soltar, prévia de imagem, progresso (Supabase Storage)             |
| Combobox         | `<input role="combobox">`     | Busca com sugestões; o mais complexo das ondas iniciais, seguir o APG à risca |

#### Onda 6: dados complexos

| Componente        | Base nativa   | O que construímos                                        |
| ----------------- | ------------- | -------------------------------------------------------- |
| Table             | `<table>`     | Ordenação, seleção de linhas, estado vazio e carregando  |
| Calendar (Agenda) | `role="grid"` | Visão de dia e semana dos agendamentos; o maior da lista |

---

## Fase 5: Qualidade

### 5.1 Testes

As regras do [padrão de pipeline](padrao-de-pipeline.md) valem para o catálogo também: o gerador de manifesto, o playground e cada componente têm testes unitários, com cobertura mínima de 80%.

### 5.2 Acessibilidade

O Storybook fazia a verificação automática com o addon a11y, que usa o **axe-core**, de terceiros. Com a remoção do Storybook, ele sai junto. O plano de base usa só verificações nossas:

1. **Verificações próprias nos testes** (`projects/ui/src/testing/a11y.ts`), chamadas em todo `*.spec.ts`:
   - todo controle interativo tem nome acessível (texto, `aria-label` ou `aria-labelledby`);
   - `aria-*` válidos e com ids que existem na página;
   - nenhum `tabindex` maior que 0;
   - imagens com `alt`; ícones decorativos com `aria-hidden`.
2. **Teste de contraste dos tokens**: lê os pares de cor de `semantic.css` (`primary` / `on-primary`, `text` / `surface`, cada cor de feedback com a sua `on-`), nos temas claro e escuro, e falha abaixo de 4.5:1. Pega o erro mais comum de tema por cliente.
3. **Revisão manual** em todo PR de componente: navegação completa por teclado e teste com leitor de tela (NVDA no Windows, VoiceOver no celular), registrados no checklist do PR.

**Decisão D1 (para o time):** as verificações próprias cobrem as falhas mais comuns, mas não as mais de 90 regras do axe-core. Se o time aceitar uma exceção para uma ferramenta de teste (camada "Ferramentas", fora do catálogo e do pacote), o `axe-core` volta como dependência de desenvolvimento, rodando só dentro dos testes. Sem a exceção, o plano segue como está acima. Os itens 2 e 3 valem nos dois casos.

### 5.3 Garantias no CI

Acrescente ao job `verify`:

- `node scripts/gerar-manifesto.ts --check`: falha se algum componente exportado no `public-api.ts` não tiver `*.docs.ts`, se alguma input não tiver JSDoc, ou se algum exemplo não compilar.
- `pnpm build:docs`: o catálogo precisa compilar.

---

## Fase 6: Publicação do pacote e do catálogo

- **Pacote:** continua igual, pelo workflow `release.yml` com Changesets, no GitHub Packages.
- **Catálogo:** é um site estático (`dist/docs/browser`). Publique no **GitHub Pages** com um workflow que roda a cada merge na `main`:
  1. `pnpm build:docs -- --base-href /Argila/`
  2. Copie `index.html` para `404.html` (as rotas do Angular funcionam ao recarregar a página).
  3. Envie com `actions/upload-pages-artifact` e `actions/deploy-pages`.
- O link do catálogo vai no README do repositório e no README do pacote.

O repositório é privado? Então o GitHub Pages exige um plano pago do GitHub, ou o catálogo pode ir para a Vercel ou o Cloudflare Pages, onde os produtos já estão.

---

## Checklist de um componente pronto

- [ ] Só tokens semânticos e de componente; nenhuma cor, espaço ou raio literal
- [ ] Seletor de atributo sobre o elemento nativo, quando ele existe
- [ ] Teclado completo, conforme o padrão do ARIA APG
- [ ] Funciona em claro, escuro, alto contraste (`forced-colors`) e com `prefers-reduced-motion`
- [ ] Toda input com JSDoc
- [ ] `*.spec.ts` com cobertura de 80% ou mais, incluindo acessibilidade
- [ ] `*.docs.ts` com resumo, pelo menos um exemplo e "faça / não faça"
- [ ] Exportado no `public-api.ts`
- [ ] Changeset `minor`

---

## Ordem e estimativa

A ordem dos PRs, as dependências entre eles, os critérios de aceite e as estimativas estão no [plano de execução](plano-de-execucao.md).
