# Argila

Design system em Angular compartilhado entre todos os nossos produtos. Componentes acessíveis e temas por cliente via design tokens.

Publicado como `@argila/ui`. Documentação de uso para produtos: [projects/ui/README.md](projects/ui/README.md).

## Requisitos

- Node 24 (ver `.nvmrc`; Angular 22 exige `^22.22.3` ou `>=24.15`)
- pnpm 10 (`corepack enable pnpm`)

## Comandos

| Comando          | O que faz                                                |
| ---------------- | -------------------------------------------------------- |
| `pnpm storybook` | Documentação e playground em http://localhost:6006       |
| `pnpm test`      | Testes unitários (Vitest)                                |
| `pnpm lint`      | ESLint, incluindo regras de acessibilidade nos templates |
| `pnpm build`     | Gera o pacote em `dist/ui`                               |
| `pnpm changeset` | Registra uma mudança para a próxima versão               |

## Estrutura

```
projects/ui/
  tokens/                 → CSS dos tokens, publicado em @argila/ui/tokens/
    primitives.css        → camada 1: valores brutos (--arg-core-*)
    semantic.css          → camada 2: valores por uso (--arg-*), claro/escuro
    base.css              → estilos base opcionais do documento
    themes/               → exemplos de tema de produto
  src/lib/
    button/               → um componente por pasta: .ts, .html, .css, .spec.ts, .stories.ts
    theme/                → ArgTheme: tema e marca em tempo de execução
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

## Versionamento

Semver com Changesets. Todo PR que muda o pacote inclui um changeset (`pnpm changeset`); breaking change só em major, com nota de migração.
