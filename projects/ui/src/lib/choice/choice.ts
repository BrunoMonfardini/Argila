import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { announceErrors } from '../internal/announce-errors';
import { injectUniqueId } from '../internal/unique-id';

export type ArgChoiceGroupOrientation = 'vertical' | 'horizontal';

/**
 * Grupo de opções (radios ou checkboxes) com título, ajuda e erro, sobre
 * `<fieldset>` e `<legend>`. Dá um `name` comum aos radios de dentro: o
 * navegador então move a seleção pelas setas e o grupo vira uma única parada
 * de Tab.
 *
 * ```html
 * <arg-choice-group label="Espécie" [error]="erro()">
 *   <label arg-choice><input type="radio" arg-radio value="gato" /> Gato</label>
 *   <label arg-choice><input type="radio" arg-radio value="cachorro" /> Cachorro</label>
 * </arg-choice-group>
 * ```
 */
@Component({
  selector: 'arg-choice-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './choice-group.html',
  styleUrl: './choice-group.css',
  // Sem encapsulamento: o layout alcança as opções projetadas; todo seletor começa em .arg-choice-group
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'arg-choice-group',
    '[class.arg-choice-group--horizontal]': 'orientation() === "horizontal"',
    '[class.arg-choice-group--invalid]': '!!error()',
  },
})
export class ArgChoiceGroup {
  /** Pergunta ou título do grupo, ex.: "Espécie". Vira a `<legend>`. */
  readonly label = input.required<string>();
  /** Ajuda abaixo do título. */
  readonly hint = input<string>();
  /** Mensagem de erro do grupo; vazia quando válido. Anunciada quando aparece. */
  readonly error = input<string | null>();
  /** Marca o grupo como obrigatório: asterisco visual e `aria-required` nos radios. */
  readonly required = input(false, { transform: booleanAttribute });
  /** Opções uma abaixo da outra (padrão) ou lado a lado. */
  readonly orientation = input<ArgChoiceGroupOrientation>('vertical');
  /** `name` comum dos radios; sem ele, um é gerado. */
  readonly name = input<string>();

  protected readonly hintId = injectUniqueId('arg-choice-hint');
  protected readonly errorId = injectUniqueId('arg-choice-error');
  private readonly generatedName = injectUniqueId('arg-choice');

  readonly groupName = computed(() => this.name() || this.generatedName);
  protected readonly describedBy = computed(
    () =>
      [this.hint() ? this.hintId : '', this.error() ? this.errorId : '']
        .filter(Boolean)
        .join(' ') || null,
  );

  constructor() {
    announceErrors(this.error, this.label);
  }
}

/**
 * Checkbox nativo com o visual do Argila. Funciona com Reactive Forms,
 * formulários de signals e `[checked]`. Use dentro de um `label[arg-choice]`.
 */
@Component({
  selector: 'input[type=checkbox][arg-checkbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './choice-input.css',
  host: {
    class: 'arg-checkbox',
    '[indeterminate]': 'indeterminate()',
    '[attr.aria-invalid]': 'group?.error() ? "true" : null',
  },
})
export class ArgCheckbox {
  /** Parcialmente marcado, ex.: "selecionar todos" quando só alguns estão marcados. */
  readonly indeterminate = input(false, { transform: booleanAttribute });

  protected readonly group = inject(ArgChoiceGroup, { optional: true });
}

/**
 * Radio nativo com o visual do Argila. Dentro de um `arg-choice-group`,
 * recebe o `name` do grupo (se não tiver um próprio).
 */
@Component({
  selector: 'input[type=radio][arg-radio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './choice-input.css',
  host: {
    class: 'arg-radio',
    '[attr.name]': 'ownName ?? group?.groupName() ?? null',
    '[attr.aria-invalid]': 'group?.error() ? "true" : null',
    '[attr.aria-required]': 'group?.required() ? "true" : null',
  },
})
export class ArgRadio {
  protected readonly group = inject(ArgChoiceGroup, { optional: true });
  /** O `name` escrito no próprio radio vence o do grupo. */
  protected readonly ownName =
    inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement.getAttribute('name');
}

/**
 * Interruptor liga/desliga sobre um checkbox nativo com `role="switch"`.
 * Para ajustes que valem na hora, como "Lembrete por SMS".
 */
@Component({
  selector: 'input[type=checkbox][arg-switch]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './switch.css',
  host: {
    class: 'arg-switch',
    role: 'switch',
  },
})
export class ArgSwitch {}

/**
 * Rótulo de uma opção: o controle e o texto ficam lado a lado, e clicar no
 * texto marca a opção.
 *
 * ```html
 * <label arg-choice><input type="checkbox" arg-checkbox /> Aceito os termos</label>
 * ```
 */
@Component({
  selector: 'label[arg-choice]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './choice-label.css',
  host: { class: 'arg-choice' },
})
export class ArgChoice {}

/** Tudo o que os controles de escolha usam: `imports: [ARG_CHOICE]`. */
export const ARG_CHOICE = [ArgChoiceGroup, ArgCheckbox, ArgRadio, ArgSwitch, ArgChoice] as const;
