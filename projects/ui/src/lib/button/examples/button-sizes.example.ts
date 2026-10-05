import { Component } from '@angular/core';
import { ArgButton } from '../button';

@Component({
  selector: 'doc-button-sizes-example',
  imports: [ArgButton],
  template: `
    <button arg-button size="sm">Pequeno</button>
    <button arg-button size="md">Médio</button>
    <button arg-button size="lg">Grande</button>
  `,
})
export class ButtonSizesExample {}
