import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAnnouncer } from '../internal/announcer';
import { ARG_TABLE, ArgTableColumn, ArgTableSort, compareValues } from './table';

interface Pet {
  id: number;
  name: string;
  age: number;
  status: string;
}

const PETS: Pet[] = [
  { id: 1, name: 'Thor', age: 4, status: 'Ativo' },
  { id: 2, name: 'Ágata', age: 12, status: 'Inativo' },
  { id: 3, name: 'Mel', age: 2, status: 'Ativo' },
];

describe('compareValues', () => {
  it('números como números, textos em português, vazios no fim', () => {
    expect(compareValues(2, 12)).toBeLessThan(0);
    expect(compareValues('item 2', 'item 12')).toBeLessThan(0);
    expect(compareValues('Ágata', 'Bia')).toBeLessThan(0);
    expect(compareValues(null, 'a')).toBeGreaterThan(0);
    expect(compareValues('a', '')).toBeLessThan(0);
    expect(compareValues(new Date(2026, 0, 1), new Date(2025, 0, 1))).toBeGreaterThan(0);
  });
});

@Component({
  imports: [ARG_TABLE],
  template: `
    <arg-table
      caption="Pets"
      [columns]="columns"
      [rows]="rows()"
      rowKey="id"
      [selectable]="selectable()"
      [(selected)]="selected"
      [(sort)]="sort"
      [loading]="loading()"
    >
      <ng-template argTableCell="status" let-row>
        <strong class="status">{{ row.status }}</strong>
      </ng-template>
      @if (custom()) {
        <p argTableEmpty>Nenhum pet cadastrado ainda.</p>
      }
    </arg-table>
  `,
})
class Host {
  readonly columns: ArgTableColumn<Pet>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    {
      key: 'age',
      label: 'Idade',
      sortable: true,
      align: 'end',
      format: (pet) => `${pet.age} anos`,
    },
    { key: 'status', label: 'Situação' },
  ];
  readonly rows = signal<Pet[]>(PETS);
  readonly selectable = signal(true);
  readonly selected = signal<readonly unknown[]>([]);
  readonly sort = signal<ArgTableSort | null>(null);
  readonly loading = signal(false);
  readonly custom = signal(false);
}

describe('ArgTable', () => {
  async function setup() {
    const announce = vi
      .spyOn(TestBed.inject(ArgAnnouncer), 'announce')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    const stable = () => fixture.whenStable();
    const names = () =>
      Array.from(root.querySelectorAll('tbody tr')).map((tr) =>
        tr.children[1]?.textContent?.trim(),
      );
    const header = (label: string) =>
      Array.from(root.querySelectorAll<HTMLTableCellElement>('th')).find((th) =>
        th.textContent?.includes(label),
      )!;
    const boxes = () =>
      Array.from(root.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'));
    const all = () => root.querySelector<HTMLInputElement>('thead input[type="checkbox"]')!;
    return {
      host: fixture.componentInstance,
      root,
      set,
      stable,
      names,
      header,
      boxes,
      all,
      announce,
    };
  }

  afterEach(() => vi.restoreAllMocks());

  it('é uma tabela nativa com legenda, títulos de coluna e as linhas', async () => {
    const { root, names } = await setup();
    const table = root.querySelector('table')!;
    expect(table.querySelector('caption')?.textContent?.trim()).toBe('Pets');
    expect(Array.from(root.querySelectorAll('th[scope="col"]'))).toHaveLength(4);
    expect(names()).toEqual(['Thor', 'Ágata', 'Mel']);
  });

  it('a área de rolagem é focável e tem o nome da legenda (rolagem pelo teclado)', async () => {
    const { root } = await setup();
    const region = root.querySelector<HTMLElement>('.arg-table__scroll')!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.tabIndex).toBe(0);
    expect(accessibleName(region)).toBe('Pets');
  });

  it('formata células e usa o modelo próprio da coluna', async () => {
    const { root } = await setup();
    const first = root.querySelector('tbody tr')!;
    expect(first.children[2].textContent?.trim()).toBe('4 anos');
    expect(first.children[2].classList).toContain('arg-table__cell--end');
    expect(first.querySelector('strong.status')?.textContent).toBe('Ativo');
  });

  it('ordena pelo título: crescente, depois decrescente, com aria-sort e anúncio', async () => {
    const { host, names, header, stable, announce } = await setup();
    expect(header('Nome').getAttribute('aria-sort')).toBe('none');
    expect(header('Situação').hasAttribute('aria-sort')).toBe(false);

    header('Nome').querySelector('button')!.click();
    await stable();
    expect(names()).toEqual(['Ágata', 'Mel', 'Thor']);
    expect(header('Nome').getAttribute('aria-sort')).toBe('ascending');
    expect(host.sort()).toEqual({ key: 'name', direction: 'asc' });
    expect(announce).toHaveBeenLastCalledWith('Ordenado por Nome, crescente');

    header('Nome').querySelector('button')!.click();
    await stable();
    expect(names()).toEqual(['Thor', 'Mel', 'Ágata']);
    expect(header('Nome').getAttribute('aria-sort')).toBe('descending');

    header('Idade').querySelector('button')!.click();
    await stable();
    expect(names()).toEqual(['Mel', 'Thor', 'Ágata']);
    expect(header('Nome').getAttribute('aria-sort')).toBe('none');
  });

  it('seleciona linhas, com nome em cada caixa; "todas" fica indeterminado no meio', async () => {
    const { host, root, boxes, all, stable } = await setup();
    expect(accessibleName(boxes()[0])).toBe('Selecionar Thor');
    expect(accessibleName(all())).toBe('Selecionar todas as linhas');

    boxes()[1].click();
    await stable();
    expect(host.selected()).toEqual([2]);
    expect(all().indeterminate).toBe(true);
    expect(root.querySelectorAll('.arg-table__row--selected')).toHaveLength(1);

    all().click();
    await stable();
    expect(host.selected()).toEqual([1, 2, 3]);
    expect(all().checked).toBe(true);
    expect(all().indeterminate).toBe(false);

    all().click();
    await stable();
    expect(host.selected()).toEqual([]);
  });

  it('carregando: marcadores ocultos, aria-busy e aviso na legenda', async () => {
    const { root, set, all } = await setup();
    await set((h) => h.loading.set(true));
    const table = root.querySelector('table')!;
    expect(table.getAttribute('aria-busy')).toBe('true');
    expect(root.querySelector('caption')?.textContent).toContain('(carregando…)');
    const rows = Array.from(root.querySelectorAll('tbody tr'));
    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(all().disabled).toBe(true);
  });

  it('vazio: texto padrão ou conteúdo projetado, ocupando a linha toda', async () => {
    const { root, set } = await setup();
    await set((h) => h.rows.set([]));
    const cell = root.querySelector<HTMLTableCellElement>('.arg-table__empty')!;
    expect(cell.textContent?.trim()).toBe('Nenhum registro.');
    expect(cell.colSpan).toBe(4);

    await set((h) => h.custom.set(true));
    expect(root.querySelector('.arg-table__empty')?.textContent?.trim()).toBe(
      'Nenhum pet cadastrado ainda.',
    );
  });

  it('sem selectable, não há coluna de seleção', async () => {
    const { root, set } = await setup();
    await set((h) => h.selectable.set(false));
    expect(root.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
    expect(root.querySelectorAll('th')).toHaveLength(3);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root, set } = await setup();
    expect(a11yViolations(root)).toEqual([]);
    await set((h) => h.loading.set(true));
    expect(a11yViolations(root)).toEqual([]);
  });
});
