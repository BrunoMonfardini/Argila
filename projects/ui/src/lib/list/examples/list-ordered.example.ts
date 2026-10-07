import { Component } from '@angular/core';
import { ARG_LIST } from '../list';

@Component({
  selector: 'doc-list-ordered-example',
  imports: [ARG_LIST],
  template: `
    <ol arg-list divided bordered style="width: 100%; max-width: 28rem">
      <li arg-list-item>
        <span arg-list-leading aria-hidden="true">1</span>
        <span arg-list-title>Escolha os produtos</span>
      </li>
      <li arg-list-item>
        <span arg-list-leading aria-hidden="true">2</span>
        <span arg-list-title>Informe o endereço</span>
      </li>
      <li arg-list-item>
        <span arg-list-leading aria-hidden="true">3</span>
        <span arg-list-title>Pague e acompanhe</span>
      </li>
    </ol>
  `,
})
export class ListOrderedExample {}
