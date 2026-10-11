import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ArgDialogLayout, ArgDialogSize } from './dialog-ref';

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
  styleUrls: ['./dialog.css', '../drawer/drawer.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
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
  readonly layout = signal<ArgDialogLayout>('dialog');

  protected readonly classes = computed(() => {
    const base = `arg-dialog arg-dialog--${this.size()}`;
    const layout = this.layout();
    return layout === 'dialog' ? base : `${base} arg-drawer arg-${layout}`;
  });
}
