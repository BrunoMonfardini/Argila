import { Component } from '@angular/core';
import { ArgBadge } from '../../lib/badge/badge';

const EVENTS = [
  { time: '10h12', text: 'Pagamento confirmado', tone: 'success' as const, status: 'Concluído' },
  { time: '10h05', text: 'Banho finalizado', tone: 'success' as const, status: 'Concluído' },
  { time: '09h30', text: 'Thor chegou à clínica', tone: 'neutral' as const, status: 'Registro' },
];

/** O mais recente primeiro, cada evento com hora, texto e situação. */
@Component({
  selector: 'doc-pattern-timeline',
  imports: [ArgBadge],
  template: `
    <ol class="doc-timeline">
      @for (event of events; track event.time) {
        <li>
          <time>{{ event.time }}</time>
          <span>{{ event.text }}</span>
          <span arg-badge [tone]="event.tone">{{ event.status }}</span>
        </li>
      }
    </ol>
  `,
  styles: `
    .doc-timeline {
      display: grid;
      gap: var(--arg-space-4);
      max-width: 28rem;
      margin: 0;
      padding: 0 0 0 var(--arg-space-4);
      border-inline-start: 2px solid var(--arg-color-border);
      list-style: none;
    }

    li {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
      align-items: baseline;
    }

    time {
      color: var(--arg-color-text-muted);
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class TimelineExample {
  protected readonly events = EVENTS;
}
