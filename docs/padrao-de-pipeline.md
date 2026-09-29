# Padrão de pipeline e qualidade de código

Regras obrigatórias para **todos os repositórios** da empresa: o design system (Argila) e cada produto (clínica vet, barbearia e os próximos). Um repositório novo só recebe o primeiro cliente depois de cumprir este documento.

O [Argila](https://github.com/BrunoMonfardini/Argila) é a implementação de referência: na dúvida, copie de lá.

## Sumário

1. [Princípios](#1-princípios)
2. [Fluxo de trabalho no Git](#2-fluxo-de-trabalho-no-git)
3. [Qualidade de código](#3-qualidade-de-código)
4. [Contrato de scripts](#4-contrato-de-scripts)
5. [A esteira de CI](#5-a-esteira-de-ci)
6. [A esteira de CD](#6-a-esteira-de-cd)
7. [Proteção da main](#7-proteção-da-main)
8. [Hooks locais](#8-hooks-locais)
9. [Segredos e segurança](#9-segredos-e-segurança)
10. [Checklist para criar um repositório](#10-checklist-para-criar-um-repositório)
11. [Definição de pronto](#11-definição-de-pronto)
12. [Exceções](#12-exceções)

---

## 1. Princípios

- **A main está sempre pronta para produção.** Nada entra nela sem PR, review e CI verde.
- **O CI roda o mesmo que você roda na sua máquina.** O workflow só chama scripts do `package.json`; nenhuma lógica de build ou teste mora só no YAML.
- **Mesma esteira em todos os repositórios.** Mesmos scripts, mesmos nomes de checks, mesmas regras. Quem conhece um repo conhece todos.
- **Bloqueio automático, não por boa vontade.** Toda regra deste documento que pode ser verificada por máquina é verificada no CI e bloqueia o merge.

---

## 2. Fluxo de trabalho no Git

### Branches

Trunk-based: branches curtas (idealmente menos de 2 dias) criadas a partir da `main`.

| Prefixo     | Uso                                       | Exemplo                            |
| ----------- | ----------------------------------------- | ---------------------------------- |
| `feat/`     | Funcionalidade nova                       | `feat/agenda-do-veterinario`       |
| `fix/`      | Correção de bug                           | `fix/horario-duplicado`            |
| `chore/`    | Manutenção, dependências, configuração    | `chore/atualiza-angular`           |
| `docs/`     | Só documentação                           | `docs/readme-deploy`               |
| `refactor/` | Mudança interna sem alterar comportamento | `refactor/extrai-calculo-de-preco` |

### Commits e título do PR

[Conventional Commits](https://www.conventionalcommits.org/pt-br/), validado pelo commitlint no commit e no título do PR:

```text
feat: permite reagendar consulta
fix(agenda): impede dois atendimentos no mesmo horário
chore(deps): atualiza angular para 22.3
```

O merge é **squash**: o título do PR vira o único commit na `main`, então ele precisa descrever a mudança inteira.

### Pull request

- Um assunto por PR. PR grande (acima de ~400 linhas alteradas, sem contar lockfile e gerados) deve ser quebrado.
- Preencha o template: o que muda, como testar, checklist.
- Mínimo de **1 aprovação** de outra pessoa. O autor não aprova o próprio PR.
- Toda conversa do review precisa estar resolvida antes do merge.
- Quem abriu o PR faz o merge, depois de aprovado e com CI verde.

---

## 3. Qualidade de código

### 3.1 Testes unitários: obrigatórios

**Toda função, método ou componente com lógica tem teste unitário.** Não existe PR que adiciona ou altera lógica sem adicionar ou alterar teste.

| Regra                      | Detalhe                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Onde fica o teste          | Ao lado do arquivo: `preco.ts` → `preco.spec.ts`                                                                       |
| O que conta como lógica    | Condicional, laço, cálculo, transformação de dados, validação, regra de negócio, tratamento de erro                    |
| O que não precisa de teste | Tipos e interfaces, constantes, configuração, código gerado, arquivos só de reexportação (`public-api.ts`, `index.ts`) |
| Bug corrigido              | Começa com um teste que reproduz o bug e falha; a correção faz ele passar                                              |
| Cobertura mínima           | **80% de linhas e de branches**, verificada no CI. Abaixo disso o check `verify` falha                                 |
| Ferramenta                 | Vitest em todos os projetos (Angular via `ng test`, que usa Vitest)                                                    |

Como escrever:

- Um comportamento por teste; o nome descreve o comportamento esperado: `it('recusa agendamento fora do horário da clínica')`.
- Estrutura **Arrange → Act → Assert**, com uma linha em branco entre as partes.
- Teste o comportamento público, não detalhes internos. Refatorar sem mudar comportamento não deve quebrar teste.
- Nada de rede, banco real ou relógio real: use mocks, fakes e datas fixas.
- Teste não depende de outro teste nem da ordem de execução.
- Componentes: teste o que o usuário vê e faz (texto, atributos ARIA, clique), não a estrutura interna do template.

Cobertura alta com testes ruins não serve. No review, verifique **o que** o teste garante, não só se ele existe.

### 3.2 DRY: não repita conhecimento

**Cada regra de negócio, validação, tipo ou valor visual existe em um único lugar.** Se você precisa mudar algo em dois arquivos para uma única mudança de regra, há duplicação.

Onde cada coisa deve morar:

| O que                                                                | Lugar único                                               | Nunca                                                        |
| -------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| Componente visual, cor, espaçamento, tipografia                      | Design system (`@argila/ui` e seus tokens)                | Recriar botão, modal ou input no produto; cor literal no CSS |
| Tipos compartilhados entre front e back                              | `packages/shared`                                         | Declarar a mesma interface em `apps/web` e `apps/api`        |
| Validação de entrada                                                 | Schema zod em `packages/shared`, usado no front e no back | Validar o mesmo campo com regras escritas duas vezes         |
| Regra de negócio                                                     | Uma função pura, testada, chamada por quem precisar       | Copiar o cálculo para outro serviço ou componente            |
| Textos e mensagens repetidas                                         | Um arquivo de constantes por domínio                      | Mesma string espalhada em vários templates                   |
| Configuração de ferramentas (ESLint, Prettier, tsconfig, commitlint) | Mesma configuração em todos os repos                      | Regras diferentes por projeto sem motivo registrado          |
| Passos da esteira                                                    | Scripts do `package.json` (seção 4)                       | Comando de build ou teste escrito só no YAML                 |

Regras práticas:

- Antes de escrever uma função, procure se ela já existe no projeto, no `packages/shared` ou no design system.
- Encontrou o mesmo trecho em dois lugares? Extraia para uma função ou componente e cubra com teste no mesmo PR.
- DRY é sobre **conhecimento**, não sobre texto parecido. Dois trechos iguais que representam regras diferentes (e vão mudar por motivos diferentes) podem continuar separados. Registre o motivo no PR.
- O CI roda o **jscpd** (detector de código duplicado) e falha acima de **3% de duplicação** ou em blocos com mais de 10 linhas e 50 tokens repetidos.

### 3.3 Outras regras de código

- **TypeScript `strict`** em tudo. `any` proibido (use `unknown` e estreite o tipo); `@ts-ignore` proibido, `@ts-expect-error` só com comentário explicando.
- **Lint sem avisos:** `eslint --max-warnings 0`. Aviso que não vale a pena corrigir vira regra desligada na configuração compartilhada, não aviso ignorado.
- **Formatação:** Prettier, nunca discutida no review.
- **Funções pequenas e com um motivo para mudar.** Uma função que precisa de "e" para ser descrita provavelmente são duas.
- **Sem código morto:** nada de código comentado, funções não usadas ou `console.log` esquecido. O histórico do Git guarda o que foi removido.
- **Nomes de código em inglês; textos da interface em português.**
- **Comentários explicam o porquê, não o quê.** Se o código precisa de comentário para explicar o que faz, renomeie ou quebre em funções.
- **Erros tratados na borda:** não engula exceção com `catch` vazio. Logue com `tenant_id` e `request_id` e devolva uma mensagem útil.
- **Front-end:** componentes do design system primeiro; acessibilidade verificada pelo lint de templates e pelo addon de a11y do Storybook.
- **Banco:** toda tabela de negócio tem `tenant_id` e política de RLS; migration nova vem com teste da política.

---

## 4. Contrato de scripts

Todo repositório expõe **exatamente estes scripts** no `package.json` da raiz. A esteira só chama estes nomes, por isso o YAML é igual em todos os projetos.

| Script            | O que faz                                                                   | Obrigatório         |
| ----------------- | --------------------------------------------------------------------------- | ------------------- |
| `format:check`    | `prettier --check .`                                                        | Sim                 |
| `lint`            | ESLint com `--max-warnings 0`                                               | Sim                 |
| `typecheck`       | `tsc --noEmit` em cada projeto (no Angular, o build já cobre)               | Sim                 |
| `test`            | Testes unitários uma vez, sem modo watch, **com cobertura e limite de 80%** | Sim                 |
| `dup:check`       | `jscpd` com o limite da seção 3.2                                           | Sim                 |
| `build`           | Build de produção de tudo que é publicado ou implantado                     | Sim                 |
| `build-storybook` | Build do Storybook                                                          | Só no design system |

Em monorepos (`apps/*`, `packages/*`), o script da raiz roda em todos os pacotes:

```json
{
  "scripts": {
    "format:check": "prettier --check .",
    "lint": "pnpm -r --if-present run lint",
    "typecheck": "pnpm -r --if-present run typecheck",
    "test": "pnpm -r --if-present run test",
    "dup:check": "jscpd",
    "build": "pnpm -r --if-present run build"
  }
}
```

Configuração do jscpd (`.jscpd.json` na raiz):

```json
{
  "threshold": 3,
  "minLines": 10,
  "minTokens": 50,
  "pattern": "**/*.{ts,html,css,scss}",
  "ignore": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.spec.ts",
    "**/*.stories.ts",
    "**/supabase/migrations/**"
  ],
  "reporters": ["console"],
  "exitCode": 1
}
```

Limite de cobertura em projetos Angular (`angular.json`, target `test`; requer `@vitest/coverage-v8`):

```json
"options": {
  "coverage": true,
  "coverageExclude": ["**/*.stories.ts", "**/public-api.ts"],
  "coverageReporters": ["text-summary", "html"],
  "coverageThresholds": { "lines": 80, "branches": 80, "functions": 80, "statements": 80 }
}
```

Limite de cobertura em projetos sem Angular (`vitest.config.ts`):

```ts
coverage: {
  provider: 'v8',
  thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
  exclude: ['**/*.stories.ts', '**/public-api.ts', '**/index.ts', '**/*.config.*'],
}
```

No Angular, o `lint` também recebe `"maxWarnings": 0` nas opções do target `lint` do `angular.json`.

---

## 5. A esteira de CI

### Visão geral

```text
push na branch ──► PR para a main ──► GitHub Actions
                                        ├─ verify     (qualidade e build)
                                        └─ pr-checks  (regras de processo)
                                                │
                              ambos ✅ + 1 aprovação ──► squash merge ──► main ──► CD
```

- **`verify`**: roda em todo PR e em todo push na `main`. Instala do lockfile, formata, linta, checa tipos, testa com cobertura, procura duplicação e faz o build.
- **`pr-checks`**: roda só em PR. Valida o título (Conventional Commits) e, no design system, exige changeset quando o pacote muda.

Os nomes `verify` e `pr-checks` são fixos: o ruleset (seção 7) exige esses dois checks pelo nome.

### Arquivo `.github/workflows/ci.yml`

Igual em todos os repositórios. Só o design system acrescenta os passos marcados.

```yaml
name: CI

on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened, edited]
  push:
    branches: [main]

# Um novo push na mesma branch cancela a execução anterior
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Menor permissão possível para o token do workflow
permissions:
  contents: read

jobs:
  verify:
    name: verify
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6 # versão lida do "packageManager"
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm dup:check
      - run: pnpm build
      # Só no design system:
      # - run: pnpm build-storybook
      # - uses: actions/upload-artifact@v7
      #   if: github.event_name == 'pull_request'
      #   with: { name: storybook, path: storybook-static, retention-days: 7 }

  pr-checks:
    name: pr-checks
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      # O título entra por variável de ambiente, nunca interpolado no comando
      - name: Título do PR segue Conventional Commits
        env:
          PR_TITLE: ${{ github.event.pull_request.title }}
        run: echo "$PR_TITLE" | pnpm exec commitlint
      # Só no design system:
      # - name: Mudança no pacote tem changeset
      #   if: github.actor != 'dependabot[bot]'
      #   run: pnpm changeset status --since=origin/${{ github.base_ref }}
```

### Regras da esteira

- **`--frozen-lockfile` sempre.** Se o CI reclamar do lockfile, rode `pnpm install` localmente e faça commit do `pnpm-lock.yaml`. Nunca troque para `--no-frozen-lockfile`.
- **Versões fixas:** Node pelo `.nvmrc`, pnpm pelo campo `packageManager`. Ninguém instala "a última".
- **Nada de `continue-on-error`** nem step comentado para "destravar" o PR. Check vermelho se corrige, não se desliga.
- **Tempo:** o `verify` deve terminar em menos de 10 minutos. Passou disso, investigue cache e paralelização.
- **Dados externos do evento** (título, corpo, nome da branch) só entram em comandos por `env:`, para evitar injeção de código.

---

## 6. A esteira de CD

### Produtos (Angular na Vercel + Supabase)

| Momento                 | O que acontece                                      | Ambiente                   |
| ----------------------- | --------------------------------------------------- | -------------------------- |
| PR aberto ou atualizado | Vercel cria um preview do front com URL própria     | Preview (banco de staging) |
| Merge na `main`         | Deploy do front e `supabase db push` das migrations | Staging                    |
| Release aprovada        | Mesmo commit de staging promovido para produção     | Produção                   |

- O deploy de produção usa um **Environment do GitHub** chamado `production` com **aprovação manual obrigatória** (Settings → Environments → Required reviewers).
- **Migrations só pela esteira**, nunca à mão no painel do Supabase de produção. A migration roda antes do deploy do front que depende dela.
- Migrations são **compatíveis com a versão anterior do código** (adicione coluna, publique, depois remova a antiga em outro PR), para o deploy não quebrar quem está usando.
- Segredos de cada ambiente (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `VERCEL_TOKEN`) ficam no Environment correspondente, nunca no repositório.

Esqueleto de `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch: # promoção manual para produção

permissions:
  contents: read

jobs:
  staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v7
      - uses: supabase/setup-cli@v3
      - run: supabase link --project-ref "$SUPABASE_PROJECT_REF"
        env:
          SUPABASE_PROJECT_REF: ${{ vars.SUPABASE_PROJECT_REF }}
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
      # Deploy do front: integração Git da Vercel ou `vercel deploy --prebuilt`

  production:
    if: github.event_name == 'workflow_dispatch'
    needs: staging
    runs-on: ubuntu-latest
    environment: production # exige aprovação manual
    steps:
      - run: echo "mesmos passos de staging, com os segredos de produção"
```

### Design system (pacote npm)

Versionamento com **Changesets**:

1. Todo PR que muda o pacote inclui um changeset (`pnpm changeset`). O `pr-checks` cobra.
2. No merge, a automação abre (ou atualiza) um PR `chore: version packages` com a nova versão e o changelog.
3. O merge desse PR publica o pacote.

Breaking change só em versão **major**, com nota de migração no changeset. Os produtos atualizam o design system no seu próprio ritmo, por PR do Dependabot.

---

## 7. Proteção da main

A `main` é protegida por um **ruleset** no GitHub. O arquivo fica versionado em `.github/rulesets/main.json` e é importado pelo dono do repositório em **Settings → Rules → Rulesets → New ruleset → Import a ruleset**, depois que o CI tiver rodado pelo menos uma vez.

| Regra                                      | Efeito                                                 |
| ------------------------------------------ | ------------------------------------------------------ |
| Pull request obrigatório                   | Ninguém faz push direto na `main`, nem administradores |
| 1 aprovação, aprovação cai com novo push   | Código revisado é o código que entra                   |
| Conversas resolvidas                       | Comentário de review não é ignorado                    |
| Checks `verify` e `pr-checks` obrigatórios | CI vermelho bloqueia o merge                           |
| Branch atualizada com a `main`             | O CI roda sobre o código que realmente vai entrar      |
| Só squash, histórico linear                | Um commit por PR, fácil de ler e reverter              |
| Sem force push, sem exclusão               | Histórico da `main` não é reescrito                    |

```json
{
  "name": "main protegida",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true,
        "allowed_merge_methods": ["squash"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [{ "context": "verify" }, { "context": "pr-checks" }]
      }
    }
  ],
  "bypass_actors": []
}
```

Complementos no repositório:

- **Settings → General → Pull Requests:** deixe marcado só "Allow squash merging" e marque "Automatically delete head branches".
- **`.github/dependabot.yml`:** atualização semanal de dependências npm (agrupadas por família) e mensal das actions.
- **`.github/pull_request_template.md`:** seções "O que muda", "Como testar" e o checklist da seção 11.

---

## 8. Hooks locais

Os hooks dão feedback antes do push. Eles **não substituem** o CI, porque podem ser pulados com `--no-verify`. Instalados automaticamente no `pnpm install` pelo script `"prepare": "husky"`.

| Hook         | O que faz                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------- |
| `pre-commit` | Recusa commit na `main`; roda `lint-staged` (ESLint e Prettier só nos arquivos alterados) |
| `commit-msg` | Valida a mensagem com commitlint                                                          |
| `pre-push`   | Recusa push para a `main`                                                                 |

`.husky/pre-commit`:

```sh
branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" = "main" ]; then
  echo "Commit direto na main não é permitido. Crie uma branch: git switch -c feat/minha-mudanca"
  exit 1
fi

lint-staged
```

`.husky/commit-msg`:

```sh
commitlint --edit "$1"
```

`.husky/pre-push`:

```sh
while read -r local_ref local_sha remote_ref remote_sha; do
  if [ "$remote_ref" = "refs/heads/main" ]; then
    echo "Push direto na main não é permitido. Abra um PR a partir de uma branch."
    exit 1
  fi
done
```

`commitlint.config.js`:

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

`lint-staged` no `package.json`:

```json
"lint-staged": {
  "*.{ts,html}": ["eslint --fix --max-warnings 0", "prettier --write"],
  "*.{css,scss,json,md,mdx,yml,yaml,js}": "prettier --write"
}
```

---

## 9. Segredos e segurança

- **Nenhum segredo no repositório**, nem em arquivo de exemplo. Use `.env.example` só com os nomes das variáveis.
- Segredos de CI ficam em **Environments do GitHub** (`staging`, `production`), não em segredos gerais do repositório, para que só o job daquele ambiente os veja.
- `permissions: contents: read` em todo workflow; aumente só no job que precisa e só a permissão necessária.
- **Dependabot** ativo e **Secret scanning com push protection** ligado (Settings → Code security).
- PR de dependência passa pelo mesmo CI. Atualização major é revisada como qualquer mudança de código.
- Chave `service_role` do Supabase só em Edge Functions e na esteira, nunca no front.

---

## 10. Checklist para criar um repositório

Siga na ordem. O primeiro PR do repositório deve entregar todos os itens.

### Base

- [ ] Repositório criado com `main` como branch padrão
- [ ] `.nvmrc` com a versão LTS do Node usada pela empresa
- [ ] `packageManager` no `package.json` com a versão fixa do pnpm
- [ ] `pnpm-workspace.yaml` (monorepo de produto: `apps/*`, `packages/*`)
- [ ] `.gitignore` com `node_modules/` (sem a barra inicial, para cobrir pacotes internos), `dist/`, `coverage/`, `.env`
- [ ] `.gitattributes` com `* text=auto eol=lf`
- [ ] `.editorconfig`, `.prettierrc`, `.prettierignore`

### Qualidade

- [ ] TypeScript com `strict: true`
- [ ] ESLint com a configuração compartilhada e `--max-warnings 0`
- [ ] Vitest com limite de cobertura de 80% (seção 4)
- [ ] `.jscpd.json` com limite de 3% (seção 4)
- [ ] Todos os scripts da seção 4 funcionando localmente

### Esteira

- [ ] `.github/workflows/ci.yml` (seção 5)
- [ ] `.github/workflows/deploy.yml` com Environments `staging` e `production` (seção 6)
- [ ] `.github/dependabot.yml`
- [ ] `.github/pull_request_template.md`
- [ ] `.github/rulesets/main.json`
- [ ] Husky, commitlint e lint-staged (seção 8)

### No GitHub, depois do primeiro CI verde

- [ ] Ruleset importado e ativo
- [ ] Só squash merge; exclusão automática de branches
- [ ] Environments criados, com aprovação manual em `production`
- [ ] Segredos cadastrados nos Environments
- [ ] Secret scanning e push protection ligados

### Validação final

- [ ] Tentar um push direto na `main` e confirmar que foi recusado
- [ ] Abrir um PR com um teste quebrado e confirmar que o merge fica bloqueado

---

## 11. Definição de pronto

Um PR só pode ser aprovado quando:

- [ ] Toda lógica nova ou alterada tem teste unitário, e o teste falharia sem a mudança
- [ ] Nenhuma regra, tipo, validação ou estilo foi duplicado; o que já existia foi reaproveitado
- [ ] Componentes visuais vêm do design system; nenhuma cor, espaçamento ou raio literal
- [ ] `verify` e `pr-checks` verdes
- [ ] Título do PR em Conventional Commits, descrevendo a mudança inteira
- [ ] Migrations de banco (se houver) compatíveis com a versão anterior e com política de RLS
- [ ] Sem segredo, `console.log`, código comentado ou `TODO` sem issue vinculada
- [ ] Documentação atualizada quando a mudança altera como alguém usa o projeto (README, Storybook, changeset)

---

## 12. Exceções

Qualquer desvio deste documento (desligar uma regra de lint, baixar o limite de cobertura de um pacote, excluir um arquivo do jscpd) precisa:

1. Estar escrito no próprio código ou configuração, com um comentário dizendo **por quê**.
2. Ser aprovado no PR por alguém além do autor.
3. Ter uma issue para ser revisto, quando for temporário.

Mudanças neste documento seguem o mesmo fluxo: PR, discussão e aprovação do time.
