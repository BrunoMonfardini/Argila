import { Component } from '@angular/core';
import { ARG_LIST } from '../list';

@Component({
  selector: 'doc-list-interactive-example',
  imports: [ARG_LIST],
  template: `
    <ul arg-list divided bordered style="width: 100%; max-width: 28rem">
      <li arg-list-item>
        <a arg-list-action href="#pedido-1042">
          <span arg-list-title>Pedido #1042</span>
          <span arg-list-description>3 itens · Maria Souza</span>
          <span arg-list-trailing>R$ 289,90 ›</span>
        </a>
      </li>
      <li arg-list-item>
        <a arg-list-action href="#pedido-1041">
          <span arg-list-title>Pedido #1041</span>
          <span arg-list-description>1 item · João Pereira</span>
          <span arg-list-trailing>R$ 59,00 ›</span>
        </a>
      </li>
      <li arg-list-item>
        <button arg-list-action type="button" disabled>
          <span arg-list-title>Pedido #1040</span>
          <span arg-list-description>Cancelado</span>
        </button>
      </li>
    </ul>
  `,
})
export class ListInteractiveExample {}
