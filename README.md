# Argila

Design system em Angular compartilhado entre todos os nossos produtos. Componentes acessíveis e temas por cliente via design tokens.

Publicado como `@brunomonfardini/ui`. Documentação de uso para produtos: [projects/ui/README.md](projects/ui/README.md).

Este repositório segue o [padrão de pipeline e qualidade de código](docs/padrao-de-pipeline.md), comum a todos os projetos da empresa: testes unitários obrigatórios, DRY, main protegida e a mesma esteira de CI.

## Comandos no Git Bash

**Todos os comandos deste README são para o Git Bash**, no Windows. Para abrir:

- No VS Code: menu do terminal (seta ao lado do `+`) → **Git Bash**.
- No Explorador de Arquivos: botão direito na pasta `Argila` → **Open Git Bash here**.

Regras do Git Bash:

- Caminhos usam `/` e começam com a letra do disco em minúsculo: `C:\Users` vira `/c/Users`.
- Caminho com espaço vai **entre aspas**: `cd "/c/Users/vieir/OneDrive/dev/publico/03 - completo/Projeto - todos/Argila"`.
- Rode tudo **dentro da pasta `Argila`**. Fora dela, o Angular responde `This command is not available when running the Angular CLI outside a workspace`.
- Instale dependências com `pnpm install`; rode scripts com `npm run <script>`. Não use `npm install`: ele ignora o `pnpm-lock.yaml`.
- Não chame `ng` direto: pode existir um Angular CLI global de outra versão. Use os scripts abaixo.

### 1. Preparar a máquina (uma vez)

Confira as versões. É preciso Node **24** ou mais novo (Angular 22 recusa versões anteriores) e pnpm **10**:

```bash
node -v
pnpm -v
git --version
```

Se o Node for mais antigo que 24, instale a versão LTS e **feche e reabra o Git Bash**:

```bash
winget.exe install OpenJS.NodeJS.LTS
```

Se o `pnpm` não existir (`pnpm: command not found`), instale-o e **feche e reabra o Git Bash**:

```bash
npm install -g pnpm@10
```

### 2. Baixar o projeto (uma vez)

```bash
cd "/c/Users/vieir/OneDrive/dev/publico/03 - completo/Projeto - todos"
git clone https://github.com/BrunoMonfardini/Argila.git
cd Argila
pnpm install
```

O `pnpm install` também instala os hooks do Git (husky).

### 3. Abrir a biblioteca de componentes

```bash
cd "/c/Users/vieir/OneDrive/dev/publico/03 - completo/Projeto - todos/Argila"
npm run dev
```

Abre o catálogo em <http://localhost:4200>, começando pela página **Início**, com links para os fundamentos (tokens e ícones), cada componente e os padrões de uso. Mudanças nos componentes aparecem na hora.

Para parar o servidor: **Ctrl + C** no Git Bash.

Se a porta 4200 estiver ocupada:

```bash
npm run dev -- --port 4201
```

Mudou uma input, um exemplo ou um token e quer ver a tabela de propriedades atualizada sem reiniciar? Num segundo terminal, deixe o manifesto se regerando:

```bash
node --watch-path=projects/ui/src --watch-path=projects/ui/tokens scripts/gerar-manifesto.ts
```

### 4. Começar o dia

```bash
cd "/c/Users/vieir/OneDrive/dev/publico/03 - completo/Projeto - todos/Argila"
git switch main
git pull
pnpm install
```

### 5. Fazer uma mudança e abrir o PR

Commit direto na `main` é bloqueado. Crie uma branch (prefixos: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`):

```bash
git switch -c feat/nome-da-mudanca
```

Depois de alterar o código, registre a mudança para a próxima versão do pacote. O assistente pergunta o tipo (`patch`, `minor`, `major`) e uma descrição:

```bash
npm run changeset
```

Mudança que não afeta o pacote publicado (documentação, catálogo, CI) também precisa de changeset, vazio:

```bash
npm run changeset -- --empty
```

Faça o commit e envie. A mensagem segue Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`):

```bash
git add -A
git commit -m "feat: descreve a mudança"
git push -u origin feat/nome-da-mudanca
```

Abra o PR no navegador:

```bash
start "https://github.com/BrunoMonfardini/Argila/compare/feat/nome-da-mudanca?expand=1"
```

O título do PR também segue Conventional Commits: no merge (squash) ele vira a mensagem do commit na `main`.

### 6. Verificar antes de abrir o PR

Os mesmos passos que o CI roda. Se todos passarem aqui, passam lá:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run dup:check
npm run build
npm run build:docs
npm run changeset -- status --since=origin/main
```

| Comando                  | O que faz                                                           |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run format:check`   | Verifica a formatação (Prettier)                                    |
| `npm run lint`           | ESLint sem avisos, incluindo regras de acessibilidade nos templates |
| `npm run typecheck`      | Checagem de tipos da biblioteca, do catálogo, dos testes e scripts  |
| `npm run test`           | Testes unitários (Vitest) com cobertura; falha abaixo de 80%        |
| `npm run dup:check`      | Detecta código duplicado (jscpd); falha acima de 3%                 |
| `npm run build`          | Gera o pacote em `dist/ui`                                          |
| `npm run dev`            | Abre o catálogo em <http://localhost:4200>                          |
| `npm run build:docs`     | Gera o catálogo estático em `dist/docs/browser`                     |
| `npm run icons`          | Valida os SVGs de `projects/ui/icons` e gera o código dos ícones    |
| `npm run changeset -- …` | Confere se a branch tem changeset quando o pacote mudou             |

Corrigir a formatação de todos os arquivos:

```bash
npm run format
```

Abrir o relatório de cobertura dos testes (depois de `npm run test`):

```bash
start coverage/ui/index.html
```

Recompilar o pacote a cada alteração, para testar num produto local:

```bash
npm run watch
```

Os scripts `version-packages` e `release` são do workflow de publicação. **Não rode localmente.**

### Problemas comuns

| Mensagem                                                                         | Causa                                         | O que fazer                                                            |
| -------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| `This command is not available when running the Angular CLI outside a workspace` | Comando rodado fora da pasta `Argila`         | `cd` para a pasta `Argila` (seção 3) e rode de novo                    |
| `The Angular CLI requires a minimum Node.js version`                             | Node mais antigo que 24                       | `winget.exe install OpenJS.NodeJS.LTS`, feche e reabra o Git Bash      |
| `pnpm: command not found`                                                        | pnpm não instalado                            | `npm install -g pnpm@10`, feche e reabra o Git Bash                    |
| `ERR_PNPM_OUTDATED_LOCKFILE` (no CI)                                             | `package.json` mudou sem atualizar o lockfile | `pnpm install`, depois commit do `pnpm-lock.yaml`                      |
| `Commit direto na main não é permitido`                                          | Commit na branch `main`                       | `git switch -c feat/nome-da-mudanca` e commit de novo                  |
| `subject may not be empty` / `type may not be empty`                             | Mensagem fora do padrão Conventional Commits  | `git commit -m "feat: descreve a mudança"`                             |
| `Some packages have been changed but no changesets were found`                   | Mudança sem changeset                         | `npm run changeset` (ou `npm run changeset -- --empty`), commit e push |
| `Port 4200 is already in use`                                                    | Outro catálogo já está rodando                | Feche o outro (Ctrl + C) ou `npm run dev -- --port 4201`               |

## Estrutura

```text
docs/
  padrao-de-pipeline.md   → regras de pipeline e qualidade de todos os projetos
  design-system-proprio.md, plano-de-execucao.md → plano do design system 100% nosso
projects/docs/            → o catálogo: aplicação Angular nossa (npm run dev)
scripts/                  → geradores de ícones e do manifesto do catálogo, com testes
projects/ui/
  tokens/                 → CSS dos tokens, publicado em @brunomonfardini/ui/tokens/
    primitives.css        → camada 1: valores brutos (--arg-core-*)
    semantic.css          → camada 2: valores por uso (--arg-*), claro/escuro
    base.css              → estilos base opcionais do documento
    themes/               → exemplos de tema de produto
  icons/                  → SVGs dos ícones, desenhados pelo time
  src/lib/
    button/               → um componente por pasta: .ts, .html, .css, .spec.ts, .docs.ts, examples/
    icon/                 → arg-icon e o código gerado dos ícones
    list/                 → lista (ArgList, ArgListItem, ArgListAction)
    skeleton/             → placeholder com shimmer
    spinner/              → indicador de carregamento
    theme/                → ArgTheme: tema e marca em tempo de execução
  src/patterns/           → páginas de padrões de uso (componentes combinados)
  src/docs/doc-page.ts    → formato das páginas do catálogo (não publicado)
```

## Tokens em três camadas

1. **Primitivos** (`--arg-core-clay-600`): paleta e escalas. Nunca usados por componentes.
2. **Semânticos** (`--arg-color-primary`, `--arg-radius-control`): nomeados pelo uso. É o que componentes consomem e o que produtos e tenants sobrescrevem.
3. **Componente** (`--arg-button-bg`): definidos no `:host` de cada componente a partir dos semânticos. Permitem ajuste fino por instância.

Regras:

- Componente nunca usa cor, espaçamento ou raio literal: sempre um token semântico.
- Estados de interação (hover, pressed, subtle) são derivados com `color-mix()`, então um tenant só troca a cor base.
- Claro/escuro usa `light-dark()`: um token, dois valores, sem blocos duplicados.

## Convenções de componente

- Prefixo `arg` nos seletores e `Arg` nas classes (`ArgButton`).
- Quando existe elemento nativo equivalente, o componente é um seletor de atributo sobre ele (`button[arg-button]`), para manter teclado, formulários e leitores de tela.
- Standalone, `OnPush`, `input()` com signals.
- Todo componente tem página no catálogo (`<componente>.docs.ts` e `examples/`), com faça/não faça e notas de acessibilidade.
- Todo `*.spec.ts` de componente verifica a acessibilidade em cada estado, com as verificações próprias de `projects/ui/src/testing/a11y.ts`:

  ```ts
  import { a11yViolations } from '../../testing/a11y';

  expect(a11yViolations(fixture.nativeElement)).toEqual([]);
  ```

  Elas cobrem nome acessível, `aria-*` válidos e com ids existentes, `tabindex` positivo, `alt` em imagens, `svg` sem nome e foco dentro de `aria-hidden`. O catálogo passa pelas mesmas verificações, em cada exemplo e em cada página.

## Versionamento e publicação

Semver com Changesets. Todo PR que muda o pacote inclui um changeset (`pnpm changeset`); breaking change só em major, com nota de migração.

A publicação é automática pelo workflow `release.yml`, no GitHub Packages:

1. Um merge na `main` com changesets pendentes abre (ou atualiza) o PR `chore: version packages`, com a nova versão e o changelog.
2. O merge desse PR builda e publica `@brunomonfardini/ui`.

O escopo do pacote precisa ser o dono do repositório no GitHub; se o Argila mudar para uma organização, o nome do pacote muda junto.

Configuração única no GitHub:

- Secret `RELEASE_TOKEN`: token com permissão de `contents` e `pull-requests` no Argila. Sem ele o PR de versão é aberto com o `GITHUB_TOKEN`, que não dispara o CI, e o ruleset bloqueia o merge.
- Depois da primeira publicação, na página do pacote (Package settings → Manage Actions access), dê acesso de leitura a cada repositório de produto.

## Próximos passos

Para onde o Argila vai: o [design system 100% nosso](docs/design-system-proprio.md) (sem objetos de terceiros, catálogo próprio, 41 componentes) e o [plano de execução](docs/plano-de-execucao.md), PR a PR.
