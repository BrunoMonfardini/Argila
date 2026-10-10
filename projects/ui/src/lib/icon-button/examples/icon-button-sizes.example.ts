import { Component } from '@angular/core';
import { ArgIconButton } from '../icon-button';

@Component({
  selector: 'doc-icon-button-sizes-example',
  imports: [ArgIconButton],
  template: `
    <button arg-icon-button icon="check" label="Confirmar" variant="secondary" size="sm"></button>
    <button arg-icon-button icon="check" label="Confirmar" variant="secondary" size="md"></button>
    <button arg-icon-button icon="check" label="Confirmar" variant="secondary" size="lg"></button>
  `,
})
export class IconButtonSizesExample {}
