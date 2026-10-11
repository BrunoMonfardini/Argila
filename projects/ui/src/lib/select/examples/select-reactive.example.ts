import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArgButton } from '../../button/button';
import { ARG_FIELD } from '../../field/field';
import { ArgSelect } from '../select';

/** A primeira opção pede a escolha e não pode ser escolhida de volta. */
@Component({
  selector: 'doc-select-reactive-example',
  imports: [ARG_FIELD, ArgButton, ArgSelect, ReactiveFormsModule],
  template: `
    <form (submit)="$event.preventDefault(); service.markAsTouched()">
      <arg-field
        label="Serviço"
        hint="O preço aparece na próxima etapa."
        required
        [error]="service.touched && service.invalid ? 'Escolha um serviço.' : null"
      >
        <select arg-select [formControl]="service">
          <option value="" disabled>Escolha um serviço</option>
          <option value="banho">Banho</option>
          <option value="tosa">Tosa</option>
          <option value="consulta">Consulta</option>
        </select>
      </arg-field>
      <p>Escolhido: {{ service.value || '(nenhum)' }}</p>
      <button arg-button type="submit" variant="secondary">Continuar</button>
    </form>
  `,
  styles: `
    form {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
      max-width: 24rem;
    }
    arg-field {
      justify-self: stretch;
    }
  `,
})
export class SelectReactiveExample {
  protected readonly service = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });
}
