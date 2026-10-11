import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ARG_POPOVER } from '../popover';

/**
 * O botão está na borda direita e o painel pede `bottom-start` (para a
 * direita): sem espaço, ele vira para o outro lado e continua na tela.
 */
@Component({
  selector: 'doc-popover-edge-example',
  imports: [ARG_POPOVER, ArgButton],
  template: `
    <div class="doc-edge">
      <button arg-button variant="tertiary" [argPopoverTrigger]="help">Como funciona?</button>
    </div>
    <arg-popover #help label="Como funciona o lembrete">
      O tutor recebe uma mensagem um dia antes do horário, com o endereço e o que levar.
    </arg-popover>
  `,
  styles: `
    .doc-edge {
      display: flex;
      flex: 1 1 100%;
      justify-content: flex-end;
    }
  `,
})
export class PopoverEdgeExample {}
