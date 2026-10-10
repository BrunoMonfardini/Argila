import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArgButton } from '../../button/button';
import { ARG_FIELD } from '../field';

/** O erro aparece ao sair do campo e é anunciado para leitores de tela. */
@Component({
  selector: 'doc-field-validation-example',
  imports: [ARG_FIELD, ArgButton, ReactiveFormsModule],
  template: `
    <form (submit)="$event.preventDefault(); email.markAsTouched()">
      <arg-field label="E-mail" hint="Para o lembrete da consulta." [error]="error()" required>
        <input argFieldControl type="email" autocomplete="email" [formControl]="email" />
      </arg-field>
      <button arg-button type="submit" variant="secondary">Continuar</button>
    </form>
  `,
  styles: `
    form {
      display: grid;
      gap: var(--arg-space-4);
      justify-items: start;
      max-width: 24rem;
    }
    arg-field {
      justify-self: stretch;
    }
  `,
})
export class FieldValidationExample {
  protected readonly email = new FormControl('', [Validators.required, Validators.email]);
  private readonly state = toSignal(this.email.events, { initialValue: null });

  protected readonly error = computed(() => {
    this.state();
    if (!this.email.touched || this.email.valid) return null;
    return this.email.hasError('required')
      ? 'Informe um e-mail.'
      : 'Use o formato nome@exemplo.com.';
  });
}
