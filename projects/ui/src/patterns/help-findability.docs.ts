import { DocPage } from '../docs/doc-page';
import { HelpInlineExample, HelpLinkExample } from './examples/help-findability.example';

export const HELP_FINDABILITY_PATTERN_DOCS: DocPage = {
  slug: 'encontrabilidade-de-ajuda',
  title: 'Encontrabilidade de ajuda',
  category: 'Padrões',
  summary: 'Como colocar a ajuda onde a dúvida aparece, e o caminho para a ajuda completa.',
  pattern: {
    problem:
      'Ajuda escondida numa central distante só é achada depois do erro, quando a pessoa já desistiu.',
    solution:
      'A explicação curta fica no ponto da dúvida (texto de ajuda do campo, dica no ícone de interrogação) e o caminho para o suporte fica sempre no mesmo lugar.',
  },
  examples: [
    { name: 'No ponto da dúvida', component: HelpInlineExample },
    { name: 'Caminho para o suporte', component: HelpLinkExample },
  ],
  guidelines: {
    do: [
      'Prefira o texto de ajuda visível do campo; a dica no ícone é complemento.',
      'Escreva a ajuda com as palavras de quem usa, não as do sistema.',
    ],
    dont: ['Não ponha informação obrigatória só no tooltip.'],
  },
  related: ['field', 'input', 'icon-button', 'tooltip', 'link'],
};
