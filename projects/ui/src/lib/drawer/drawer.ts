import { Injectable, Type, inject } from '@angular/core';
import { ArgDialog } from '../dialog/dialog';
import { ArgDialogConfig, ArgDialogRef } from '../dialog/dialog-ref';

export interface ArgDrawerConfig<D = unknown> extends Omit<ArgDialogConfig<D>, 'role'> {
  /**
   * Lateral em telas largas: `end` (direita, padrão) para filtros e detalhes,
   * `start` (esquerda) para navegação. Em telas estreitas, a gaveta sobe de baixo.
   * `bottom` sobe de baixo em qualquer largura (bottom sheet), para opções
   * rápidas sobre o que está na tela.
   */
  side?: 'start' | 'end' | 'bottom';
}

/**
 * Gaveta modal: painel preso à lateral da tela no desktop e que sobe de baixo
 * no celular. É o mesmo `<dialog>` do `ArgDialog`: foco preso, Esc e clique
 * fora fecham, o foco volta a quem abriu. O componente usa as mesmas áreas
 * (`argDialogTitle`, `arg-dialog-content`, `arg-dialog-actions`) e fecha com
 * `inject(ArgDialogRef).close(resultado)`.
 *
 * ```ts
 * const ref = this.drawer.open(FiltrosDaAgenda, { data: filtros });
 * const novos = await ref.closed;
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ArgDrawer {
  private readonly dialog = inject(ArgDialog);

  /** Abre `component` numa gaveta. `size`: `sm` (20rem), `md` (24rem, padrão) ou `lg` (32rem). */
  open<C, D = unknown, R = unknown>(
    component: Type<C>,
    config: ArgDrawerConfig<D> = {},
  ): ArgDialogRef<R> {
    const { side = 'end', ...dialogConfig } = config;
    return this.dialog.open<C, D, R>(component, dialogConfig, `drawer-${side}`);
  }
}
