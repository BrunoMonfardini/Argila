import { Component } from '@angular/core';
import { ARG_FIELD } from '../../field/field';
import { ArgInput } from '../input';

@Component({
  selector: 'doc-input-states-example',
  imports: [ARG_FIELD, ArgInput],
  template: `
    <div class="doc-grid">
      <arg-field label="Normal">
        <input arg-input placeholder="Ex.: Thor" />
      </arg-field>
      <arg-field label="Com erro" error="Informe o nome do pet.">
        <input arg-input />
      </arg-field>
      <arg-field label="Desabilitado">
        <input arg-input value="Agendamento confirmado" disabled />
      </arg-field>
      <arg-field label="Somente leitura" hint="Gerado pelo sistema.">
        <input arg-input value="#1042" readonly />
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
export class InputStatesExample {}
