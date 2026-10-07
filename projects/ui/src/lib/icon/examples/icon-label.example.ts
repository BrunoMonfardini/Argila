import { Component } from '@angular/core';
import { ArgIcon } from '../icon';

@Component({
  selector: 'doc-icon-label-example',
  imports: [ArgIcon],
  template: `
    <p style="display: flex; gap: var(--arg-space-2); align-items: center; margin: 0">
      Pagamento
      <arg-icon name="check" label="Confirmado" style="color: var(--arg-color-success)" />
    </p>
  `,
})
export class IconLabelExample {}
