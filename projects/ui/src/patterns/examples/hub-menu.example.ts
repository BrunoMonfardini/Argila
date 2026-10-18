import { Component } from '@angular/core';
import { ARG_CARD } from '../../lib/card/card';
import { ArgLink } from '../../lib/link/link';

const HUBS = [
  { title: 'Agenda', text: 'Horários, confirmações e remarcações.' },
  { title: 'Clientes', text: 'Tutores, pets e histórico.' },
  { title: 'Financeiro', text: 'Pagamentos, notas e repasses.' },
  { title: 'Configurações', text: 'Serviços, equipe e horários da clínica.' },
];

/** Cada área é um card clicável com título e o que se faz nela. */
@Component({
  selector: 'doc-pattern-hub-menu',
  imports: [ARG_CARD, ArgLink],
  template: `
    <ul class="doc-hubs">
      @for (hub of hubs; track hub.title) {
        <li arg-card>
          <h4>
            <a arg-link href="#" (click)="$event.preventDefault()">{{ hub.title }}</a>
          </h4>
          <p>{{ hub.text }}</p>
        </li>
      }
    </ul>
  `,
  styles: `
    .doc-hubs {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      gap: var(--arg-space-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    h4,
    p {
      margin: 0;
    }

    li {
      display: grid;
      gap: var(--arg-space-1);
    }
  `,
})
export class HubMenuExample {
  protected readonly hubs = HUBS;
}
