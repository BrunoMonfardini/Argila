import { DocPage } from '../../docs/doc-page';
import { FieldBasicExample } from './examples/field-basic.example';
import { FieldValidationExample } from './examples/field-validation.example';
import { ArgField } from './field';

export const FIELD_DOCS: DocPage = {
  slug: 'field',
  title: 'Field',
  category: 'Componentes',
  summary:
    'Rótulo, ajuda e erro de um campo de formulário, ligados ao controle para leitores de tela. O `arg-input` e o `arg-textarea` se ligam sozinhos; num controle nativo, use `argFieldControl`.',
  component: ArgField,
  playground: false,
  examples: [
    {
      name: 'Rótulo e ajuda',
      description:
        'Com `arg-input`, `arg-textarea` e um `select` nativo marcado com `argFieldControl`.',
      component: FieldBasicExample,
    },
    {
      name: 'Validação',
      description:
        'Com Reactive Forms: o erro aparece ao sair do campo ou ao enviar, e é anunciado. Saia do campo vazio para ver.',
      component: FieldValidationExample,
    },
  ],
  guidelines: {
    do: [
      'Escreva o erro dizendo como corrigir: "Use o formato nome@exemplo.com", não "E-mail inválido".',
      'Mostre o erro depois que a pessoa sai do campo ou envia, não a cada tecla.',
      'Use a ajuda para o formato esperado, antes do erro acontecer.',
    ],
    dont: [
      'Não use o placeholder no lugar do rótulo: ele some quando a pessoa digita.',
      'Não marque como obrigatório só com a cor ou só com o asterisco: use `required` no Field e o validador no controle.',
    ],
  },
  accessibility: [
    'O rótulo é um `<label for>` ligado ao controle: clicar nele foca o campo.',
    'A ajuda e o erro entram no `aria-describedby` do controle; com erro, o controle recebe `aria-invalid="true"`.',
    'Quando o erro aparece ou muda, ele é anunciado para leitores de tela sem mover o foco.',
    'O asterisco de obrigatório é só visual; o controle recebe `aria-required="true"`.',
  ],
};
