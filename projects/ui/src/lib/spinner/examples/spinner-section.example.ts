import { Component } from '@angular/core';
import { ArgSpinner } from '../spinner';

@Component({
  selector: 'doc-spinner-section-example',
  imports: [ArgSpinner],
  template: `
    <div
      style="width: 100%; display: grid; place-items: center; gap: var(--arg-space-3);
      min-height: 12rem; color: var(--arg-color-text-muted)"
    >
      <arg-spinner size="lg" label="Carregando pedidos" />
      <span aria-hidden="true">Carregando pedidos…</span>
    </div>
  `,
})
export class SpinnerSectionExample {}
