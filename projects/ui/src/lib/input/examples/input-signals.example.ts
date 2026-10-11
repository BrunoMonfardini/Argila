import { Component, computed, signal } from '@angular/core';
import { FormField, email, form, required } from '@angular/forms/signals';
import { ARG_FIELD } from '../../field/field';
import { ArgInput } from '../input';

/** Formulário de signals: `[formField]` no `<input>`; o erro vem do estado do campo. */
@Component({
  selector: 'doc-input-signals-example',
  imports: [ARG_FIELD, ArgInput, FormField],
  template: `
    <div class="doc-stack">
      <arg-field label="E-mail" [error]="error()" required>
        <input arg-input type="email" autocomplete="email" [formField]="contact.email" />
      </arg-field>
      <p>Valor: {{ model().email || '(vazio)' }}</p>
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
export class InputSignalsExample {
  protected readonly model = signal({ email: '' });
  protected readonly contact = form(this.model, (path) => {
    required(path.email, { message: 'Informe um e-mail.' });
    email(path.email, { message: 'Use o formato nome@exemplo.com.' });
  });

  protected readonly error = computed(() => {
    const field = this.contact.email();
    return field.touched() && field.invalid() ? (field.errors()[0]?.message ?? null) : null;
  });
}
