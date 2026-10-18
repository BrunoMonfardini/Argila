import { Component, signal } from '@angular/core';
import { ArgSelect } from '../../lib/select/select';
import { ArgTag } from '../../lib/tag/tag';

/** Trocar de contexto (clínica): o atual sempre à vista, no topo. */
@Component({
  selector: 'doc-pattern-context-switch',
  imports: [ArgSelect],
  template: `
    <label class="doc-context">
      <span>Clínica</span>
      <select arg-select (change)="clinic.set(value($event))">
        <option>Patas Centro</option>
        <option>Patas Zona Sul</option>
      </select>
    </label>
    <p>
      Agenda de hoje em <strong>{{ clinic() }}</strong
      >.
    </p>
  `,
  styles: `
    .doc-context {
      display: grid;
      gap: var(--arg-space-1);
      max-width: 16rem;
    }

    p {
      margin: var(--arg-space-3) 0 0;
    }
  `,
})
export class ContextSwitchExample {
  protected readonly clinic = signal('Patas Centro');

  protected value(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}

/** Filtros ativos como tags: o contexto da lista, removível um a um. */
@Component({
  selector: 'doc-pattern-context-filters',
  imports: [ArgTag],
  template: `
    <div class="doc-filters" role="group" aria-label="Filtros ativos">
      @for (filter of filters(); track filter) {
        <arg-tag removable (removed)="remove(filter)">{{ filter }}</arg-tag>
      } @empty {
        <p>Sem filtros: todos os agendamentos.</p>
      }
    </div>
  `,
  styles: `
    .doc-filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }

    p {
      margin: 0;
    }
  `,
})
export class ContextFiltersExample {
  protected readonly filters = signal(['Hoje', 'Banho', 'Confirmados']);

  protected remove(filter: string): void {
    this.filters.update((list) => list.filter((item) => item !== filter));
  }
}
