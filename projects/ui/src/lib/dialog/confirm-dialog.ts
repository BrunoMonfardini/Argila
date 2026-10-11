import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ArgButton } from '../button/button';
import { ARG_DIALOG_DATA, ArgDialogRef } from './dialog-ref';
import { ArgDialogDescription, ArgDialogTitle } from './dialog-title';

export interface ArgConfirmOptions {
  /** Pergunta curta: "Cancelar agendamento?". */
  title: string;
  /** O que acontece se confirmar: "O horário volta a ficar livre." */
  message?: string;
  /** Verbo da ação, não "OK": "Cancelar agendamento". O padrão é "Confirmar". */
  confirmText?: string;
  /** O padrão é "Voltar", para não confundir com uma ação de cancelar. */
  cancelText?: string;
  /** `danger` pinta o botão de vermelho e põe o foco inicial em "Voltar". */
  tone?: 'default' | 'danger';
}

/** Conteúdo do `ArgDialog.confirm()`. Interno. */
@Component({
  selector: 'arg-confirm-dialog',
  imports: [ArgButton, ArgDialogDescription, ArgDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 argDialogTitle>{{ options.title }}</h2>
    @if (options.message) {
      <p argDialogDescription>{{ options.message }}</p>
    }
    <footer arg-dialog-actions>
      <button
        arg-button
        variant="secondary"
        [attr.arg-dialog-focus]="danger ? '' : null"
        (click)="ref.close(false)"
      >
        {{ options.cancelText ?? 'Voltar' }}
      </button>
      <button
        arg-button
        [variant]="danger ? 'danger' : 'primary'"
        [attr.arg-dialog-focus]="danger ? null : ''"
        (click)="ref.close(true)"
      >
        {{ options.confirmText ?? 'Confirmar' }}
      </button>
    </footer>
  `,
})
export class ArgConfirmDialog {
  protected readonly ref = inject<ArgDialogRef<boolean>>(ArgDialogRef);
  protected readonly options = inject(ARG_DIALOG_DATA) as ArgConfirmOptions;
  protected readonly danger = this.options.tone === 'danger';
}
