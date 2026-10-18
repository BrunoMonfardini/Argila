import { Component } from '@angular/core';
import { ARG_FIELD } from '../../field/field';
import { ArgSelect } from '../select';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-select-anatomy-example',
  imports: [ARG_FIELD, ArgSelect],
  template: `
    <arg-field label="Serviço" hint="O preço aparece no próximo passo">
      <select arg-select>
        <option>Banho</option>
        <option>Tosa</option>
      </select>
    </arg-field>
  `,
  styles: `
    arg-field {
      max-width: 22rem;
    }
  `,
})
export class SelectAnatomyExample {}
