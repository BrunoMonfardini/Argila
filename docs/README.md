# Documentação do Argila

Os guias do dia a dia vêm primeiro; depois, as especificações e os planos que levaram o Argila até aqui.

## Guias do dia a dia

| Documento                                        | Para quê                                                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Mapa do projeto](mapa-do-projeto.md)            | Onde fica cada coisa: todos os componentes (pasta, uso, página no catálogo, peles), os design systems, os tokens, o catálogo e os scripts                      |
| [Como alterar](como-alterar.md)                  | Passo a passo: mudar aparência ou comportamento, criar exemplo, token, paleta, ícone, componente, design system ou página                                      |
| [Uso num produto](../projects/ui/README.md)      | Instalar o pacote, importar os tokens, escolher design system, paleta, cores e segmento                                                                        |
| [Padrão de pipeline](padrao-de-pipeline.md)      | Regras comuns a todos os projetos da empresa: testes, CI, commits, PRs e merge. O "Checklist para criar um repositório" é um modelo para cada repositório novo |
| [Validação visual dos temas](validacao-temas.md) | Roteiro para conferir à mão, no catálogo, a barra de tema e os componentes em cada design system                                                               |
| [Referências](referencias/README.md)             | As imagens que cada design system segue (só para o time; não vão para o catálogo publicado)                                                                    |

## Especificações

| Documento                                                                 | O que define                                                                                                                                                               | Situação |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [Design systems, paletas e catálogo](plano-estilos-paletas-e-catalogo.md) | Os sete design systems e a ficha de cada um, as paletas, as cores de marca, os segmentos, o catálogo, a arquitetura e os testes com Jest                                   | Vigente  |
| [Design system 100% nosso](design-system-proprio.md)                      | Ícones próprios, catálogo próprio no lugar do Storybook, acessibilidade sem bibliotecas de terceiros. O "Checklist de um componente pronto" vale para todo componente novo | Vigente  |

## Planos de execução

Cada plano lista os PRs, na ordem. Os dois estão concluídos no código; o que falta depende do time.

| Plano                                                                                  | Situação  | O que falta                                                                                           |
| -------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| [Plano de execução dos design systems](plano-de-execucao-design-systems.md) (E0 a E12) | Concluído | Anexar as capturas lado a lado com as referências (NB-05, PK-05, CD-03) e a conferência visual manual |
| [Plano de execução do design system próprio](plano-de-execucao.md) (M0 a M6)           | Concluído | Responder as decisões D1 a D4 (OPS-02); por enquanto vale a opção padrão de cada uma                  |
