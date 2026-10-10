import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { ArgAnnouncer } from '../internal/announcer';
import { injectUniqueId } from '../internal/unique-id';

/**
 * Campo de formulário com rótulo, texto de ajuda e mensagem de erro, ligados
 * ao controle por ids. Marque o controle com `argFieldControl`:
 *
 * ```html
 * <arg-field label="E-mail" hint="Usamos para enviar a confirmação." [error]="erroEmail()">
 *   <input argFieldControl type="email" formControlName="email" />
 * </arg-field>
 * ```
 *
 * Quando o erro aparece, ele é anunciado para leitores de tela.
 */
@Component({
  selector: 'arg-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field.html',
  styleUrl: './field.css',
  // Sem encapsulamento: o estilo base alcança o controle projetado; todo seletor começa em .arg-field
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'arg-field',
    '[class.arg-field--invalid]': 'invalid()',
  },
})
export class ArgField {
  /** Rótulo do campo: diga o que preencher, ex.: "E-mail". */
  readonly label = input.required<string>();
  /** Ajuda abaixo do rótulo: formato esperado ou para que serve o dado. */
  readonly hint = input<string>();
  /** Mensagem de erro; vazia quando o campo está válido. Diga como corrigir. */
  readonly error = input<string | null>();
  /** Marca o campo como obrigatório: asterisco visual e `aria-required` no controle. */
  readonly required = input(false, { transform: booleanAttribute });

  protected readonly hintId = injectUniqueId('arg-field-hint');
  protected readonly errorId = injectUniqueId('arg-field-error');
  private readonly generatedControlId = injectUniqueId('arg-field-control');

  /** Id do controle: o que ele já tinha ou um gerado. Definido pelo `argFieldControl`. */
  readonly controlId = signal(this.generatedControlId);
  readonly invalid = computed(() => !!this.error());
  /** Ids da ajuda e do erro, na ordem de leitura, para o `aria-describedby` do controle. */
  readonly describedBy = computed(
    () =>
      [this.hint() ? this.hintId : '', this.invalid() ? this.errorId : '']
        .filter(Boolean)
        .join(' ') || null,
  );

  private readonly announcer = inject(ArgAnnouncer);

  constructor() {
    let previous: string | null | undefined;
    let first = true;
    effect(() => {
      const error = this.error();
      // O erro que já vem na primeira renderização chega pelo aria-describedby, no foco
      if (!first && error && error !== previous) {
        untracked(() => this.announcer.announce(`${this.label()}: ${error}`));
      }
      previous = error;
      first = false;
    });
  }

  /** Chamado pelo `argFieldControl`, que mantém o id que o controle já tinha. */
  useControlId(id: string | null): string {
    if (id) this.controlId.set(id);
    return this.controlId();
  }
}

/**
 * Liga um controle nativo (`input`, `select`, `textarea`) ao `arg-field` em
 * volta: id, `aria-describedby`, `aria-invalid` e `aria-required`. Fora de
 * um `arg-field`, não faz nada.
 */
@Directive({
  selector: '[argFieldControl]',
  host: {
    '[attr.id]': 'id',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-invalid]': 'field?.invalid() ? "true" : null',
    '[attr.aria-required]': 'field?.required() ? "true" : null',
  },
})
export class ArgFieldControl {
  protected readonly field = inject(ArgField, { optional: true });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly id = this.field
    ? this.field.useControlId(this.element.getAttribute('id'))
    : this.element.getAttribute('id');
}

/** O campo e a diretiva do controle, para importar de uma vez: `imports: [ARG_FIELD]`. */
export const ARG_FIELD = [ArgField, ArgFieldControl] as const;
