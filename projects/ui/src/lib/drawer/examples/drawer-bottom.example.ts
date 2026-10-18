import { Component, inject, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgDialogRef, ArgDialogTitle } from '../../dialog/dialog';
import { ARG_LIST } from '../../list/list';
import { ArgDrawer } from '../drawer';

/** Opções rápidas sobre um agendamento, numa gaveta que sobe de baixo. */
@Component({
  selector: 'doc-booking-actions-drawer',
  imports: [ArgDialogTitle, ARG_LIST],
  template: `
    <h2 argDialogTitle>Agendamento de Thor</h2>
    <div arg-dialog-content>
      <ul arg-list>
        @for (action of actions; track action) {
          <li arg-list-item>
            <button arg-list-action type="button" (click)="ref.close(action)">
              <span arg-list-title>{{ action }}</span>
            </button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class BookingActionsDrawer {
  protected readonly ref = inject<ArgDialogRef<string>>(ArgDialogRef);
  protected readonly actions = ['Remarcar', 'Enviar lembrete', 'Cancelar agendamento'];
}

@Component({
  selector: 'doc-drawer-bottom-example',
  imports: [ArgButton],
  template: `
    <div class="doc-stack">
      <button arg-button variant="secondary" (click)="open()">Opções do agendamento</button>
      @if (chosen(); as chosen) {
        <p role="status">Escolhido: {{ chosen }}</p>
      }
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
    }
  `,
})
export class DrawerBottomExample {
  private readonly drawer = inject(ArgDrawer);
  protected readonly chosen = signal<string | undefined>(undefined);

  protected async open(): Promise<void> {
    const ref = this.drawer.open<BookingActionsDrawer, unknown, string>(BookingActionsDrawer, {
      side: 'bottom',
    });
    const result = await ref.closed;
    if (result) this.chosen.set(result);
  }
}
