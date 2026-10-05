import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { ArgSpinner } from '../spinner/spinner';

export type ArgButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ArgButtonSize = 'sm' | 'md' | 'lg';

/**
 * Botão do Argila. Aplicado como atributo para manter a semântica nativa:
 *
 * ```html
 * <button arg-button variant="primary" (click)="salvar()">Salvar</button>
 * <a arg-button variant="tertiary" href="/ajuda">Ajuda</a>
 * ```
 */
@Component({
  selector: 'button[arg-button], a[arg-button]',
  imports: [ArgSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
    class: 'arg-button',
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'isNativeButton && isDisabled() ? "" : null',
    '[attr.aria-disabled]': '!isNativeButton && isDisabled() ? "true" : null',
    '[attr.tabindex]': '!isNativeButton && isDisabled() ? -1 : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '(click)': 'haltWhenDisabled($event)',
  },
})
export class ArgButton {
  /** Peso visual: uma única ação `primary` por tela; `danger` para ações destrutivas. */
  readonly variant = input<ArgButtonVariant>('primary');
  /** Altura e texto do botão; `lg` atinge a área de toque recomendada (48 px). */
  readonly size = input<ArgButtonSize>('md');
  /** Desabilita o botão; em `<a>`, vira `aria-disabled` e sai da ordem de tabulação. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Mostra um indicador de progresso e bloqueia novas interações. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Ocupa toda a largura do contêiner. */
  readonly fullWidth = input(false, { transform: booleanAttribute });

  protected readonly isNativeButton =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON';

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly hostClasses = computed(() => [
    `arg-button--${this.variant()}`,
    `arg-button--${this.size()}`,
    this.loading() ? 'arg-button--loading' : '',
    this.fullWidth() ? 'arg-button--full-width' : '',
  ]);

  protected haltWhenDisabled(event: Event): void {
    // Links não têm `disabled` nativo: impede navegação e outros handlers.
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
