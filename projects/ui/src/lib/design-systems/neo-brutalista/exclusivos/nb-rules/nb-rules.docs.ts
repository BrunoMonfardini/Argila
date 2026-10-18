import { DocPage } from '../../../../../docs/doc-page';
import { NbRulesUsageExample } from './examples/nb-rules-usage.example';
import { ArgNbRules } from './nb-rules';

export const NB_RULES_DOCS: DocPage = {
  slug: 'nb-rules',
  title: 'Caixa de regras (Neo-brutalista)',
  category: 'Componentes',
  group: 'Exclusivos',
  designSystem: 'neo-brutalista',
  summary:
    'Exclusivo do Neo-brutalista: caixa de contorno grosso com regras de uso curtas, como o "Usage rules" da referência.',
  component: ArgNbRules,
  playground: false,
  examples: [{ name: 'Regras de uso', component: NbRulesUsageExample }],
  guidelines: {
    do: [
      'Use frases curtas, uma regra por item, numa lista (`<ul>`).',
      'Dê um título claro no `label`: ele é o nome da caixa para o leitor de tela.',
    ],
    dont: ['Não use para avisos de sistema: isso é o Alert.'],
  },
  accessibility: [
    'É um `<aside>` com nome (`aria-labelledby` aponta para o título visível).',
    'As regras ficam numa lista, e o leitor de tela anuncia quantos itens há.',
  ],
};
