import { Component } from '@angular/core';
import { ArgSpinner } from '../spinner';

@Component({
  selector: 'doc-spinner-current-color-example',
  imports: [ArgSpinner],
  template: `
    <p
      style="display: flex; gap: var(--arg-space-2); align-items: center; margin: 0;
      color: var(--arg-color-text-muted)"
    >
      <arg-spinner size="sm" decorative style="--arg-spinner-color: currentColor" />
      Sincronizando…
    </p>
  `,
})
export class SpinnerCurrentColorExample {}
