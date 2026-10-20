# Como contribuir

Obrigado por ajudar o Argila. Este guia resume o caminho de uma mudança até a `main`; os detalhes ficam nos documentos linkados.

## Antes de começar

- **Prepare a máquina e rode o catálogo** seguindo os passos 1 a 3 do [README](README.md#comandos-no-git-bash). Use `pnpm install` e os scripts do `package.json`, nunca `npm install` nem `ng` direto.
- **Ache onde mexer** no [Mapa do projeto](docs/mapa-do-projeto.md) e siga o passo a passo do caso em [Como alterar](docs/como-alterar.md).
- **Bug ou ideia grande?** Abra uma issue antes, para combinar a abordagem. Vulnerabilidade não vai em issue: veja o [SECURITY.md](SECURITY.md).

## O fluxo

1. Crie uma branch a partir da `main` com um dos prefixos `feat/`, `fix/`, `chore/`, `docs/` ou `refactor/`. Commit e push direto na `main` são bloqueados.
2. Faça a mudança com teste unitário ao lado do arquivo (`button.ts` → `button.spec.ts`). Componente novo ou alterado também tem página no catálogo (`*.docs.ts`) e verificação de acessibilidade em cada estado.
3. Registre a mudança com `npm run changeset`. Se o pacote `@brunomonfardini/ui` não mudou (documentação, catálogo, CI), use `npm run changeset -- --empty`.
4. Rode as checagens do CI localmente ([passo 6 do README](README.md#6-verificar-antes-de-abrir-o-pr)) ou, no VS Code, **Terminal → Run Task → Verificar tudo**.
5. Abra o PR e preencha o template: o que muda, como testar e o checklist.

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/pt-br/) em cada commit e no título do PR, com o assunto em minúscula: `feat(button): variante fantasma`.
- **Um commit por feature**, e cada commit compila e passa nos testes sozinho. O merge é por rebase, então os commits entram na `main` como estão.
- Ajuste pedido no review vai para o commit da feature (`git commit --fixup <hash>`), não para um commit "corrige review" no fim.

## Regras de código

- Componentes nunca usam cor, espaçamento ou raio literal: só tokens semânticos (`--arg-color-*`, `--arg-radius-*`).
- TypeScript `strict`, sem `any` e sem `@ts-ignore`; lint sem avisos; formatação pelo Prettier.
- Cobertura mínima de 80% e duplicação máxima de 3%, verificadas no CI.
- Nomes de código em inglês; textos da interface e da documentação em português.

As regras completas, com o motivo de cada uma, estão no [padrão de pipeline](docs/padrao-de-pipeline.md). Um PR está pronto quando cumpre a [definição de pronto](docs/padrao-de-pipeline.md#11-definição-de-pronto).

## Revisão e merge

O PR precisa dos checks `verify` e `pr-checks` verdes, de uma aprovação de outra pessoa e de todas as conversas resolvidas. Quem abriu o PR faz o merge, por rebase.

## Licença

Ao contribuir, você concorda que a sua contribuição seja distribuída sob a [licença MIT](LICENSE) do projeto.
