import { Component, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgTag } from '../tag';

/** Remova com o mouse ou pelo teclado: Tab até o "x" e Enter, Espaço, Delete ou Backspace. */
@Component({
  selector: 'doc-tag-filters-example',
  imports: [ArgButton, ArgTag],
  template: `
    <div class="doc-stack">
      <ul class="doc-tags" aria-label="Filtros aplicados">
        @for (filter of filters(); track filter) {
          <li>
            <arg-tag removable removeText="Tirar filtro" (removed)="remove(filter)">{{
              filter
            }}</arg-tag>
          </li>
        } @empty {
          <li>Nenhum filtro aplicado.</li>
        }
      </ul>
      <button arg-button variant="tertiary" size="sm" (click)="reset()">Restaurar filtros</button>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
    }
    .doc-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
})
export class TagFiltersExample {
  private readonly all = ['Cachorro', 'Gato', 'Banho', 'Hoje'];
  protected readonly filters = signal(this.all);

  protected remove(filter: string): void {
    this.filters.update((filters) => filters.filter((item) => item !== filter));
  }

  protected reset(): void {
    this.filters.set(this.all);
  }
}
