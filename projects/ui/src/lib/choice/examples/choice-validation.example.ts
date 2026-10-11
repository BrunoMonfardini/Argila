import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArgButton } from '../../button/button';
import { ARG_CHOICE } from '../choice';

/** Envie sem escolher para ver o erro do grupo, anunciado para leitores de tela. */
@Component({
  selector: 'doc-choice-validation-example',
  imports: [ARG_CHOICE, ArgButton, ReactiveFormsModule],
  template: `
    <form (submit)="$event.preventDefault(); period.markAsTouched()">
      <arg-choice-group
        label="Período preferido"
        orientation="horizontal"
        required
        [error]="period.touched && period.invalid ? 'Escolha um período.' : null"
      >
        <label arg-choice>
          <input type="radio" arg-radio value="manha" [formControl]="period" />
          Manhã
        </label>
        <label arg-choice>
          <input type="radio" arg-radio value="tarde" [formControl]="period" />
          Tarde
        </label>
        <label arg-choice>
          <input type="radio" arg-radio value="noite" [formControl]="period" />
          Noite
        </label>
      </arg-choice-group>
      <button arg-button type="submit" variant="secondary">Continuar</button>
    </form>
  `,
  styles: `
    form {
      display: grid;
      gap: var(--arg-space-4);
      justify-items: start;
    }
  `,
})
export class ChoiceValidationExample {
  protected readonly period = new FormControl<string | null>(null, Validators.required);
}
