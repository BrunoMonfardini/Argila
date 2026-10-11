import { Component, inject } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgDialogRef, ArgDialogTitle } from '../../dialog/dialog';
import { ArgIconButton } from '../../icon-button/icon-button';
import { ARG_LIST } from '../../list/list';
import { ArgDrawer } from '../drawer';

/** Menu de navegação numa gaveta à esquerda. */
@Component({
  selector: 'doc-navigation-drawer',
  imports: [ArgDialogTitle, ArgIconButton, ARG_LIST],
  template: `
    <header class="doc-head">
      <h2 argDialogTitle>Menu</h2>
      <button arg-icon-button icon="x" label="Fechar menu" (click)="ref.close()"></button>
    </header>
    <nav arg-dialog-content aria-label="Principal">
      <ul arg-list>
        @for (page of pages; track page) {
          <li arg-list-item>
            <a arg-list-action href="#" (click)="$event.preventDefault(); ref.close()">
              <span arg-list-title>{{ page }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    .doc-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--arg-space-2);
    }
  `,
})
export class NavigationDrawer {
  protected readonly ref = inject(ArgDialogRef);
  protected readonly pages = ['Agenda', 'Clientes', 'Pets', 'Financeiro', 'Configurações'];
}

@Component({
  selector: 'doc-drawer-navigation-example',
  imports: [ArgButton],
  template: `<button arg-button variant="secondary" (click)="open()">Abrir menu</button>`,
})
export class DrawerNavigationExample {
  private readonly drawer = inject(ArgDrawer);

  protected open(): void {
    this.drawer.open(NavigationDrawer, { side: 'start', size: 'sm' });
  }
}
