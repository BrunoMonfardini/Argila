import { Component } from '@angular/core';
import { ArgBadge } from '../badge';

@Component({
  selector: 'doc-badge-tones-example',
  imports: [ArgBadge],
  template: `
    <span arg-badge>Rascunho</span>
    <span arg-badge tone="primary">Novo</span>
    <span arg-badge tone="info">Agendado</span>
    <span arg-badge tone="success">Confirmado</span>
    <span arg-badge tone="warning">Aguardando pagamento</span>
    <span arg-badge tone="danger">Cancelado</span>
  `,
})
export class BadgeTonesExample {}
