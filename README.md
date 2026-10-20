# Argila

Design system em Angular compartilhado entre todos os nossos produtos. Componentes acessíveis e temas por cliente via design tokens.

Publicado como `@brunomonfardini/ui`. Documentação de uso para produtos: [projects/ui/README.md](projects/ui/README.md).

**Catálogo publicado:** <https://argila-catalogo.vercel.app>, atualizado a cada merge na `main` (veja [Catálogo publicado](#catálogo-publicado)).

Este repositório segue o [padrão de pipeline e qualidade de código](docs/padrao-de-pipeline.md), comum a todos os projetos da empresa: testes unitários obrigatórios, DRY, main protegida e a mesma esteira de CI.

## Por onde começar

| Quero…                                                       | Leia                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Rodar o projeto pela primeira vez                            | [Comandos no Git Bash](#comandos-no-git-bash), passos 1 a 3                  |
| Ver os componentes funcionando                               | `npm run dev`, ou o [catálogo publicado](https://argila-catalogo.vercel.app) |
| Saber onde fica um componente, um design system ou um token  | [Mapa do projeto](docs/mapa-do-projeto.md)                                   |
| Mudar um componente, um token, uma paleta ou criar algo novo | [Como alterar](docs/como-alterar.md), com o passo a passo de cada caso       |
| Usar o Argila num produto                                    | [projects/ui/README.md](projects/ui/README.md)                               |
| Configurar o VS Code                                         | [VS Code](#vs-code)                                                          |
| Ver toda a documentação                                      | [docs/README.md](docs/README.md)                                             |

**Em resumo:** a biblioteca fica em `projects/ui` (um componente por pasta em `src/lib/`, o CSS de tema em `tokens/`); o catálogo, em `projects/docs`. Sete design systems (Argila, CODA, Transparente, Windows XP, Neo-brutalista, Punk e o Molde, interno) mudam a aparência dos mesmos componentes, escolhidos por `data-arg-style` no `<html>`.

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

Abre o catálogo em <http://localhost:4200>. Mudanças nos componentes aparecem na hora.

- **À esquerda**, a barra de ícones: Começo, Acessibilidade, Design systems, Fundação, Componentes, Padrões, Templates, Ferramentas e Ajuda. Cada ícone abre um painel com as páginas da seção e uma busca em todo o catálogo.
- **No topo**, a barra de tema: design system, paleta, cores, modo, opacidade e segmento. O catálogo inteiro acompanha, e a escolha fica no endereço (dá para mandar o link).
- **Em cada componente**, as abas Visão geral (playground, anatomia e exemplos com código), Regras de uso, Código (propriedades e tokens) e Acessibilidade.

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

Cada commit e o título do PR seguem Conventional Commits. O merge é por rebase: os commits entram na `main` como estão, então faça um commit por feature (veja o [padrão de pipeline](docs/padrao-de-pipeline.md#commits-e-título-do-pr)).

### 6. Verificar antes de abrir o PR

No VS Code, **Terminal → Run Task → Verificar tudo** roda as checagens abaixo em ordem. No terminal:

Os mesmos passos que o CI roda. Se todos passarem aqui, passam lá:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run dup:check
npm run arch:check
npm run build
npm run build:docs
npm run manifest:check
npm run changeset -- status --since=origin/main
```

| Comando                  | O que faz                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `npm run format:check`   | Verifica a formatação (Prettier)                                                                     |
| `npm run lint`           | ESLint sem avisos, incluindo regras de acessibilidade nos templates                                  |
| `npm run typecheck`      | Checagem de tipos da biblioteca, do catálogo, dos testes e scripts                                   |
| `npm run test`           | Testes unitários (Jest) da biblioteca, do catálogo e dos scripts, com cobertura; falha abaixo de 80% |
| `npm run test:watch`     | Testes em modo watch, só o que mudou                                                                 |
| `npm run test:ui`        | Só os testes da biblioteca (também `test:docs` e `test:scripts`)                                     |
| `npm run test:report`    | Resumo do último `test`: totais, cobertura por projeto e os 10 testes mais lentos                    |
| `npm run dup:check`      | Detecta código duplicado (jscpd); falha acima de 3%                                                  |
| `npm run arch:check`     | Regras de dependência entre as camadas (dependency-cruiser)                                          |
| `npm run build`          | Gera o pacote em `dist/ui`                                                                           |
| `npm run dev`            | Abre o catálogo em <http://localhost:4200>                                                           |
| `npm run build:docs`     | Gera o catálogo estático em `dist/docs/browser`                                                      |
| `npm run icons`          | Valida os SVGs de `projects/ui/icons` e gera o código dos ícones                                     |
| `npm run manifest:check` | Confere que todo componente exportado tem página e JSDoc nas inputs                                  |
| `npm run changeset -- …` | Confere se a branch tem changeset quando o pacote mudou                                              |

**Mudou token, estilo, paleta ou o visual de um componente?** Rode também o checkup visual,
com o catálogo aberto (`npm run dev`) num segundo terminal. Ele não roda no CI porque precisa
do Chrome:

```bash
npm run checkup
```

Percorre cada página do catálogo em cada estilo × paleta × modo, escolhendo o tema pela barra do
topo como uma pessoa faria, e procura erros no console, rolagem horizontal, falhas na barra de
tema e texto com pouco contraste. Gera `checkup/relatorio.html` com os problemas e as capturas
lado a lado (páginas nas linhas, combinações nas colunas). O ciclo completo leva uns 40 minutos;
para olhar só uma parte:

```bash
npm run checkup -- --estilos coda,transparente --paletas nativa --paginas date-picker,dialog
```

Outro endereço (ex.: porta 4201): `--url http://localhost:4201`. Se o Chrome não for achado,
informe o caminho em `CHROME_PATH`.

Corrigir a formatação de todos os arquivos:

```bash
npm run format
```

Abrir o relatório de cobertura dos testes (depois de `npm run test`):

```bash
start coverage/index.html
```

O `npm run test` também gera `reports/junit.xml`. No CI, o resumo dos testes aparece em cada PR, com a cobertura comparada à da `main`: queda de mais de 0,5 ponto em algum projeto falha o `verify`, e teste acima de 2 s gera aviso.

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

## VS Code

Abra a pasta `Argila` no VS Code (**File → Open Folder**). A pasta `.vscode/` do projeto já traz:

- **Extensões recomendadas:** ao abrir, o VS Code oferece instalar todas (ou em Extensões, filtro `@recommended`):
  - Angular Language Service;
  - ESLint, Prettier e EditorConfig;
  - Jest;
  - autocompletar dos tokens `--arg-*` no CSS;
  - erros do TypeScript legíveis;
  - GitHub (PRs e Actions).
- **Formatação ao salvar**, com o Prettier e as correções do ESLint, iguais às do CI.
- **Componentes agrupados no explorador:** `button.ts` aparece como um item só, com `button.html`, `button.css`, `button.spec.ts` e `button.docs.ts` dentro dele.
- **Arquivos gerados só para leitura** (`*.generated.ts`, `tokens/colors.css`): mude a fonte e rode o gerador.
- **Tarefas** (Terminal → Run Task):

  | Tarefa                       | O que faz                                                    |
  | ---------------------------- | ------------------------------------------------------------ |
  | Catálogo                     | `npm run dev` (também com Ctrl + Shift + B)                  |
  | Manifesto em modo watch      | Regera a tabela de propriedades e os exemplos a cada mudança |
  | Testes                       | `npm run test`                                               |
  | Testes do arquivo aberto     | Só os testes ligados ao arquivo do editor                    |
  | Verificar tudo               | As checagens do CI, em ordem                                 |
  | Checkup visual de uma página | O checkup só da página que você digitar                      |
  | Gerar ícones, Gerar cores    | Os geradores                                                 |

- **Depuração** (Run and Debug, F5):
  - **Catálogo no Chrome** (ou no Edge): sobe o catálogo e abre o navegador, com pontos de parada no TypeScript;
  - **Testes do arquivo aberto**: roda o Jest com o depurador.

## Estrutura

O [Mapa do projeto](docs/mapa-do-projeto.md) mostra onde fica cada coisa, com uma tabela de todos os componentes (pasta, uso, página no catálogo e design systems com pele própria). Em resumo:

```text
projects/ui/            → a biblioteca publicada (@brunomonfardini/ui)
  src/lib/<componente>/ → um componente por pasta: .ts, .css, .spec.ts, .docs.ts e examples/
  src/lib/design-systems/ → manifesto de cada design system, paletas, cores e exclusivos
  src/lib/theme/        → ArgTheme e provideArgila: tema em tempo de execução
  src/patterns/, src/templates/, src/docs/ → páginas do catálogo (não publicadas)
  tokens/               → o CSS de tema: tokens, design systems e paletas
  icons/                → os SVGs dos ícones, desenhados pelo time
projects/docs/          → o catálogo (npm run dev)
scripts/                → geradores (manifesto, ícones, cores), checkup visual e testes de regras
docs/                   → guias (índice em docs/README.md)
```

## Tokens em três camadas

1. **Primitivos** (`--arg-core-clay-600`): paleta e escalas. Nunca usados por componentes.
2. **Semânticos** (`--arg-color-primary`, `--arg-radius-control`): nomeados pelo uso. É o que componentes consomem e o que produtos e tenants sobrescrevem.
3. **Componente** (`--arg-button-bg`): definidos no `:host` de cada componente a partir dos semânticos. Permitem ajuste fino por instância.

Regras:

- Componente nunca usa cor, espaçamento ou raio literal: sempre um token semântico.
- Estados de interação (hover, pressed, subtle) são derivados com `color-mix()`, então um tenant só troca a cor base.
- Claro/escuro usa `light-dark()`: um token, dois valores, sem blocos duplicados.
- O contraste é testado: `npm run test` calcula cada par de cores que aparece junto (texto sobre superfície, `on-primary` sobre `primary` e seus estados, cores de feedback) em cada design system × paleta × modo. Abaixo de 4,5:1 para texto, ou de 3:1 para o anel de foco, o teste falha e diz qual par; a paleta Alto contraste precisa de 7:1. Os pares ficam em `scripts/lib/pares.ts`.

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

## Catálogo publicado

O workflow `catalogo.yml` gera o catálogo (`pnpm build:docs`) a cada merge na `main` e o publica na Vercel em <https://argila-catalogo.vercel.app>. A Vercel só recebe os arquivos prontos, sem compilar nada. O `projects/docs/public/vercel.json` faz qualquer rota (ex.: `/componentes/agenda`) abrir o catálogo, então recarregar a página ou abrir um link direto funciona.

Configuração única (até lá, o workflow só avisa que não publicou):

1. Na Vercel, crie um projeto vazio chamado `argila-catalogo`. Pode ser em **Add New → Project**, sem importar o repositório, ou rodando `npx vercel@60.1.3 link` numa pasta vazia. Em **Settings → Build and Deployment**, deixe o Framework Preset como **Other** e o Build Command vazio.
2. Em **Account Settings → Tokens**, crie um token só para este uso.
3. No GitHub, em **Settings → Secrets and variables → Actions** do Argila, crie três secrets:
   - `VERCEL_TOKEN`: o token do passo 2;
   - `VERCEL_ORG_ID`: o Team ID, em **Team Settings → General** (ou o ID da sua conta pessoal);
   - `VERCEL_PROJECT_ID`: o Project ID, em **Project Settings → General**.
4. Rode o workflow uma vez em **Actions → Catálogo → Run workflow**, ou faça um merge na `main`.

## Documentação

O índice de todos os guias está em [docs/README.md](docs/README.md).
