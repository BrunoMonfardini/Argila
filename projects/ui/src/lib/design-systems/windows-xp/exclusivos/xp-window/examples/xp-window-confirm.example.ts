import { Component, signal } from '@angular/core';
import { ArgButton } from '../../../../../button/button';
import { ArgXpWindow } from '../xp-window';

/** Uma janela de confirmação, como o modal da referência; fechar a esconde. */
@Component({
  selector: 'doc-xp-window-confirm-example',
  imports: [ArgXpWindow, ArgButton],
  template: `
    @if (open()) {
      <section
        arg-xp-window
        title="Confirmar ação"
        [controls]="['close']"
        (closed)="open.set(false)"
      >
        <p>Deseja aplicar as alterações?</p>
        <div class="actions">
          <button arg-button (click)="open.set(false)">OK</button>
          <button arg-button variant="secondary" (click)="open.set(false)">Cancelar</button>
        </div>
      </section>
    } @else {
      <button arg-button variant="secondary" (click)="open.set(true)">
        Abrir a janela de novo
      </button>
    }
  `,
  styles: `
    section {
      max-width: 22rem;
    }

    .actions {
      display: flex;
      gap: var(--arg-space-2);
      justify-content: flex-end;
    }
  `,
})
export class XpWindowConfirmExample {
  readonly open = signal(true);
}
