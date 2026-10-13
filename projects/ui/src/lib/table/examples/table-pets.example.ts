import { Component, computed, signal } from '@angular/core';
import { ArgBadge, ArgBadgeTone } from '../../badge/badge';
import { ArgButton } from '../../button/button';
import { ArgEmptyState } from '../../empty-state/empty-state';
import { formatCents } from '../../currency-input/currency-input';
import { ARG_TABLE, ArgTableColumn, ArgTableSort } from '../table';

interface Pet {
  id: number;
  name: string;
  tutor: string;
  species: string;
  visits: number;
  spent: number;
  status: 'Em dia' | 'Vacina vencendo' | 'Inativo';
}

const PETS: Pet[] = [
  {
    id: 1,
    name: 'Thor',
    tutor: 'Maria Souza',
    species: 'Cachorro',
    visits: 12,
    spent: 154000,
    status: 'Em dia',
  },
  {
    id: 2,
    name: 'Mel',
    tutor: 'Maria Souza',
    species: 'Gato',
    visits: 5,
    spent: 48900,
    status: 'Vacina vencendo',
  },
  {
    id: 3,
    name: 'Pipoca',
    tutor: 'João Pereira',
    species: 'Cachorro',
    visits: 21,
    spent: 289050,
    status: 'Em dia',
  },
  {
    id: 4,
    name: 'Ágata',
    tutor: 'Ana Lima',
    species: 'Gato',
    visits: 2,
    spent: 12000,
    status: 'Inativo',
  },
  {
    id: 5,
    name: 'Bob',
    tutor: 'Mariana Lima',
    species: 'Coelho',
    visits: 7,
    spent: 61500,
    status: 'Em dia',
  },
];

const TONES: Record<Pet['status'], ArgBadgeTone> = {
  'Em dia': 'success',
  'Vacina vencendo': 'warning',
  Inativo: 'neutral',
};

/** Clique nos títulos para ordenar; marque linhas para agir sobre elas. Numa tela estreita, a tabela rola de lado. */
@Component({
  selector: 'doc-table-pets-example',
  imports: [ARG_TABLE, ArgBadge, ArgButton, ArgEmptyState],
  template: `
    <div class="doc-stack">
      <div class="doc-bar">
        <span>{{ selectedText() }}</span>
        <button arg-button variant="secondary" size="sm" (click)="toggleLoading()">
          {{ loading() ? 'Mostrar dados' : 'Ver carregando' }}
        </button>
        <button arg-button variant="secondary" size="sm" (click)="toggleEmpty()">
          {{ rows().length ? 'Ver vazio' : 'Mostrar dados' }}
        </button>
      </div>
      <arg-table
        caption="Pets da clínica"
        [columns]="columns"
        [rows]="rows()"
        rowKey="id"
        selectable
        [(selected)]="selected"
        [(sort)]="sort"
        [loading]="loading()"
      >
        <ng-template argTableCell="status" let-pet>
          <span arg-badge [tone]="tone(pet.status)">{{ pet.status }}</span>
        </ng-template>
        <section argTableEmpty arg-empty-state heading="Nenhum pet cadastrado" [level]="3">
          Cadastre o primeiro pet para ver a lista aqui.
        </section>
      </arg-table>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-3);
      min-width: 0;
    }
    .doc-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--arg-space-2);
      color: var(--arg-color-text-muted);
    }
    .doc-bar span {
      margin-inline-end: auto;
    }
  `,
})
export class TablePetsExample {
  protected readonly columns: ArgTableColumn<Pet>[] = [
    { key: 'name', label: 'Pet', sortable: true },
    { key: 'tutor', label: 'Tutor', sortable: true },
    { key: 'species', label: 'Espécie', sortable: true },
    { key: 'visits', label: 'Visitas', sortable: true, align: 'end' },
    {
      key: 'spent',
      label: 'Gasto',
      sortable: true,
      align: 'end',
      format: (pet) => formatCents(pet.spent),
    },
    { key: 'status', label: 'Situação' },
  ];
  protected readonly rows = signal<Pet[]>(PETS);
  protected readonly selected = signal<readonly unknown[]>([]);
  protected readonly sort = signal<ArgTableSort | null>({ key: 'name', direction: 'asc' });
  protected readonly loading = signal(false);
  protected readonly selectedText = computed(() => {
    const count = this.selected().length;
    return count
      ? `${count} ${count === 1 ? 'selecionado' : 'selecionados'}`
      : 'Nenhum selecionado';
  });

  protected tone(status: Pet['status']): ArgBadgeTone {
    return TONES[status];
  }

  protected toggleLoading(): void {
    this.loading.update((loading) => !loading);
  }

  protected toggleEmpty(): void {
    this.rows.update((rows) => (rows.length ? [] : PETS));
    this.selected.set([]);
  }
}
