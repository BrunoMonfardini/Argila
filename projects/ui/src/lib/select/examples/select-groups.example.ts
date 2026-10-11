import { Component } from '@angular/core';
import { ARG_FIELD } from '../../field/field';
import { ArgSelect } from '../select';

@Component({
  selector: 'doc-select-groups-example',
  imports: [ARG_FIELD, ArgSelect],
  template: `
    <div class="doc-grid">
      <arg-field label="Profissional">
        <select arg-select>
          <optgroup label="Veterinários">
            <option>Dra. Ana Lima</option>
            <option>Dr. João Pereira</option>
          </optgroup>
          <optgroup label="Banho e tosa">
            <option>Carla Souza</option>
          </optgroup>
        </select>
      </arg-field>
      <arg-field label="Unidade" hint="Só há uma unidade no seu plano.">
        <select arg-select disabled>
          <option>Centro</option>
        </select>
      </arg-field>
    </div>
  `,
  styles: `
    .doc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: var(--arg-space-4);
    }
  `,
})
export class SelectGroupsExample {}
