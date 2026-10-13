import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArgFieldControl } from '../field/field';
import { ArgValueControlBase } from '../internal/value-control';

/** Até 13 dígitos (R$ 99.999.999.999,99): seguro como inteiro em JavaScript. */
const MAX_DIGITS = 13;

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Centavos (inteiro) em reais: `123456` → "R$ 1.234,56". `null` vira texto vazio. */
export function formatCents(cents: number | null): string {
  return cents === null ? '' : BRL.format(cents / 100);
}

/** Texto digitado ou colado em centavos: só os dígitos contam. Sem dígitos, `null`. */
export function parseCents(text: string): number | null {
  const digits = text
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '')
    .slice(0, MAX_DIGITS);
  return digits ? Number(digits) : null;
}

/**
 * Valor em reais sobre o `<input>` nativo. Os dígitos entram pela direita,
 * como numa calculadora: digitar 1, 2, 3, 4, 5 mostra "R$ 123,45". O valor
 * do formulário é um **inteiro em centavos** (`12345`), ou `null` vazio,
 * para evitar erros de arredondamento com dinheiro.
 *
 * ```html
 * <arg-field label="Valor do banho">
 *   <input arg-currency [formControl]="preco" />
 * </arg-field>
 * ```
 *
 * Funciona com Reactive Forms (`formControl`), com formulários de signals
 * (`[formField]`) e com `[(value)]`.
 */
@Component({
  selector: 'input[arg-currency]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrls: ['../input/control.css'],
  styles: ':host { font-variant-numeric: tabular-nums; }',
  hostDirectives: [ArgFieldControl],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArgCurrencyInput), multi: true },
  ],
  host: {
    class: 'arg-input arg-currency',
    type: 'text',
    inputmode: 'numeric',
    autocomplete: 'off',
    '[attr.placeholder]': 'placeholder()',
    '(input)': 'onInput()',
  },
})
export class ArgCurrencyInput extends ArgValueControlBase<number | null> {
  /** Valor em centavos (inteiro); `null` quando vazio. */
  readonly value = model<number | null>(null);
  /** Texto de exemplo com o campo vazio. */
  readonly placeholder = input('R$ 0,00');

  constructor() {
    super();
    // Valor vindo de fora (formulário ou [value]): mostra formatado
    effect(() => this.render(this.value()));
  }

  protected onInput(): void {
    const cents = parseCents(this.element.value);
    this.value.set(cents);
    this.render(cents);
    // O cursor fica sempre no fim: os dígitos entram pela direita
    const end = this.element.value.length;
    this.element.setSelectionRange(end, end);
    this.notifyChange(cents);
  }

  writeValue(value: number | null): void {
    this.value.set(Number.isInteger(value) ? value : null);
  }

  private render(cents: number | null): void {
    const text = formatCents(cents);
    if (this.element.value !== text) this.element.value = text;
  }
}
