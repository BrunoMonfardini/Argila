import { DocPage } from '../../docs/doc-page';
import { ArgAgenda } from './agenda';
import { AgendaClinicExample } from './examples/agenda-clinic.example';

export const AGENDA_DOCS: DocPage = {
  slug: 'agenda',
  title: 'Agenda',
  category: 'Componentes',
  summary:
    'Calendário de dia e de semana com os agendamentos posicionados pelo horário, lado a lado quando simultâneos. Navegável por teclado, célula a célula.',
  component: ArgAgenda,
  // Os agendamentos não são editáveis no playground: o exemplo mostra o componente
  playground: false,
  examples: [{ name: 'Agenda da clínica', component: AgendaClinicExample }],
  guidelines: {
    do: [
      'Ajuste `start`, `end` e `step` ao expediente: uma grade menor é mais fácil de percorrer.',
      'Use `tone` para o tipo de serviço, e diga o tipo também no `title`: a cor não pode ser a única pista.',
      'Ponha o pet (e o tutor) em `description`: aparece no bloco e é lido pelo leitor de tela.',
    ],
    dont: [
      'Não use para escolher só um horário de um dia: isso é o Time Slot Picker.',
      'Não use para eventos de vários dias: cada agendamento começa e termina no mesmo dia.',
    ],
  },
  accessibility: [
    'É o padrão "grid" do ARIA APG: linhas são horários (`rowheader`) e colunas são dias (`columnheader`); a grade se chama pelo período mostrado.',
    'Só uma célula entra no Tab. Setas andam entre horários e dias (e passam para a semana vizinha); Home/End vão ao primeiro e ao último dia, com Ctrl ao primeiro e ao último horário; PageUp/PageDown mudam a semana (ou o dia).',
    'Cada célula diz o horário, o dia e o que há nela: "09:00, terça-feira, 13 de outubro de 2026, Banho, Thor, 09:00 às 10:00", "ocupado: …" ou "livre". Enter ou Espaço abrem o agendamento ou escolhem o horário livre.',
    'Trocar de semana ou de dia anuncia o novo período; hoje tem `aria-current="date"` e um círculo preenchido, não só outra cor.',
    'No celular a semana rola de lado; a célula focada entra na vista sozinha.',
  ],
};
