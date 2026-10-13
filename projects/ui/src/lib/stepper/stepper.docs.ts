import { DocPage } from '../../docs/doc-page';
import { StepperBookingExample, StepperVerticalExample } from './examples/stepper-booking.example';
import { ArgStepper } from './stepper';

export const STEPPER_DOCS: DocPage = {
  slug: 'stepper',
  title: 'Stepper',
  category: 'Componentes',
  summary:
    'Mostra em que etapa de um fluxo em sequência a pessoa está: agendamento, cadastro, pagamento. Feita, atual e pendente se distinguem pela forma e pelo texto, não só pela cor.',
  component: ArgStepper,
  // O playground não edita listas (steps): os exemplos mostram o componente
  playground: false,
  examples: [
    { name: 'Agendamento', component: StepperBookingExample },
    { name: 'Vertical', component: StepperVerticalExample },
  ],
  guidelines: {
    do: [
      'Use nomes curtos e na ordem do fluxo, de 3 a 5 etapas.',
      'Ponha o stepper acima do conteúdo da etapa, com os botões Voltar e Avançar embaixo.',
      'Use `navigable` quando a pessoa puder rever uma etapa já feita.',
    ],
    dont: [
      'Não use para seções independentes, que podem ser vistas em qualquer ordem: isso são Tabs.',
      'Não deixe pular para uma etapa pendente: elas não viram botões.',
    ],
  },
  accessibility: [
    'É uma lista ordenada com nome: o leitor de tela diz quantas etapas há e a posição de cada uma.',
    'Cada etapa é lida com o estado: "Serviço, concluída", "Horário, atual", "Confirmação, pendente". A atual tem `aria-current="step"`.',
    'Sem depender da cor: feita tem ✓ no marcador cheio, atual tem o anel grosso e o rótulo em negrito, pendente tem só o contorno. A linha entre etapas é cheia depois das feitas e tracejada antes das pendentes.',
    'Com `navigable`, as etapas feitas são botões, alcançados pelo Tab.',
  ],
};
