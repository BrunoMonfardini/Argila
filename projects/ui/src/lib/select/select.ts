import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgFieldControl } from '../field/field';

/**
 * Lista de opções sobre o `<select>` nativo, com o visual do `arg-input`. A
 * lista aberta é a do sistema (no celular, o seletor nativo). Funciona com
 * Reactive Forms, formulários de signals e `[value]`; dentro de um
 * `arg-field`, liga-se sozinho ao rótulo, à ajuda e ao erro:
 *
 * ```html
 * <arg-field label="Espécie">
 *   <select arg-select [formControl]="especie">
 *     <option value="" disabled>Escolha</option>
 *     <option value="gato">Gato</option>
 *   </select>
 * </arg-field>
 * ```
 */
@Component({
  selector: 'select[arg-select]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrls: ['../input/control.css', './select.css'],
  hostDirectives: [ArgFieldControl],
  host: { class: 'arg-input arg-select' },
})
export class ArgSelect {}
