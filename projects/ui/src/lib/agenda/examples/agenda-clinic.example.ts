import { Component, signal } from '@angular/core';
import { addDays, todayIso } from '../../date-picker/dates';
import { ArgAgenda, ArgAgendaEvent, ArgAgendaSlot, ArgAgendaView } from '../agenda';

/** Agendamentos da semana atual, relativos a hoje. */
function agendamentos(): ArgAgendaEvent[] {
  const day = (offset: number, time: string) => `${addDays(todayIso(), offset)}T${time}`;
  return [
    { id: '1', title: 'Banho', description: 'Thor', start: day(0, '09:00'), end: day(0, '10:00') },
    {
      id: '2',
      title: 'Consulta',
      description: 'Mel',
      start: day(0, '09:30'),
      end: day(0, '10:30'),
      tone: 'info',
    },
    {
      id: '3',
      title: 'Vacina',
      description: 'Luna',
      start: day(1, '14:00'),
      end: day(1, '14:30'),
      tone: 'success',
    },
    {
      id: '4',
      title: 'Cirurgia',
      description: 'Bob',
      start: day(-1, '08:00'),
      end: day(-1, '11:00'),
      tone: 'danger',
    },
    {
      id: '5',
      title: 'Tosa',
      description: 'Pipoca',
      start: day(2, '15:30'),
      end: day(2, '17:00'),
      tone: 'warning',
    },
  ];
}

/**
 * Clique ou Enter num agendamento o abre; num horário livre, começa um novo.
 * As setas andam pela grade e passam para a semana vizinha.
 */
@Component({
  selector: 'doc-agenda-clinic-example',
  imports: [ArgAgenda],
  template: `
    <div class="doc-stack">
      <arg-agenda
        [events]="events"
        [(date)]="date"
        [(view)]="view"
        (eventSelect)="said.set('Abrir: ' + $event.title + ' (' + $event.description + ')')"
        (slotSelect)="newAt($event)"
      />
      <p class="doc-said" aria-live="polite">{{ said() }}</p>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-3);
      min-width: 0;
    }
    .doc-said {
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class AgendaClinicExample {
  readonly events = agendamentos();
  readonly date = signal(todayIso());
  readonly view = signal<ArgAgendaView>('week');
  readonly said = signal('Escolha um agendamento ou um horário livre.');

  newAt(slot: ArgAgendaSlot): void {
    this.said.set(`Novo agendamento em ${slot.date} às ${slot.time}`);
  }
}
