import { DocPage } from '../../docs/doc-page';
import { DialogAnatomyExample } from './examples/dialog-anatomy.example';
import { ArgDialogTitle } from './dialog-title';
import { DialogConfirmExample } from './examples/dialog-confirm.example';
import { DialogFormExample } from './examples/dialog-form.example';

export const DIALOG_DOCS: DocPage = {
  slug: 'dialog',
  title: 'Dialog',
  category: 'Componentes',
  group: 'Camadas',
  summary:
    'Janela modal sobre o `<dialog>` nativo, aberta pelo serviço `ArgDialog`: `open(Componente, { data })` devolve uma referência com o resultado em `closed`, e `confirm({ title, message })` é a confirmação pronta.',
  component: ArgDialogTitle,
  playground: false,
  anatomy: {
    example: DialogAnatomyExample,
    parts: [
      {
        label: 'Superfície',
        description: 'Abre por cima da página, que fica escurecida e sem foco.',
      },
      {
        label: 'Título',
        description: 'Nomeia o diálogo (`argDialogTitle`); em confirmação, é a pergunta.',
      },
      {
        label: 'Conteúdo',
        description: 'O que a pessoa precisa saber para decidir (`arg-dialog-content`).',
      },
      {
        label: 'Ações',
        description: 'A principal por último (`arg-dialog-actions`); Esc equivale a voltar.',
      },
      { label: 'Fechar', description: 'Opcional; o foco volta para quem abriu o diálogo.' },
    ],
  },
  examples: [
    {
      name: 'Formulário',
      description:
        'O componente do diálogo usa `argDialogTitle`, `argDialogDescription`, `arg-dialog-content` e `arg-dialog-actions`, e fecha com `inject(ArgDialogRef).close(resultado)`.',
      component: DialogFormExample,
    },
    { name: 'Confirmação', component: DialogConfirmExample },
  ],
  guidelines: {
    do: [
      'Dê um título com `argDialogTitle`: ele é o nome do diálogo.',
      'Nos botões, escreva o verbo da ação ("Cancelar agendamento"), não "OK" ou "Sim".',
      "Em ações destrutivas, use `tone: 'danger'`: o foco começa no botão que não destrói nada.",
      'Marque com `arg-dialog-focus` o campo que a pessoa vai preencher primeiro; sem ele, o foco vai para o primeiro elemento focável.',
    ],
    dont: [
      'Não abra um diálogo para avisar algo que não pede decisão: use um Alert ou um Toast.',
      'Não use `dismissable: false` sem um botão claro de saída.',
      'Não empilhe diálogos: resolva um antes de abrir outro.',
    ],
  },
  accessibility: [
    'É um `<dialog>` aberto com `showModal()`: o resto da página fica inerte, o Tab não sai do diálogo e o leitor de tela só lê o diálogo.',
    'Esc e clique fora fecham (a menos que `dismissable: false`); ao fechar, o foco volta ao elemento que abriu.',
    'O título dá nome ao diálogo (`aria-labelledby`) e `argDialogDescription` é lido ao abrir (`aria-describedby`). A confirmação usa `role="alertdialog"`.',
    'Enquanto há um diálogo aberto, a página por baixo não rola.',
  ],
};
