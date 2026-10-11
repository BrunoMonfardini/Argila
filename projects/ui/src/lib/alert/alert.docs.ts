import { DocPage } from '../../docs/doc-page';
import { ArgAlert } from './alert';
import { AlertFeedbackExample } from './examples/alert-feedback.example';
import { AlertTonesExample } from './examples/alert-tones.example';

export const ALERT_DOCS: DocPage = {
  slug: 'alert',
  title: 'Alert',
  category: 'Componentes',
  summary:
    'Mensagem de feedback na página: informação, sucesso, aviso ou erro, com ícone, título opcional, ações e botão de fechar.',
  component: ArgAlert,
  hostElement: 'div',
  playgroundContent: 'A clínica fecha mais cedo na véspera do feriado.',
  playgroundInputs: { heading: 'Horário especial' },
  examples: [
    { name: 'Tons', component: AlertTonesExample },
    {
      name: 'Depois de uma ação',
      description:
        'Com ação dentro (`arg-alert-action`) e botão de fechar. Quem usa o alerta o tira da página no `(dismissed)` e devolve o foco.',
      component: AlertFeedbackExample,
    },
  ],
  guidelines: {
    do: [
      'Diga o que aconteceu e o que fazer: "Não foi possível salvar. Confira a conexão e tente de novo."',
      'Use `live="off"` para avisos que já estão na página quando ela abre.',
      'Ao fechar, mande o foco para um lugar que faça sentido, como o botão que causou o alerta.',
    ],
    dont: [
      'Não use `danger` para algo que a pessoa não precisa resolver.',
      'Não empilhe vários alertas: junte as mensagens ou mostre a mais importante.',
      'Não feche sozinho por tempo: a pessoa pode não ter terminado de ler.',
    ],
  },
  accessibility: [
    'O `role` vem do tom: `status` (anúncio educado) para info e sucesso; `alert` (interrompe) para aviso e erro. `live` troca o padrão.',
    'O nome do tom é lido antes do texto ("Erro: Não foi possível salvar"), porque a cor e o ícone não chegam ao leitor de tela. `toneLabel` troca o nome.',
    'O ícone é decorativo. O texto comum sobre o fundo suave de cada tom passa no teste de contraste.',
    'O botão de fechar é um botão de ícone com nome ("Fechar aviso"); em alto contraste o alerta mantém a borda.',
  ],
};
