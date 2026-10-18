import { DocPage } from '../../docs/doc-page';
import { TimeSlotsBookingExample } from './examples/time-slots-booking.example';
import { ArgTimeSlots } from './time-slots';

export const TIME_SLOTS_DOCS: DocPage = {
  slug: 'time-slots',
  title: 'Time Slot Picker',
  category: 'Componentes',
  group: 'Domínio',
  summary:
    'Grade de horários livres e ocupados de um dia, o centro da agenda de vet e barbearia. Navegável por setas, com estado de carregamento enquanto busca os horários.',
  component: ArgTimeSlots,
  // A lista de horários não é editável no playground: o exemplo mostra o componente
  playground: false,
  examples: [{ name: 'Agendamento', component: TimeSlotsBookingExample }],
  guidelines: {
    do: [
      'Mostre os ocupados em vez de escondê-los: a pessoa entende a agenda do dia.',
      'Use `loading` enquanto busca os horários de outro dia, e limpe a escolha ao trocar de dia.',
      'Use um `label` que diga o que se escolhe: "Horário do banho".',
    ],
    dont: [
      'Não use para escolher a data: isso é o Date Picker.',
      'Não mostre horários de dias diferentes na mesma grade.',
    ],
  },
  accessibility: [
    'É um `<fieldset>` com `<legend>` e um rádio nativo por horário: o leitor de tela diz o nome do grupo, quantos horários há e qual está escolhido.',
    'Tab entra na grade; as setas andam entre os horários livres e escolhem. Os ocupados ficam desabilitados e são pulados.',
    'Ocupado não depende só da cor: é riscado, tem borda tracejada e é lido como "09:30, ocupado".',
    'Carregando, o grupo tem `aria-busy="true"` e "Carregando horários…" para o leitor de tela; ao terminar, é anunciado "12 horários livres" (ou "Nenhum horário livre neste dia").',
  ],
};
