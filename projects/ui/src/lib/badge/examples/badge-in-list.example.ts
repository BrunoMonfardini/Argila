import { Component } from '@angular/core';
import { ARG_LIST } from '../../list/list';
import { ArgBadge } from '../badge';

@Component({
  selector: 'doc-badge-in-list-example',
  imports: [ARG_LIST, ArgBadge],
  template: `
    <ul arg-list divided bordered>
      <li arg-list-item>
        <span arg-list-title>Thor · 14h</span>
        <span arg-list-description>Banho e tosa</span>
        <span arg-list-trailing><span arg-badge tone="success">Confirmado</span></span>
      </li>
      <li arg-list-item>
        <span arg-list-title>Mel · 15h30</span>
        <span arg-list-description>Consulta</span>
        <span arg-list-trailing><span arg-badge tone="warning">Aguardando pagamento</span></span>
      </li>
    </ul>
  `,
  styles: `
    ul {
      flex: 1 1 100%;
      max-width: 28rem;
    }
  `,
})
export class BadgeInListExample {}
