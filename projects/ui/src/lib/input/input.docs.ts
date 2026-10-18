import { DocPage } from '../../docs/doc-page';
import { InputAnatomyExample } from './examples/input-anatomy.example';
import { InputActionExample } from './examples/input-action.example';
import { InputReactiveExample } from './examples/input-reactive.example';
import { InputSignalsExample } from './examples/input-signals.example';
import { InputStatesExample } from './examples/input-states.example';
import { InputTextareaExample } from './examples/input-textarea.example';
import { ArgInput } from './input';

export const INPUT_DOCS: DocPage = {
  slug: 'input',
  title: 'Input e Textarea',
  category: 'Componentes',
  group: 'Formulário',
  summary:
    'Campos de texto sobre o `<input>` e o `<textarea>` nativos. Use dentro de um `arg-field`, que dá o rótulo, a ajuda e o erro.',
  component: ArgInput,
  playground: false,
  anatomy: {
    example: InputAnatomyExample,
    parts: [
      {
        label: 'Rótulo',
        description: 'Sempre visível, ligado ao campo: o leitor de tela o anuncia no foco.',
        selector: '.arg-field__label',
      },
      {
        label: 'Ajuda',
        description: 'Explica o formato ou o uso antes do erro acontecer.',
        selector: '.arg-field__hint',
      },
      {
        label: 'Campo',
        description: 'Onde se digita; a borda muda no foco e no erro.',
        selector: 'input',
      },
      {
        label: 'Erro',
        description: 'Diz o que fazer para corrigir; ligado ao campo por `aria-describedby`.',
        selector: '.arg-field__error',
      },
    ],
  },
  examples: [
    {
      name: 'Com ação acoplada',
      description:
        'Com `arg-input-group`, o botão de ação (`argInputAction`) encosta no fim do campo, numa peça só.',
      component: InputActionExample,
    },
    {
      name: 'Estados',
      description:
        'Erro vem do `arg-field`; desabilitado e somente leitura são os atributos nativos.',
      component: InputStatesExample,
    },
    {
      name: 'Reactive Forms',
      description: 'Digite e saia do campo vazio para ver o erro.',
      component: InputReactiveExample,
    },
    {
      name: 'Formulário de signals',
      description: 'Com `form()` e `[formField]`, de `@angular/forms/signals`.',
      component: InputSignalsExample,
    },
    {
      name: 'Textarea',
      description: '`<textarea arg-textarea>`: mesmo visual e estados, cresce para baixo.',
      component: InputTextareaExample,
    },
  ],
  guidelines: {
    do: [
      'Sempre dentro de um `arg-field`, com rótulo visível.',
      'Use o `type` certo (`email`, `tel`, `number`) e o `autocomplete`: o celular mostra o teclado adequado e o navegador preenche.',
      'Ajuste o visual com os tokens `--arg-input-*`.',
    ],
    dont: [
      'Não use o placeholder como rótulo nem para informação importante: ele some ao digitar.',
      'Não desabilite um campo para mostrar um dado: use `readonly`, que continua focável e legível.',
    ],
  },
  accessibility: [
    'São controles nativos: teclado, preenchimento automático e leitores de tela funcionam sem nada extra.',
    'Dentro do `arg-field`, recebem o id do rótulo, o `aria-describedby` da ajuda e do erro e o `aria-invalid`.',
    'Com erro, a borda fica na cor de perigo e mais grossa; o foco aparece também ao clicar, para mostrar onde vai a digitação.',
  ],
};
