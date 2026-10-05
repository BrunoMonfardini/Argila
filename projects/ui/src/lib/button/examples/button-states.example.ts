import { Component } from '@angular/core';
import { ArgButton } from '../button';

@Component({
  selector: 'doc-button-states-example',
  imports: [ArgButton],
  template: `
    <button arg-button disabled>Desabilitado</button>
    <button arg-button variant="secondary" disabled>Desabilitado</button>
    <button arg-button loading>Salvando</button>
    <a arg-button variant="tertiary" href="#">Link com cara de botão</a>
  `,
})
export class ButtonStatesExample {}
