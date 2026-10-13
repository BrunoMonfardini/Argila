import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ArgAnnouncer } from '../internal/announcer';
import { injectUniqueId } from '../internal/unique-id';
import { ArgSkeleton } from '../skeleton/skeleton';

/** Uma coluna da tabela. */
export interface ArgTableColumn<T = Record<string, unknown>> {
  /** Campo da linha mostrado na coluna (e usado na ordenação). */
  key: string;
  /** Título da coluna. */
  label: string;
  /** Mostra o botão de ordenar no título. */
  sortable?: boolean;
  /** `end` para números e valores, alinhados à direita. */
  align?: 'start' | 'end';
  /** Texto da célula; o padrão é o valor do campo. */
  format?: (row: T) => string;
}

/** Ordenação atual. */
export interface ArgTableSort {
  key: string;
  direction: 'asc' | 'desc';
}

const COLLATOR = new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' });

/** Compara dois valores de célula: números como números, textos em português. */
export function compareValues(a: unknown, b: unknown): number {
  if (a == null || a === '') return b == null || b === '' ? 0 : 1;
  if (b == null || b === '') return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return COLLATOR.compare(String(a), String(b));
}

/**
 * Célula própria de uma coluna, ex.: um badge de status:
 *
 * ```html
 * <ng-template argTableCell="status" let-row>
 *   <span arg-badge [tone]="row.tone">{{ row.status }}</span>
 * </ng-template>
 * ```
 */
@Directive({ selector: 'ng-template[argTableCell]' })
export class ArgTableCell {
  /** `key` da coluna que este modelo desenha. */
  readonly argTableCell = input.required<string>();
  /** @internal */
  readonly template = inject<TemplateRef<{ $implicit: unknown }>>(TemplateRef);
}

/** Conteúdo do estado vazio, no lugar do `emptyText`: `<arg-empty-state argTableEmpty …>`. */
@Directive({ selector: '[argTableEmpty]' })
export class ArgTableEmpty {}

/**
 * Tabela sobre a `<table>` nativa, com ordenação, seleção de linhas,
 * carregando, vazio e rolagem horizontal no celular.
 *
 * ```html
 * <arg-table caption="Pets" [columns]="colunas" [rows]="pets()" rowKey="id"
 *   selectable [(selected)]="escolhidos" [loading]="carregando()" />
 * ```
 */
@Component({
  selector: 'arg-table',
  imports: [ArgSkeleton, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.html',
  styleUrls: ['./table.css', '../internal/sr-only.css'],
  host: { class: 'arg-table' },
})
export class ArgTable<T extends object = Record<string, unknown>> {
  /** Nome da tabela, na `<caption>`. Também dá nome à área de rolagem. */
  readonly caption = input.required<string>();
  /** Esconde a legenda da tela (o leitor de tela continua lendo). */
  readonly hideCaption = input(false, { transform: booleanAttribute });
  /** Colunas, na ordem. */
  readonly columns = input.required<readonly ArgTableColumn<T>[]>();
  /** Linhas. */
  readonly rows = input<readonly T[]>([]);
  /** Campo que identifica cada linha (para a seleção e para o Angular). */
  readonly rowKey = input.required<string>();
  /** Coluna de seleção com caixas de marcar. */
  readonly selectable = input(false, { transform: booleanAttribute });
  /** Chaves das linhas selecionadas. */
  readonly selected = model<readonly unknown[]>([]);
  /** Ordenação atual; o clique num título ordenável troca. */
  readonly sort = model<ArgTableSort | null>(null);
  /** A ordenação é feita fora (ex.: no servidor): as linhas vêm já ordenadas. */
  readonly serverSort = input(false, { transform: booleanAttribute });
  /** Buscando as linhas: mostra marcadores no lugar delas. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Texto quando não há linhas. Para algo mais rico, projete um `[argTableEmpty]`. */
  readonly emptyText = input('Nenhum registro.');

  protected readonly captionId = injectUniqueId('arg-table-caption');
  protected readonly placeholders = [0, 1, 2];
  private readonly cells = contentChildren(ArgTableCell);
  /** Há um `[argTableEmpty]` projetado de verdade (e não um `@if` falso). */
  protected readonly customEmpty = contentChild(ArgTableEmpty);
  private readonly announcer = inject(ArgAnnouncer);

  protected readonly templates = computed(
    () => new Map(this.cells().map((cell) => [cell.argTableCell(), cell.template])),
  );
  protected readonly span = computed(() => this.columns().length + (this.selectable() ? 1 : 0));
  /** Uma posição por coluna, para as linhas de carregando. */
  protected readonly slots = computed(() => Array.from({ length: this.span() }, (_, i) => i));

  protected readonly view = computed(() => {
    const rows = [...this.rows()];
    const sort = this.sort();
    if (!sort || this.serverSort()) return rows;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return rows.sort(
      (a, b) => factor * compareValues(this.valueOf(a, sort.key), this.valueOf(b, sort.key)),
    );
  });

  private readonly selectedSet = computed(() => new Set(this.selected()));
  protected readonly allSelected = computed(
    () =>
      this.rows().length > 0 && this.rows().every((row) => this.selectedSet().has(this.keyOf(row))),
  );
  protected readonly someSelected = computed(
    () => !this.allSelected() && this.rows().some((row) => this.selectedSet().has(this.keyOf(row))),
  );

  protected keyOf(row: T): unknown {
    return this.valueOf(row, this.rowKey());
  }

  protected isSelected(row: T): boolean {
    return this.selectedSet().has(this.keyOf(row));
  }

  protected text(row: T, column: ArgTableColumn<T>): string {
    if (column.format) return column.format(row);
    const value = this.valueOf(row, column.key);
    return value == null ? '' : String(value);
  }

  /** Nome de cada linha para a caixa de seleção: o valor da primeira coluna. */
  protected rowName(row: T): string {
    const first = this.columns()[0];
    return first ? this.text(row, first) : String(this.keyOf(row));
  }

  /**
   * Seta da direção. ⇅ (U+21C5), e não ↕: o ↕ tem versão emoji, que alguns
   * sistemas desenham colorida.
   */
  protected arrow(column: ArgTableColumn<T>): string {
    const sort = this.ariaSort(column);
    return sort === 'ascending' ? '↑' : sort === 'descending' ? '↓' : '⇅';
  }

  protected ariaSort(column: ArgTableColumn<T>): string | null {
    if (!column.sortable) return null;
    const sort = this.sort();
    if (sort?.key !== column.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  /** Primeiro clique: crescente; de novo na mesma coluna: inverte. */
  protected toggleSort(column: ArgTableColumn<T>): void {
    const current = this.sort();
    const direction = current?.key === column.key && current.direction === 'asc' ? 'desc' : 'asc';
    this.sort.set({ key: column.key, direction });
    this.announcer.announce(
      `Ordenado por ${column.label}, ${direction === 'asc' ? 'crescente' : 'decrescente'}`,
    );
  }

  protected toggleRow(row: T): void {
    const key = this.keyOf(row);
    this.selected.update((keys) =>
      keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key],
    );
  }

  protected toggleAll(): void {
    this.selected.set(this.allSelected() ? [] : this.rows().map((row) => this.keyOf(row)));
  }

  private valueOf(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }
}

/** Tudo o que a tabela usa, para importar de uma vez: `imports: [ARG_TABLE]`. */
export const ARG_TABLE = [ArgTable, ArgTableCell, ArgTableEmpty] as const;
