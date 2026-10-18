import { DocPage } from '../../docs/doc-page';
import { ArgChoiceGroup } from './choice';
import { ChoiceCheckboxExample } from './examples/choice-checkbox.example';
import { ChoiceRadioExample } from './examples/choice-radio.example';
import { ChoiceSwitchExample } from './examples/choice-switch.example';
import { ChoiceValidationExample } from './examples/choice-validation.example';

export const CHOICE_DOCS: DocPage = {
  slug: 'checkbox-radio-switch',
  title: 'Checkbox, Radio e Switch',
  category: 'Componentes',
  group: 'Seleção',
  summary:
    'Escolhas sobre os controles nativos: `arg-checkbox` (várias opções), `arg-radio` (uma opção) e `arg-switch` (liga/desliga na hora). Agrupe com `arg-choice-group` e rotule cada opção com `label[arg-choice]`; importe `ARG_CHOICE`.',
  component: ArgChoiceGroup,
  playground: false,
  examples: [
    { name: 'Radio', component: ChoiceRadioExample },
    {
      name: 'Checkbox com "todos"',
      description: 'O `indeterminate` mostra que só parte dos itens está marcada.',
      component: ChoiceCheckboxExample,
    },
    { name: 'Switch', component: ChoiceSwitchExample },
    { name: 'Validação', component: ChoiceValidationExample },
  ],
  guidelines: {
    do: [
      'Radio para escolher uma entre poucas opções visíveis (até ~6); para mais, use o Select.',
      'Switch só para ajustes que valem na hora; dentro de um formulário com botão de enviar, use checkbox.',
      'Escreva o rótulo do switch como o que fica ligado: "Lembrete por SMS", não "Desativar lembrete".',
    ],
    dont: [
      'Não use um checkbox sozinho para uma pergunta de sim/não obrigatória sem dizer o que acontece ao marcar.',
      'Não deixe um grupo de radio sem opção marcada quando houver um padrão sensato.',
    ],
  },
  accessibility: [
    'São `<input>` nativos: Espaço marca; num grupo de radio com o mesmo `name`, as setas trocam a opção e o grupo é uma única parada de Tab. O `arg-choice-group` dá o `name` aos radios.',
    'O grupo é um `<fieldset>` com `<legend>`: o leitor de tela lê o título do grupo ao entrar nele. Ajuda e erro ficam no `aria-describedby` do grupo, e o erro é anunciado quando aparece.',
    'O checkbox indeterminado é anunciado como "misto". O switch tem `role="switch"` e é lido como "ligado" ou "desligado".',
    'No modo de alto contraste do sistema, o switch volta a ser um checkbox nativo, para não perder o desenho.',
  ],
};
