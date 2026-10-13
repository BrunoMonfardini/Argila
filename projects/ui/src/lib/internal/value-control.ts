import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Integração com formulários comum aos campos com valor próprio
 * (`arg-currency`, `arg-mask`), sobre um `<input>` nativo:
 *
 * - Reactive Forms (`ControlValueAccessor`): mudança, tocado e desabilitado;
 * - formulários de signals: `disabled` como input e `touch` no blur.
 *
 * Cada campo declara o próprio `value` (`model()`) e `writeValue`, porque o
 * tipo do valor muda; e chama `notifyChange` quando a pessoa altera o valor.
 */
@Directive({
  host: {
    // Atributo, não propriedade: a classe-base não conhece o elemento (é sempre um <input>)
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '(blur)': 'onBlur()',
  },
})
export abstract class ArgValueControlBase<T> implements ControlValueAccessor {
  /** Desabilita o campo. Com Reactive Forms, use `formControl.disable()`. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Avisa que a pessoa saiu do campo (formulários de signals marcam como tocado). */
  readonly touch = output<void>();

  protected readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  abstract writeValue(value: T | null): void;

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledByForm.set(disabled);
  }

  /** Avisa o Reactive Forms de um valor novo, vindo da pessoa. */
  protected notifyChange(value: T): void {
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
    this.touch.emit();
  }
}
