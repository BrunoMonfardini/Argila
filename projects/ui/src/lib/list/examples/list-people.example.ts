import { Component } from '@angular/core';
import { ARG_LIST } from '../list';

@Component({
  selector: 'doc-list-people-example',
  imports: [ARG_LIST],
  template: `
    <ul arg-list divided bordered style="width: 100%; max-width: 28rem">
      @for (person of people; track person.email) {
        <li arg-list-item>
          <span
            arg-list-leading
            aria-hidden="true"
            style="display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem;
            border-radius: var(--arg-radius-full); background: var(--arg-color-primary-subtle);
            color: var(--arg-color-primary); font-size: var(--arg-font-size-body-sm);
            font-weight: var(--arg-font-weight-strong)"
          >
            {{ person.initials }}
          </span>
          <span arg-list-title>{{ person.name }}</span>
          <span arg-list-description>{{ person.email }}</span>
          <span arg-list-trailing>{{ person.role }}</span>
        </li>
      }
    </ul>
  `,
})
export class ListPeopleExample {
  protected readonly people = [
    { initials: 'MS', name: 'Maria Souza', email: 'maria@exemplo.com', role: 'Admin' },
    { initials: 'JP', name: 'João Pereira', email: 'joao@exemplo.com', role: 'Editor' },
    { initials: 'AL', name: 'Ana Lima', email: 'ana@exemplo.com', role: 'Leitor' },
  ];
}
