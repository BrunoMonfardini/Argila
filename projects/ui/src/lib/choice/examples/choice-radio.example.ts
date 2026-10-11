import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ARG_CHOICE } from '../choice';

/** As setas mudam a opção dentro do grupo; Tab entra e sai do grupo de uma vez. */
@Component({
  selector: 'doc-choice-radio-example',
  imports: [ARG_CHOICE, ReactiveFormsModule],
  template: `
    <div>
      <arg-choice-group label="Espécie" hint="Use as setas para trocar de opção.">
        <label arg-choice>
          <input type="radio" arg-radio value="cachorro" [formControl]="species" />
          Cachorro
        </label>
        <label arg-choice>
          <input type="radio" arg-radio value="gato" [formControl]="species" />
          Gato
        </label>
        <label arg-choice>
          <input type="radio" arg-radio value="outro" [formControl]="species" />
          Outro
        </label>
      </arg-choice-group>
      <p>Escolhido: {{ species.value }}</p>
    </div>
  `,
})
export class ChoiceRadioExample {
  protected readonly species = new FormControl('gato');
}
