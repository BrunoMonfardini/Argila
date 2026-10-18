import { DocPage } from '../../docs/doc-page';
import { ArgCombobox } from './combobox';
import { ComboboxSearchExample } from './examples/combobox-search.example';

export const COMBOBOX_DOCS: DocPage = {
  slug: 'combobox',
  title: 'Combobox',
  category: 'Componentes',
  group: 'Formulário',
  summary:
    'Campo com sugestões enquanto se digita: filtra uma lista local ou busca no servidor, com carregando e "nenhum resultado". Segue o padrão "combobox with list autocomplete" do ARIA APG.',
  component: ArgCombobox,
  // Como Input e Select: um campo solto, sem arg-field, não tem rótulo
  playground: false,
  examples: [{ name: 'Lista local e busca', component: ComboboxSearchExample }],
  guidelines: {
    do: [
      'Use `options` para listas que cabem no navegador (serviços, raças) e `search` para listas grandes (clientes).',
      'Com `search`, use `minChars` para não buscar com uma letra só.',
      'No `search`, devolva as opções em ordem de relevância; o componente já descarta respostas atrasadas.',
    ],
    dont: [
      'Não use para poucas opções fixas: um Select é mais simples.',
      'Não use para texto livre que não precisa ser uma das opções: o campo volta à opção escolhida ao sair.',
    ],
  },
  accessibility: [
    'O campo tem `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded` e `aria-controls`; a lista tem `role="listbox"` e nome.',
    'O foco fica sempre no campo: ↓ e ↑ andam pelas sugestões (dando a volta) e a ativa é indicada por `aria-activedescendant`. Com a lista fechada, ↓ abre na primeira e ↑ na última.',
    'Enter escolhe; Esc fecha e, com a lista fechada, limpa; Alt+↓ abre e Alt+↑ fecha; Tab sai sem escolher.',
    'O leitor de tela anuncia quantos resultados há ("3 resultados") ou "Nenhum resultado"; enquanto busca, o painel mostra "Buscando…".',
    'A busca ignora acentos e maiúsculas: "joao" acha "João".',
  ],
};
