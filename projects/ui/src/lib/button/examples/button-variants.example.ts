import { Component } from '@angular/core';
import { ArgButton } from '../button';

@Component({
  selector: 'doc-button-variants-example',
  imports: [ArgButton],
  template: `
    <button arg-button variant="primary">Primário</button>
    <button arg-button variant="secondary">Secundário</button>
    <button arg-button variant="tertiary">Terciário</button>
    <button arg-button variant="danger">Excluir</button>
  `,
})
export class ButtonVariantsExample {}
