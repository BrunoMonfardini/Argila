import { Component } from '@angular/core';
import { ArgTable, ArgTableColumn } from '../table';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-table-anatomy-example',
  imports: [ArgTable],
  template: `
    <arg-table caption="Pets da clínica" rowKey="nome" [columns]="columns" [rows]="rows" />
  `,
})
export class TableAnatomyExample {
  protected readonly columns: ArgTableColumn[] = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'especie', label: 'Espécie' },
  ];
  protected readonly rows = [
    { nome: 'Thor', especie: 'Cão' },
    { nome: 'Mel', especie: 'Gato' },
  ];
}
