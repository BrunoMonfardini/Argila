import { Component } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_CHOICE } from '../../lib/choice/choice';
import { ARG_FIELD } from '../../lib/field/field';
import { ArgInput } from '../../lib/input/input';
import { ArgSelect } from '../../lib/select/select';

/** Cadastro curto: um campo por linha, rótulo sempre visível e a ação no fim. */
@Component({
  selector: 'doc-pattern-data-entry-form',
  imports: [ArgButton, ARG_FIELD, ArgInput, ArgSelect],
  template: `
    <form class="doc-stack" (submit)="$event.preventDefault()">
      <arg-field label="Nome do pet" required>
        <input arg-input autocomplete="off" />
      </arg-field>
      <arg-field label="Espécie">
        <select arg-select>
          <option>Cão</option>
          <option>Gato</option>
          <option>Outro</option>
        </select>
      </arg-field>
      <arg-field label="Data de nascimento" hint="Se não souber, deixe em branco">
        <input arg-input type="date" />
      </arg-field>
      <button arg-button type="submit">Cadastrar pet</button>
    </form>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-4);
      justify-items: start;
      max-width: 22rem;
    }

    arg-field {
      width: 100%;
    }
  `,
})
export class DataEntryFormExample {}

/** Poucas opções à vista: escolha única com rádio, em vez de lista suspensa. */
@Component({
  selector: 'doc-pattern-data-entry-choice',
  imports: [ARG_CHOICE],
  template: `
    <arg-choice-group label="Porte">
      <label arg-choice><input type="radio" name="porte" arg-radio checked /> Pequeno</label>
      <label arg-choice><input type="radio" name="porte" arg-radio /> Médio</label>
      <label arg-choice><input type="radio" name="porte" arg-radio /> Grande</label>
    </arg-choice-group>
  `,
})
export class DataEntryChoiceExample {}
