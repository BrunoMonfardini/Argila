import { Component } from '@angular/core';
import { ARG_FIELD } from '../../field/field';
import { ArgInput } from '../input';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-input-anatomy-example',
  imports: [ARG_FIELD, ArgInput],
  template: `
    <arg-field
      label="E-mail"
      hint="Usado para enviar o comprovante"
      error="Informe um e-mail válido"
    >
      <input arg-input type="email" value="maria@" />
    </arg-field>
  `,
  styles: `
    arg-field {
      max-width: 22rem;
    }
  `,
})
export class InputAnatomyExample {}
