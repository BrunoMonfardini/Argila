import { Directive, inject } from '@angular/core';
import { ArgDialogRef } from './dialog-ref';

/**
 * Título do diálogo: dá nome a ele (`aria-labelledby`). Use dentro do
 * componente aberto por `ArgDialog.open()`:
 *
 * ```html
 * <h2 argDialogTitle>Editar pet</h2>
 * <p argDialogDescription>As mudanças valem para os próximos agendamentos.</p>
 * <div arg-dialog-content>…</div>
 * <footer arg-dialog-actions>…</footer>
 * ```
 */
@Directive({
  selector: '[argDialogTitle]',
  host: { class: 'arg-dialog__title', '[id]': 'ref.titleId' },
})
export class ArgDialogTitle {
  protected readonly ref = inject(ArgDialogRef);
}

/** Texto principal do diálogo, lido pelo leitor de tela ao abrir (`aria-describedby`). */
@Directive({
  selector: '[argDialogDescription]',
  host: { class: 'arg-dialog__description', '[id]': 'ref.descriptionId' },
})
export class ArgDialogDescription {
  protected readonly ref = inject(ArgDialogRef);
}
