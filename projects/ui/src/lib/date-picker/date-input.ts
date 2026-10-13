import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ViewContainerRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ArgFieldControl } from '../field/field';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconCalendar, argIconChevronLeft, argIconChevronRight } from '../icon/icons.generated';
import { injectUniqueId } from '../internal/unique-id';
import { ArgValueControlBase } from '../internal/value-control';
import { ArgDateToggle } from './date-toggle';
import { ArgDateRules, IsoDate, dateProblem, formatBr, maskBr, parseBr } from './dates';

export * from './dates';

/** Estado do texto digitado, para a validação. */
type Typed = 'empty' | 'incomplete' | 'invalid' | 'complete';

/**
 * Data sobre o `<input>` nativo: digitação direta em "dd/mm/aaaa" e um
 * botão de calendário logo ao lado, que abre a grade do mês num `<dialog>`
 * modal, navegável por teclado. O valor do formulário é a data em ISO
 * (`2026-10-13`), ou `null`.
 *
 * ```html
 * <arg-field label="Data do banho">
 *   <input arg-date [formControl]="data" [min]="hoje" [blocked]="domingo" />
 * </arg-field>
 * ```
 *
 * Com Reactive Forms, o campo já valida: `incomplete`, `date` (não existe),
 * `dateMin`, `dateMax` e `dateBlocked`. Com formulários de signals, use
 * `dateProblem` num `validate()`.
 */
@Component({
  selector: 'input[arg-date]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrls: ['../input/control.css'],
  styles: ':host { font-variant-numeric: tabular-nums; padding-inline-end: var(--arg-space-10); }',
  hostDirectives: [ArgFieldControl],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArgDateInput), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ArgDateInput), multi: true },
  ],
  host: {
    class: 'arg-input arg-date',
    type: 'text',
    inputmode: 'numeric',
    autocomplete: 'off',
    '[attr.placeholder]': 'placeholder()',
    '[style.anchor-name]': 'anchorName',
    '(input)': 'onInput()',
  },
})
export class ArgDateInput extends ArgValueControlBase<IsoDate | null> implements Validator {
  /** Data em ISO (`2026-10-13`); `null` quando vazio ou incompleto. */
  readonly value = model<IsoDate | null>(null);
  /** Primeira data permitida (ISO). Também vem do `min` de um formulário de signals. */
  readonly min = input<IsoDate | undefined>();
  /** Última data permitida (ISO). Também vem do `max` de um formulário de signals. */
  readonly max = input<IsoDate | undefined>();
  /** Dias bloqueados: `(data) => true` não pode ser escolhido (ex.: domingos, feriados). */
  readonly blocked = input<((date: IsoDate) => boolean) | null>(null);
  /** Exemplo com o campo vazio. */
  readonly placeholder = input('dd/mm/aaaa');

  protected readonly anchorName = `--${injectUniqueId('arg-date')}`;
  private readonly typed = signal<Typed>('empty');
  private readonly rules = computed<ArgDateRules>(() => ({
    min: this.min(),
    max: this.max(),
    blocked: this.blocked(),
  }));
  private readonly toggle: ComponentRef<ArgDateToggle>;
  private onValidatorChange: () => void = () => undefined;

  constructor() {
    super();
    inject(ArgIconRegistry).register([argIconCalendar, argIconChevronLeft, argIconChevronRight]);

    // O botão do calendário entra logo depois do <input>, como irmão
    this.toggle = inject(ViewContainerRef).createComponent(ArgDateToggle);
    this.toggle.instance.picked.subscribe((iso) => this.choose(iso));

    effect(() => {
      this.toggle.setInput('value', this.value());
      this.toggle.setInput('rules', this.rules());
      this.toggle.setInput('disabled', this.isDisabled());
      this.toggle.setInput('anchor', this.anchorName);
    });
    // Valor vindo de fora: mostra no formato brasileiro, sem apagar o que a
    // pessoa está digitando
    effect(() => {
      const value = this.value();
      if (value === null && this.typed() !== 'empty' && this.typed() !== 'complete') return;
      const text = formatBr(value);
      if (this.element.value !== text) this.element.value = text;
    });
    // Limites e dias bloqueados mudam a validação
    effect(() => {
      this.rules();
      this.onValidatorChange();
    });
  }

  protected onInput(): void {
    const masked = maskBr(this.element.value);
    this.element.value = masked;
    const parsed = parseBr(masked);
    if (!masked) this.typed.set('empty');
    else if (parsed === null) this.typed.set('incomplete');
    else if (parsed === 'invalid') this.typed.set('invalid');
    else this.typed.set('complete');
    const value = parsed === null || parsed === 'invalid' ? null : parsed;
    this.value.set(value);
    this.notifyChange(value);
  }

  private choose(iso: IsoDate): void {
    this.typed.set('complete');
    this.value.set(iso);
    this.notifyChange(iso);
  }

  writeValue(value: IsoDate | null): void {
    this.typed.set(value ? 'complete' : 'empty');
    this.value.set(value || null);
  }

  /** Reactive Forms: vazio passa (use `Validators.required`). */
  validate(control: AbstractControl<IsoDate | null>): ValidationErrors | null {
    const typed = this.typed();
    if (typed === 'incomplete') return { incomplete: true };
    if (typed === 'invalid') return { date: true };
    const value = control.value;
    if (!value) return null;
    const problem = dateProblem(value, this.rules());
    if (problem === 'min') return { dateMin: { min: this.min() } };
    if (problem === 'max') return { dateMax: { max: this.max() } };
    if (problem === 'blocked') return { dateBlocked: true };
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
