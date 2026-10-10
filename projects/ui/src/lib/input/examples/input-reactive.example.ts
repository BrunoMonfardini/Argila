import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ARG_FIELD } from '../../field/field';
import { ArgInput } from '../input';

/** Reactive Forms: o `formControl` vai direto no `<input>`. */
@Component({
  selector: 'doc-input-reactive-example',
  imports: [ARG_FIELD, ArgInput, ReactiveFormsModule],
  template: `
    <div class="doc-stack">
      <arg-field
        label="Nome do tutor"
        [error]="name.touched && name.invalid ? 'Informe o nome do tutor.' : null"
        required
      >
        <input arg-input autocomplete="name" [formControl]="name" />
      </arg-field>
      <p>Valor: {{ value() || '(vazio)' }}</p>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-2);
      max-width: 24rem;
    }
  `,
})
export class InputReactiveExample {
  protected readonly name = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });
  protected readonly value = toSignal(this.name.valueChanges, { initialValue: '' });
}
