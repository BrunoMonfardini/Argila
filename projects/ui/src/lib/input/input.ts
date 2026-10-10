import { ChangeDetectionStrategy, Component } from '@angular/core';
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
