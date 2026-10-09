import {
  Directive,
  ElementRef,
  InputSignal,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';

export type ArgButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ArgButtonSize = 'sm' | 'md' | 'lg';

/**
 * Comportamento comum aos botões do Argila (`arg-button`, `arg-icon-button`):
 * variantes, tamanhos e os estados desabilitado e carregando, em `<button>` e
 * em `<a>`. Cada botão declara a própria `variant`, porque o padrão muda.
 */
@Directive({
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
export abstract class ArgButtonBase {
  abstract readonly variant: InputSignal<ArgButtonVariant>;
  /** Altura do botão; `lg` atinge a área de toque recomendada (48 px). */
  readonly size = input<ArgButtonSize>('md');
  /** Desabilita o botão; em `<a>`, vira `aria-disabled` e sai da ordem de tabulação. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Mostra um indicador de progresso e bloqueia novas interações. */
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly isNativeButton =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON';

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly hostClasses = computed(() => [
    `arg-button--${this.variant()}`,
    `arg-button--${this.size()}`,
    this.loading() ? 'arg-button--loading' : '',
    ...this.modifierClasses(),
  ]);

  /** Classes extras de cada tipo de botão, ex.: largura total. */
  protected modifierClasses(): string[] {
    return [];
  }

  protected haltWhenDisabled(event: Event): void {
    // Links não têm `disabled` nativo: impede navegação e outros handlers.
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
