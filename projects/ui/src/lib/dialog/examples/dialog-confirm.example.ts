import { Component, inject, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgDialog } from '../dialog';

/** `confirm()` resolve `true` ou `false`. Com `danger`, o foco começa em "Voltar". */
@Component({
  selector: 'doc-dialog-confirm-example',
  imports: [ArgButton],
  template: `
    <button arg-button variant="danger" (click)="cancelAppointment()">Cancelar agendamento</button>
    <button arg-button variant="secondary" (click)="sendReminder()">Enviar lembrete</button>
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
export class DialogConfirmExample {
  private readonly dialog = inject(ArgDialog);
  protected readonly said = signal('');

  protected async cancelAppointment(): Promise<void> {
    const ok = await this.dialog.confirm({
      title: 'Cancelar o agendamento de Thor?',
      message: 'O horário de sexta, às 14h, volta a ficar livre. O tutor recebe um aviso.',
      confirmText: 'Cancelar agendamento',
      tone: 'danger',
    });
    this.said.set(ok ? 'Agendamento cancelado.' : 'Nada mudou.');
  }

  protected async sendReminder(): Promise<void> {
    const ok = await this.dialog.confirm({
      title: 'Enviar lembrete?',
      message: 'Maria Souza recebe uma mensagem sobre o banho de sexta.',
      confirmText: 'Enviar',
    });
    this.said.set(ok ? 'Lembrete enviado.' : 'Nada mudou.');
  }
}
