import { DocPage } from '../../docs/doc-page';
import { ToastBasicExample } from './examples/toast-basic.example';

export const TOAST_DOCS: DocPage = {
  slug: 'toast',
  title: 'Toast',
  category: 'Componentes',
  group: 'Feedback',
  summary:
    'Aviso curto e passageiro no canto da tela, aberto pelo serviço `ArgToast`: "Agendamento salvo", "Lembrete enviado". Para confirmar o que acabou de acontecer, sem interromper a pessoa.',
  examples: [{ name: 'Uso', component: ToastBasicExample }],
  guidelines: {
    do: [
      'Use para confirmar uma ação que a pessoa acabou de fazer.',
      'Ofereça "Desfazer" como ação em remoções, em vez de um diálogo de confirmação.',
      'Para erros que exigem atenção, use `duration: 0`: o aviso fica até a pessoa fechar.',
    ],
    dont: [
      'Não ponha no toast a única forma de fazer algo: ele some.',
      'Não use para erros de formulário: mostre-os no campo, com o Field.',
      'Não mostre um toast com um diálogo aberto: espere fechar. Os botões do aviso ficariam inativos.',
    ],
  },
  accessibility: [
    'O texto é anunciado pelo leitor de tela sem mover o foco: educado para info e sucesso, interrompendo para aviso e erro. O anúncio sai de uma região `aria-live` que já está na página, o que funciona em todos os leitores.',
    'O tempo para com o mouse em cima ou com o foco dentro de um aviso, e continua de onde parou ao sair.',
    'Até 3 avisos na tela; os outros esperam na fila, para não cobrir a página.',
    'Cada aviso tem um botão "Fechar notificação". A pilha é uma região com nome ("Notificações"), alcançada pelo Tab no fim da página.',
  ],
};
