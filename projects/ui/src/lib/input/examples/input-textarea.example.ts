import { Component } from '@angular/core';
import { ARG_FIELD } from '../../field/field';
import { ArgTextarea } from '../input';

@Component({
  selector: 'doc-input-textarea-example',
  imports: [ARG_FIELD, ArgTextarea],
  template: `
    <div class="doc-stack">
      <arg-field label="Observações" hint="Alergias, medicamentos em uso, comportamento.">
        <textarea arg-textarea rows="4"></textarea>
      </arg-field>
    </div>
  `,
  styles: `
    .doc-stack {
      max-width: 24rem;
    }
  `,
})
export class InputTextareaExample {}
