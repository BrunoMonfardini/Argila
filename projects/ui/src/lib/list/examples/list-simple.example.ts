import { Component } from '@angular/core';
import { ARG_LIST } from '../list';

@Component({
  selector: 'doc-list-simple-example',
  imports: [ARG_LIST],
  template: `
    <ul arg-list divided style="width: 100%; max-width: 28rem">
      <li arg-list-item><span arg-list-title>Pedidos</span></li>
      <li arg-list-item><span arg-list-title>Clientes</span></li>
      <li arg-list-item><span arg-list-title>Relatórios</span></li>
    </ul>
  `,
})
export class ListSimpleExample {}
