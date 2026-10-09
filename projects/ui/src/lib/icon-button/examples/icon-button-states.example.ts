import { Component } from '@angular/core';
import { ArgIconButton } from '../icon-button';

@Component({
  selector: 'doc-icon-button-states-example',
  imports: [ArgIconButton],
  template: `
    <button arg-icon-button icon="plus" label="Adicionar" variant="secondary" disabled></button>
    <button arg-icon-button icon="check" label="Salvando" variant="primary" loading></button>
    <a arg-icon-button icon="x" label="Voltar ao início" href="#"></a>
  `,
})
export class IconButtonStatesExample {}
