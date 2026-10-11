import { DocPage } from '../../docs/doc-page';
import { SelectGroupsExample } from './examples/select-groups.example';
import { SelectReactiveExample } from './examples/select-reactive.example';
import { ArgSelect } from './select';

export const SELECT_DOCS: DocPage = {
  slug: 'select',
  title: 'Select',
  category: 'Componentes',
  summary:
    'Escolha de uma opção numa lista, sobre o `<select>` nativo: a lista aberta é a do sistema, o que no celular vira o seletor nativo. Use dentro de um `arg-field`.',
  component: ArgSelect,
  playground: false,
  examples: [
    {
      name: 'Reactive Forms',
      description: 'Envie sem escolher para ver o erro.',
      component: SelectReactiveExample,
    },
    {
      name: 'Grupos e desabilitado',
      description: '`<optgroup>` separa as opções por tipo.',
      component: SelectGroupsExample,
    },
  ],
  guidelines: {
    do: [
      'Use quando há muitas opções (mais de ~6) ou pouco espaço; com poucas opções, radios mostram tudo de uma vez.',
      'Quando não há escolha padrão, comece com uma opção vazia e desabilitada que diga o que escolher.',
      'Ordene as opções de um jeito previsível: alfabética, por frequência ou na ordem natural (horários, tamanhos).',
    ],
    dont: [
      'Não use para listas que pedem busca, como cidades ou clientes: isso é o Combobox.',
      'Não use para ações (Editar, Excluir): isso é um Menu.',
    ],
  },
  accessibility: [
    'É um `<select>` nativo: abre com Espaço ou Alt+Seta, as setas trocam a opção e digitar letras pula para a opção.',
    'Dentro do `arg-field`, recebe o id do rótulo, a ajuda e o erro no `aria-describedby` e o `aria-invalid`.',
    'A seta é desenhada em CSS; no modo de alto contraste do sistema, volta a ser a seta nativa.',
  ],
};
