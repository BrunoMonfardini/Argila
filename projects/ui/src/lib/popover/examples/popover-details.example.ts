import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgLink } from '../../link/link';
import { ARG_POPOVER } from '../popover';

/** Conteúdo livre e interativo. Clique fora ou Esc fecham, e o foco volta ao botão. */
@Component({
  selector: 'doc-popover-details-example',
  imports: [ARG_POPOVER, ArgButton, ArgLink],
  template: `
    <button arg-button variant="secondary" [argPopoverTrigger]="details">Thor</button>
    <arg-popover #details label="Detalhes de Thor">
      <div class="doc-popover">
        <strong>Thor</strong>
        <span>Golden retriever, 4 anos · 32 kg</span>
        <span>Alergia a shampoo com perfume.</span>
        <a arg-link href="#ficha" (click)="$event.preventDefault()">Ver ficha completa</a>
        <button arg-button size="sm" (click)="details.hide()">Agendar banho</button>
      </div>
    </arg-popover>
  `,
  styles: `
    .doc-popover {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
    }
  `,
})
export class PopoverDetailsExample {}
