import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { ArgFieldControl } from '../field/field';

/**
 * Campo de texto sobre o `<input>` nativo. Funciona com Reactive Forms
 * (`formControl`), com formulários de signals (`[formField]`) e com
 * `[value]`/`(input)`. Dentro de um `arg-field`, liga-se sozinho ao rótulo,
 * à ajuda e ao erro:
 *
 * ```html
 * <arg-field label="E-mail" [error]="erro()">
 *   <input arg-input type="email" [formControl]="email" />
 * </arg-field>
 * ```
 *
 * Estados vêm de atributos: `disabled`, `readonly` e `aria-invalid="true"`
 * (que o `arg-field` põe quando há erro).
 */
@Component({
  selector: 'input[arg-input]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './control.css',
  hostDirectives: [ArgFieldControl],
  host: { class: 'arg-input' },
})
export class ArgInput {}

/**
 * Texto longo sobre o `<textarea>` nativo, com o mesmo visual e os mesmos
 * estados do `arg-input`:
 *
 * ```html
 * <textarea arg-textarea rows="4" [formControl]="observacoes"></textarea>
 * ```
 */
@Component({
  selector: 'textarea[arg-textarea]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrls: ['./control.css', './textarea.css'],
  hostDirectives: [ArgFieldControl],
  host: { class: 'arg-input arg-textarea' },
})
export class ArgTextarea {}

/**
 * Junta um campo e um botão de ação no fim, numa peça só: buscar, adicionar,
 * limpar. O botão é um `arg-icon-button` com `argInputAction`, com nome
 * próprio (o `label`) e na ordem do Tab, depois do campo.
 *
 * ```html
 * <arg-field label="Adicionar serviço">
 *   <arg-input-group>
 *     <input arg-input [formControl]="servico" />
 *     <button arg-icon-button argInputAction icon="plus" label="Adicionar"></button>
 *   </arg-input-group>
 * </arg-field>
 * ```
 */
@Component({
  selector: 'arg-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './input-group.css',
  // O CSS junta o campo e o botão projetados: todo seletor fica sob .arg-input-group
  encapsulation: ViewEncapsulation.None,
  host: { class: 'arg-input-group' },
})
export class ArgInputGroup {}

/** Marca o botão de ação de um `arg-input-group`, que se encosta no fim do campo. */
@Directive({
  selector: '[argInputAction]',
  host: { class: 'arg-input-action' },
})
export class ArgInputAction {}

/** O agrupador e a ação, para importar de uma vez: `imports: [ARG_INPUT_GROUP]`. */
export const ARG_INPUT_GROUP = [ArgInputGroup, ArgInputAction] as const;
