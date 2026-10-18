import { DocPage } from '../docs/doc-page';
import { DataEntryChoiceExample, DataEntryFormExample } from './examples/data-entry.example';

export const DATA_ENTRY_PATTERN_DOCS: DocPage = {
  slug: 'entrada-de-dados',
  title: 'Data entry',
  category: 'Padrões',
  summary:
    'Como pedir dados: formulários curtos, rótulos visíveis e o controle certo para cada resposta.',
  pattern: {
    problem:
      'Formulários longos, com rótulo dentro do campo e controles trocados, cansam e geram erro.',
    solution:
      'Peça só o necessário, um campo por linha, com rótulo sempre visível e ajuda antes do erro. Escolha o controle pela resposta: texto, lista para muitas opções, rádio para poucas.',
  },
  examples: [
    { name: 'Cadastro curto', component: DataEntryFormExample },
    { name: 'Poucas opções', component: DataEntryChoiceExample },
  ],
  guidelines: {
    do: [
      'Marque o obrigatório (`required`) ou o opcional, o que for minoria.',
      'Use o `type` certo (`email`, `tel`, `date`): o teclado do celular acompanha.',
    ],
    dont: [
      'Não use o placeholder como rótulo: ele some ao digitar.',
      'Não divida em colunas o que se lê em sequência.',
    ],
  },
  related: ['field', 'input', 'select', 'choice', 'button'],
};
