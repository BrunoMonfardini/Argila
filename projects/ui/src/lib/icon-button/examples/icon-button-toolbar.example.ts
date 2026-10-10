import { Component } from '@angular/core';
import { ArgIconButton } from '../icon-button';

@Component({
  selector: 'doc-icon-button-toolbar-example',
  imports: [ArgIconButton],
  template: `
    <div role="group" aria-label="Ações do pedido">
      <button arg-icon-button icon="check" label="Marcar pedido como entregue"></button>
      <button arg-icon-button icon="plus" label="Adicionar item ao pedido"></button>
      <button arg-icon-button icon="x" label="Cancelar pedido" variant="danger"></button>
    </div>
  `,
})
export class IconButtonToolbarExample {}
