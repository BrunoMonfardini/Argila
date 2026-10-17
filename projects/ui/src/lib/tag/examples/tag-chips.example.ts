import { Component, signal } from '@angular/core';
import { ArgTag } from '../tag';

/** Chips de filtro: `selectable` com `[(selected)]`; o desabilitado não muda. */
@Component({
  selector: 'doc-tag-chips-example',
  imports: [ArgTag],
  template: `
    <ul class="chips" aria-label="Filtrar pets">
      <li><arg-tag selectable [(selected)]="vacinados">Vacinados</arg-tag></li>
      <li><arg-tag selectable [(selected)]="castrados">Castrados</arg-tag></li>
      <li><arg-tag selectable disabled>Internados</arg-tag></li>
    </ul>
  `,
  styles: `
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
})
export class TagChipsExample {
  readonly vacinados = signal(true);
  readonly castrados = signal(false);
}
