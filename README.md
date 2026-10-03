# Argila

Design system em Angular compartilhado entre todos os nossos produtos. Componentes acessíveis e temas por cliente via design tokens.

Publicado como `@brunomonfardini/ui`. Documentação de uso para produtos: [projects/ui/README.md](projects/ui/README.md).

Este repositório segue o [padrão de pipeline e qualidade de código](docs/padrao-de-pipeline.md), comum a todos os projetos da empresa: testes unitários obrigatórios, DRY, main protegida e a mesma esteira de CI.

## Requisitos

- Node 24 (ver `.nvmrc`; Angular 22 exige `^22.22.3` ou `>=24.15`)
- pnpm 10 (`corepack enable pnpm`)

## Comandos

| Comando             | O que faz                                                           |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm storybook`    | Documentação e playground em <http://localhost:6006>                |
| `pnpm test`         | Testes unitários (Vitest) com cobertura; falha abaixo de 80%        |
| `pnpm lint`         | ESLint sem avisos, incluindo regras de acessibilidade nos templates |
| `pnpm typecheck`    | Checagem de tipos da biblioteca, dos testes e do Storybook          |
| `pnpm dup:check`    | Detecta código duplicado (jscpd); falha acima de 3%                 |
| `pnpm format:check` | Verifica a formatação (Prettier)                                    |
| `pnpm build`        | Gera o pacote em `dist/ui`                                          |
| `pnpm changeset`    | Registra uma mudança para a próxima versão                          |

O relatório de cobertura em HTML fica em `coverage/` depois de `pnpm test`.

## Estrutura

```text
docs/
  padrao-de-pipeline.md   → regras de pipeline e qualidade de todos os projetos
projects/ui/
  tokens/                 → CSS dos tokens, publicado em @brunomonfardini/ui/tokens/
    primitives.css        → camada 1: valores brutos (--arg-core-*)
    semantic.css          → camada 2: valores por uso (--arg-*), claro/escuro
    base.css              → estilos base opcionais do documento
    themes/               → exemplos de tema de produto
  src/lib/
    button/               → um componente por pasta: .ts, .html, .css, .spec.ts, .stories.ts
    list/                 → lista (ArgList, ArgListItem, ArgListAction)
    skeleton/             → placeholder com shimmer
    spinner/              → indicador de carregamento
    theme/                → ArgTheme: tema e marca em tempo de execução
  src/patterns/           → stories de padrões de uso (componentes combinados)
  .storybook/
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
- Toda story passa no addon de acessibilidade (a11y configurado como `error`).

## Versionamento e publicação

Semver com Changesets. Todo PR que muda o pacote inclui um changeset (`pnpm changeset`); breaking change só em major, com nota de migração.

A publicação é automática pelo workflow `release.yml`, no GitHub Packages:

1. Um merge na `main` com changesets pendentes abre (ou atualiza) o PR `chore: version packages`, com a nova versão e o changelog.
2. O merge desse PR builda e publica `@brunomonfardini/ui`.

O escopo do pacote precisa ser o dono do repositório no GitHub; se o Argila mudar para uma organização, o nome do pacote muda junto.

Configuração única no GitHub:

- Secret `RELEASE_TOKEN`: token com permissão de `contents` e `pull-requests` no Argila. Sem ele o PR de versão é aberto com o `GITHUB_TOKEN`, que não dispara o CI, e o ruleset bloqueia o merge.
- Depois da primeira publicação, na página do pacote (Package settings → Manage Actions access), dê acesso de leitura a cada repositório de produto.
