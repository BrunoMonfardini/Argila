import { Component } from '@angular/core';
import { ARG_FIELD } from '../field';

@Component({
  selector: 'doc-field-basic-example',
  imports: [ARG_FIELD],
  template: `
    <form>
      <arg-field label="Nome do pet" required>
        <input argFieldControl name="pet" autocomplete="off" />
      </arg-field>
      <arg-field label="Telefone do tutor" hint="Com DDD. Enviamos a confirmação por SMS.">
        <input argFieldControl name="telefone" type="tel" autocomplete="tel" />
      </arg-field>
      <arg-field label="Espécie">
        <select argFieldControl name="especie">
          <option>Cachorro</option>
          <option>Gato</option>
          <option>Outro</option>
        </select>
      </arg-field>
      <arg-field label="Observações" hint="Alergias, medicamentos em uso, comportamento.">
        <textarea argFieldControl name="observacoes" rows="3"></textarea>
      </arg-field>
    </form>
  `,
  styles: `
    form {
      display: grid;
      gap: var(--arg-space-4);
      max-width: 24rem;
    }
  `,
})
export class FieldBasicExample {}
