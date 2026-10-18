import { DocPage } from '../../docs/doc-page';
import { MaskedInputClientExample } from './examples/masked-input-client.example';
import { ArgMaskedInput } from './masked-input';

export const MASKED_INPUT_DOCS: DocPage = {
  slug: 'masked-input',
  title: 'Masked Input',
  category: 'Componentes',
  group: 'Formulário',
  summary:
    'Campo com máscara para CPF, CNPJ (inclusive o alfanumérico), CEP e telefone. Mostra o valor formatado e guarda só os caracteres que contam, com validação dos dígitos verificadores.',
  component: ArgMaskedInput,
  // Como Input e Select: um campo solto, sem arg-field, não tem rótulo
  playground: false,
  examples: [{ name: 'Cadastro de cliente', component: MaskedInputClientExample }],
  guidelines: {
    do: [
      'Guarde e envie o valor sem máscara (`12345678909`); formate só para mostrar, com `applyMask`.',
      'Mostre o erro ao sair do campo, com a causa: "CPF incompleto" ou "CPF inválido: confira os números".',
      'Aceite o CNPJ alfanumérico: desde julho de 2026, novos CNPJs podem ter letras nas 12 primeiras posições.',
      'Em formulários de signals, valide com `isValidCpf`, `isValidCnpj`, `isValidCep` e `isValidPhone` num `validate()`.',
    ],
    dont: [
      'Não bloqueie colar: valores com ou sem máscara funcionam.',
      'Não use máscara para nomes, e-mails ou outros textos livres.',
    ],
  },
  accessibility: [
    'É um `<input>` nativo de texto. O teclado do celular segue o tipo: números para CPF e CEP, telefone para telefone, texto para o CNPJ (que tem letras).',
    'O exemplo do formato fica no `placeholder` e o leitor de tela lê o valor formatado; dentro do `arg-field`, lê também o rótulo, a dica e o erro.',
    'Ao apagar ou digitar no meio, o cursor continua no mesmo lugar do texto, sem pular para o fim.',
    'O CEP e o telefone usam `autocomplete` (`postal-code`, `tel-national`): o navegador preenche sozinho.',
  ],
};
