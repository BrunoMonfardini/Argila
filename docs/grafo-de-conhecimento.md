# Grafo de conhecimento

O projeto tem um grafo de conhecimento gerado pelo plugin [Understand Anything](https://github.com/Egonex-AI/Understand-Anything) do Claude Code. Ele mostra cada arquivo, função e classe, como eles se ligam, as camadas da arquitetura e um tour guiado pelo código, com os textos em português.

O grafo fica versionado em `.ua/knowledge-graph.json`, e o plugin já vem ativado em `.claude/settings.json`.

## Instalar o plugin (uma vez)

1. Abra **a pasta do projeto** no VS Code, e não a pasta acima dela: o Claude Code só lê o `.claude/settings.json` da pasta aberta.
2. Abra uma conversa nova no Claude Code e aceite o aviso para confiar no marketplace `understand-anything` e instalar o plugin.
3. Se o aviso não aparecer, digite no chat:

   ```
   /plugin marketplace add Egonex-AI/Understand-Anything
   /plugin install understand-anything@understand-anything
   ```

   Depois abra uma conversa nova, porque o plugin só carrega quando a conversa começa.

## Ver o grafo

No chat do Claude Code:

```
/understand-dashboard
```

O painel abre no navegador. Clique num nó para ver o resumo e as ligações dele, troque para a visão de camadas ou siga o tour guiado.

Sem o Claude Code, no Git Bash, na pasta do projeto (precisa de Node 18 ou mais novo):

```bash
npx --yes https://github.com/Egonex-AI/Understand-Anything/releases/latest/download/understand-anything-viewer.tgz .
```

O terminal mostra uma linha `🔑 Dashboard URL: http://127.0.0.1:<porta>?token=...`. Abra o link completo, com o `?token=`; sem ele, o painel pede o código de acesso. `Ctrl+C` encerra.

## Perguntar sobre o código

| Comando                         | Faz                                                       |
| ------------------------------- | --------------------------------------------------------- |
| `/understand-chat <pergunta>`   | Responde usando o grafo, por exemplo "como funciona o X?" |
| `/understand-explain <arquivo>` | Explica um arquivo e o que depende dele                   |
| `/understand-onboard`           | Monta um guia de entrada para quem chega no projeto       |
| `/understand-diff`              | Mostra o que as mudanças da branch atual afetam no grafo  |

## Atualizar o grafo

Depois de mudar o código, rode `/understand` no chat. A partir da segunda vez ele só reanalisa os arquivos que mudaram desde o último commit analisado (o `gitCommitHash` em `.ua/meta.json`). Faça o commit do `.ua/` atualizado junto com a mudança ou num PR `chore:` separado.

- `/understand --full` refaz a análise do zero. Num projeto grande isso gasta bastante token.
- `/understand --auto-update` instala um hook de post-commit que atualiza o grafo a cada commit.

## O que fica no git

| Caminho                                          | No git? | Para quê                                                 |
| ------------------------------------------------ | ------- | -------------------------------------------------------- |
| `.ua/knowledge-graph.json`                       | Sim     | O grafo que o painel e os comandos leem                  |
| `.ua/meta.json`                                  | Sim     | O commit analisado por último                            |
| `.ua/fingerprints.json`                          | Sim     | A base das atualizações incrementais                     |
| `.ua/config.json`                                | Sim     | O idioma dos textos (`pt-BR`)                            |
| `.ua/.understandignore`                          | Sim     | Arquivos que ficam fora da análise, no formato gitignore |
| `.ua/intermediate/`, `.ua/tmp/`, `.ua/.trash-*/` | Não     | Arquivos temporários do plugin                           |

O `.ua` fica fora do Prettier (`.prettierignore`), porque é gerado.

## Problemas comuns

- **Os comandos `/understand-*` não aparecem:** a conversa começou antes de o plugin ser instalado, ou a pasta aberta no VS Code não é a do projeto. Abra a pasta certa e comece uma conversa nova.
- **O painel pede "Access Token":** falta o `?token=` no link. Copie a linha `Dashboard URL` inteira do terminal.
- **O painel mostra arquivos que já não existem:** o grafo está desatualizado. Rode `/understand`.
