import {
  ApplicationRef,
  ComponentRef,
  DOCUMENT,
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  createComponent,
  inject,
  isDevMode,
} from '@angular/core';
import { ArgIdGenerator } from '../internal/unique-id';
import { ArgConfirmDialog, ArgConfirmOptions } from './confirm-dialog';
import { ArgDialogContainer } from './dialog-container';
import { ARG_DIALOG_DATA, ArgDialogConfig, ArgDialogLayout, ArgDialogRef } from './dialog-ref';

export { ARG_DIALOG_DATA, ArgDialogRef } from './dialog-ref';
export { ArgDialogDescription, ArgDialogTitle } from './dialog-title';
export type { ArgDialogConfig, ArgDialogSize } from './dialog-ref';
export type { ArgConfirmOptions } from './confirm-dialog';

interface OpenDialog {
  container: ComponentRef<ArgDialogContainer>;
  returnFocus: Element | null;
}

/**
 * Abre diálogos modais sobre o `<dialog>` nativo (`showModal()`): o resto da
 * página fica inerte, o foco fica preso no diálogo e Esc fecha. Ao fechar, o
 * foco volta para o elemento que abriu. Marque com `arg-dialog-focus` o
 * elemento que deve receber o foco ao abrir.
 *
 * ```ts
 * const ref = this.dialog.open(EditarPet, { data: { pet } });
 * const salvo = await ref.closed;
 *
 * const ok = await this.dialog.confirm({
 *   title: 'Cancelar agendamento?',
 *   message: 'O horário volta a ficar livre.',
 *   confirmText: 'Cancelar agendamento',
 *   tone: 'danger',
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ArgDialog {
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly environment = inject(EnvironmentInjector);
  private readonly ids = inject(ArgIdGenerator);
  private readonly open_ = new Map<ArgDialogRef<unknown>, OpenDialog>();

  /**
   * Abre `component` num diálogo modal. `layout` é interno: o `ArgDrawer`
   * usa o mesmo serviço para abrir gavetas.
   */
  open<C, D = unknown, R = unknown>(
    component: Type<C>,
    config: ArgDialogConfig<D> = {},
    layout: ArgDialogLayout = 'dialog',
  ): ArgDialogRef<R> {
    const ref = new ArgDialogRef<R>(this.ids.next('arg-dialog'), (r, result) =>
      this.close(r, result),
    );
    const returnFocus = this.document.activeElement;

    const container = createComponent(ArgDialogContainer, {
      environmentInjector: this.environment,
      hostElement: this.document.createElement('dialog'),
    });
    const dialog = container.instance;
    dialog.size.set(config.size ?? 'md');
    dialog.layout.set(layout);
    dialog.role.set(config.role ?? 'dialog');
    dialog.label.set(config.label ?? null);
    dialog.titleId.set(ref.titleId);
    this.appRef.attachView(container.hostView);
    this.document.body.appendChild(dialog.element);
    container.changeDetectorRef.detectChanges();

    const injector = Injector.create({
      parent: config.injector ?? this.environment,
      providers: [
        { provide: ArgDialogRef, useValue: ref },
        { provide: ARG_DIALOG_DATA, useValue: config.data },
      ],
    });
    dialog.outlet().createComponent(component, { injector });
    container.changeDetectorRef.detectChanges();

    const element = dialog.element;
    if (element.querySelector(`[id="${ref.descriptionId}"]`)) {
      dialog.describedBy.set(ref.descriptionId);
    }
    if (isDevMode() && !config.label && !element.querySelector(`[id="${ref.titleId}"]`)) {
      console.warn(
        '[ArgDialog] Diálogo sem nome: use argDialogTitle num título ou passe { label }.',
      );
    }
    container.changeDetectorRef.detectChanges();

    const dismissable = config.dismissable ?? true;
    // Esc: o navegador dispara "cancel" antes de fechar
    element.addEventListener('cancel', (event) => {
      event.preventDefault();
      if (dismissable) this.close(ref, undefined);
    });
    // Clique no fundo: o alvo é o próprio <dialog>, fora da caixa dele
    element.addEventListener('click', (event) => {
      if (!dismissable || event.target !== element) return;
      const box = element.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!inside) this.close(ref, undefined);
    });

    this.open_.set(ref as ArgDialogRef<unknown>, { container, returnFocus });
    if (typeof element.showModal === 'function') element.showModal();
    else element.setAttribute('open', '');
    // Foco inicial: o elemento marcado com arg-dialog-focus; sem ele, o navegador
    // foca o primeiro elemento focável do diálogo
    element.querySelector<HTMLElement>('[arg-dialog-focus]')?.focus();
    return ref;
  }

  /**
   * Confirmação pronta: título, mensagem e dois botões. Resolve `true` em
   * "Confirmar" e `false` em "Cancelar", Esc ou clique fora.
   */
  async confirm(options: ArgConfirmOptions): Promise<boolean> {
    const ref = this.open<ArgConfirmDialog, ArgConfirmOptions, boolean>(ArgConfirmDialog, {
      data: options,
      size: 'sm',
      role: 'alertdialog',
    });
    return (await ref.closed) === true;
  }

  /** Fecha todos os diálogos abertos, do mais recente ao mais antigo. */
  closeAll(): void {
    for (const ref of [...this.open_.keys()].reverse()) ref.close();
  }

  private close<R>(ref: ArgDialogRef<R>, result: R | undefined): void {
    const entry = this.open_.get(ref as ArgDialogRef<unknown>);
    if (!entry) return;
    this.open_.delete(ref as ArgDialogRef<unknown>);

    const element = entry.container.instance.element;
    if (typeof element.close === 'function') element.close();
    else element.removeAttribute('open');
    this.appRef.detachView(entry.container.hostView);
    entry.container.destroy();
    element.remove();

    // Devolve o foco a quem abriu, se ainda estiver na página
    if (entry.returnFocus instanceof HTMLElement && entry.returnFocus.isConnected) {
      entry.returnFocus.focus();
    }
    ref.settle(result);
  }
}
