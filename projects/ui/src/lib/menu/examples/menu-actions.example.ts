import { Component, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgDivider } from '../../divider/divider';
import { ARG_MENU } from '../menu';

/**
 * Teclado: Enter, Espaço ou seta para baixo abrem; setas, Home e End andam;
 * digite "d" para ir a "Duplicar"; Esc fecha e devolve o foco ao botão.
 */
@Component({
  selector: 'doc-menu-actions-example',
  imports: [ARG_MENU, ArgButton, ArgDivider],
  template: `
    <button arg-button variant="secondary" [argMenuTrigger]="actions">Ações do agendamento</button>
    <arg-menu #actions>
      <button arg-menu-item (click)="said.set('Remarcando')">Remarcar</button>
      <button arg-menu-item (click)="said.set('Duplicado para a próxima semana')">Duplicar</button>
      <button arg-menu-item (click)="said.set('Lembrete enviado')">Enviar lembrete</button>
      <button arg-menu-item disabled>Cobrar (já pago)</button>
      <hr arg-divider />
      <button arg-menu-item tone="danger" (click)="said.set('Agendamento cancelado')">
        Cancelar agendamento
      </button>
    </arg-menu>
    <p class="doc-said" role="status">{{ said() }}</p>
  `,
  styles: `
    .doc-said {
      flex: 1 1 100%;
      min-height: 1.5em;
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class MenuActionsExample {
  protected readonly said = signal('');
}
