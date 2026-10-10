import { Component } from '@angular/core';
import { ArgIconButton } from '../icon-button';

@Component({
  selector: 'doc-icon-button-variants-example',
  imports: [ArgIconButton],
  template: `
    <button arg-icon-button icon="plus" label="Adicionar" variant="primary"></button>
    <button arg-icon-button icon="plus" label="Adicionar" variant="secondary"></button>
    <button arg-icon-button icon="plus" label="Adicionar"></button>
    <button arg-icon-button icon="x" label="Remover" variant="danger"></button>
  `,
})
export class IconButtonVariantsExample {}
