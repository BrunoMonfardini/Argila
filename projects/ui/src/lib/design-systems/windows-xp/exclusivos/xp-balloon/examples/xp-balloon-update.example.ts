import { Component, signal } from '@angular/core';
import { ArgButton } from '../../../../../button/button';
import { ArgXpBalloon } from '../xp-balloon';

/** O balão aparece depois da ação, e o leitor de tela o anuncia. */
@Component({
  selector: 'doc-xp-balloon-update-example',
  imports: [ArgXpBalloon, ArgButton],
  template: `
    <div class="stack">
      @if (done()) {
        <div arg-xp-balloon>Atualização concluída</div>
      }
      <button arg-button (click)="done.set(true)">Atualizar o sistema</button>
    </div>
  `,
  styles: `
    .stack {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
    }
  `,
})
export class XpBalloonUpdateExample {
  readonly done = signal(false);
}
