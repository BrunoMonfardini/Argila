import { DocPage } from '../../docs/doc-page';
import { ArgCurrencyInput } from './currency-input';
import { CurrencyInputPriceExample } from './examples/currency-input-price.example';

export const CURRENCY_INPUT_DOCS: DocPage = {
  slug: 'currency-input',
  title: 'Currency Input',
  category: 'Componentes',
  summary:
    'Campo de valor em reais. Os dígitos entram pela direita, como numa calculadora, e o formulário recebe um inteiro em centavos: R$ 89,90 vira `8990`.',
  component: ArgCurrencyInput,
  // Como Input e Select: um campo solto, sem arg-field, não tem rótulo
  playground: false,
  examples: [{ name: 'Preço', component: CurrencyInputPriceExample }],
  guidelines: {
    do: [
      'Guarde e envie o valor em centavos (inteiro): somas e descontos ficam exatos.',
      'Use dentro de um `arg-field`, com rótulo e, se ajudar, a dica "Digite os números, sem vírgula".',
      'Formate para exibição com a mesma função do campo: `formatCents(8990)` → "R$ 89,90".',
    ],
    dont: [
      'Não converta para reais com `valor / 100` e guarde o resultado: o arredondamento de decimais gera centavos errados.',
      'Não use para quantidades que não são dinheiro.',
    ],
  },
  accessibility: [
    'É um `<input>` nativo de texto com `inputmode="numeric"`: no celular, abre o teclado de números.',
    'O leitor de tela lê o valor formatado ("R$ 89,90") e, dentro do `arg-field`, o rótulo, a dica e o erro.',
    'O cursor fica sempre no fim: Backspace apaga o último dígito.',
    'Colar "R$ 1.250,00" funciona: só os dígitos contam.',
  ],
};
