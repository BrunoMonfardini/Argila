# Política de segurança

## Versões com suporte

Correções de segurança saem só na versão mais recente de `@brunomonfardini/ui`. Enquanto o pacote estiver em `0.x`, atualize para a última versão publicada para receber a correção.

| Versão                | Suporte |
| --------------------- | ------- |
| Última versão `0.x`   | Sim     |
| Versões `0.x` antigas | Não     |

## Como reportar uma vulnerabilidade

**Não abra uma issue, PR ou discussão pública.** Reporte em particular pelo GitHub:

1. Abra a aba [Security](https://github.com/BrunoMonfardini/Argila/security) do repositório.
2. Clique em **Report a vulnerability**.
3. Descreva o problema. Ajuda muito incluir:
   - o componente, token, script ou workflow afetado;
   - a versão do pacote (ou o commit);
   - os passos para reproduzir, de preferência com um exemplo mínimo;
   - o impacto que você imagina (ex.: XSS num componente, vazamento de segredo no CI).

O relato fica visível só para quem mantém o repositório. Vamos confirmar o recebimento, investigar e manter você informado pelo próprio relato até a correção sair. Se quiser, você aparece nos créditos do aviso de segurança.

## O que está no escopo

- O pacote `@brunomonfardini/ui`: componentes, diretivas, serviços e o CSS de tema.
- O catálogo publicado em <https://argila-catalogo.vercel.app>.
- Os workflows do GitHub Actions e os scripts de `scripts/`.

Vulnerabilidades em dependências de terceiros devem ser reportadas ao projeto de origem. Se uma delas afeta o Argila de um jeito específico, reporte aqui também.
