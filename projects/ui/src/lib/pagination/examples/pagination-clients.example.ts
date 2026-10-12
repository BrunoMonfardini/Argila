import { Component, computed, signal } from '@angular/core';
import { ARG_LIST } from '../../list/list';
import { ArgPagination } from '../pagination';

const NAMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabi', 'Hugo', 'Iara', 'João'];
const CLIENTS = Array.from(
  { length: 117 },
  (_, i) => `${NAMES[i % NAMES.length]} ${String(i + 1).padStart(3, '0')}`,
);
const PAGE_SIZE = 5;

/** 117 clientes, 5 por página. Numa largura pequena, ficam só Anterior, Próxima e a posição. */
@Component({
  selector: 'doc-pagination-clients-example',
  imports: [ARG_LIST, ArgPagination],
  template: `
    <div class="doc-stack">
      <ul arg-list divided bordered>
        @for (client of visible(); track client) {
          <li arg-list-item>
            <span arg-list-title>{{ client }}</span>
          </li>
        }
      </ul>
      <nav arg-pagination [total]="total" [(page)]="page"></nav>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-3);
      max-width: 36rem;
    }
  `,
})
export class PaginationClientsExample {
  protected readonly total = Math.ceil(CLIENTS.length / PAGE_SIZE);
  protected readonly page = signal(5);
  protected readonly visible = computed(() =>
    CLIENTS.slice((this.page() - 1) * PAGE_SIZE, this.page() * PAGE_SIZE),
  );
}
