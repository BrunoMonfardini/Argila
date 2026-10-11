import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ArgDialogSize } from './dialog-ref';

/**
 * O `<dialog>` em volta do componente aberto pelo `ArgDialog`. Interno: quem
 * usa o design system não o cria direto.
 *
 * Os estilos não são encapsulados porque as áreas (título, conteúdo, ações)
 * ficam no componente de quem abriu; todos os seletores ficam sob `.arg-dialog`.
 */
@Component({
  selector: 'dialog[arg-dialog-container]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-container #outlet />',
  styleUrl: './dialog.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"arg-dialog arg-dialog--" + size()',
    '[attr.role]': 'role() === "alertdialog" ? "alertdialog" : null',
    '[attr.aria-label]': 'label()',
    '[attr.aria-labelledby]': 'label() ? null : titleId()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-modal]': '"true"',
  },
})
export class ArgDialogContainer {
  readonly outlet = viewChild.required('outlet', { read: ViewContainerRef });
  readonly element = inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;

  readonly size = signal<ArgDialogSize>('md');
  readonly role = signal<'dialog' | 'alertdialog'>('dialog');
  readonly label = signal<string | null>(null);
  readonly titleId = signal<string | null>(null);
  readonly describedBy = signal<string | null>(null);
}
