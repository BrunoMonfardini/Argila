import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  model,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ArgFieldControl } from '../field/field';
import { ArgValueControlBase } from '../internal/value-control';
import {
  ARG_MASK_VALIDATORS,
  ArgMaskKind,
  applyMask,
  caretAfter,
  isComplete,
  significantBefore,
  unmask,
} from './masks';

export * from './masks';

/** Teclado, autocompletar e exemplo de cada tipo. */
const HINTS: Record<ArgMaskKind, { inputmode: string; autocomplete: string; placeholder: string }> =
  {
    cpf: { inputmode: 'numeric', autocomplete: 'off', placeholder: '000.000.000-00' },
    // Texto: o CNPJ alfanumérico tem letras
    cnpj: { inputmode: 'text', autocomplete: 'off', placeholder: '00.000.000/0000-00' },
    cep: { inputmode: 'numeric', autocomplete: 'postal-code', placeholder: '00000-000' },
    phone: { inputmode: 'tel', autocomplete: 'tel-national', placeholder: '(00) 00000-0000' },
  };

/**
 * Campo com máscara para CPF, CNPJ (inclusive o alfanumérico), CEP e
 * telefone, sobre o `<input>` nativo. Mostra o valor com a máscara
 * (`123.456.789-09`); o formulário recebe só os caracteres que contam
 * (`12345678909`).
 *
 * ```html
 * <arg-field label="CPF" [error]="erroDoCpf()">
 *   <input arg-mask="cpf" [formControl]="cpf" />
 * </arg-field>
 * ```
 *
 * Com Reactive Forms, o campo já valida: `{ incomplete: true }` antes do
 * tamanho certo e `{ cpf: true }` (ou `cnpj`, `cep`, `phone`) com os dígitos
 * verificadores errados. Com formulários de signals, use `isValidCpf` e as
 * outras funções num `validate()`.
 */
@Component({
  selector: 'input[arg-mask]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrls: ['../input/control.css'],
  styles: ':host { font-variant-numeric: tabular-nums; }',
  hostDirectives: [ArgFieldControl],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArgMaskedInput), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ArgMaskedInput), multi: true },
  ],
  host: {
    class: 'arg-input arg-mask',
    type: 'text',
    '[attr.inputmode]': 'hints().inputmode',
    '[attr.autocomplete]': 'hints().autocomplete',
    '[attr.autocapitalize]': 'kind() === "cnpj" ? "characters" : null',
    '[attr.placeholder]': 'placeholder() ?? hints().placeholder',
    '(input)': 'onInput()',
  },
})
export class ArgMaskedInput extends ArgValueControlBase<string> implements Validator {
  /** Tipo de máscara: `cpf`, `cnpj`, `cep` ou `phone`. */
  readonly kind = input.required<ArgMaskKind>({ alias: 'arg-mask' });
  /** Valor sem máscara: só dígitos (e letras no CNPJ). Vazio, `''`. */
  readonly value = model('');
  /** Exemplo com o campo vazio. O padrão é a máscara do tipo. */
  readonly placeholder = input<string>();

  protected readonly hints = computed(() => HINTS[this.kind()]);
  private onValidatorChange: () => void = () => undefined;

  constructor() {
    super();
    // Valor vindo de fora (formulário ou [value]): mostra com a máscara
    effect(() => {
      const masked = applyMask(this.kind(), this.value());
      if (this.element.value !== masked) this.element.value = masked;
    });
    // Trocar o tipo muda a validação
    effect(() => {
      this.kind();
      this.onValidatorChange();
    });
  }

  protected onInput(): void {
    const kind = this.kind();
    const typed = this.element.value;
    const before = significantBefore(kind, typed, this.element.selectionStart ?? typed.length);
    const raw = unmask(kind, typed);
    const masked = applyMask(kind, raw);
    this.element.value = masked;
    // O cursor continua depois do mesmo caractere, mesmo editando no meio
    const caret = caretAfter(kind, masked, before);
    this.element.setSelectionRange(caret, caret);
    this.value.set(raw);
    this.notifyChange(raw);
  }

  writeValue(value: string | null): void {
    this.value.set(value ? unmask(this.kind(), value) : '');
  }

  /** Reactive Forms: vazio passa (use `Validators.required`), incompleto e inválido não. */
  validate(control: AbstractControl<string | null>): ValidationErrors | null {
    const kind = this.kind();
    const value = control.value ? unmask(kind, control.value) : '';
    if (!value) return null;
    if (!isComplete(kind, value)) return { incomplete: true };
    return ARG_MASK_VALIDATORS[kind](value) ? null : { [kind]: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
