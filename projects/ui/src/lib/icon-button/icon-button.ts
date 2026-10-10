import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArgButtonBase, ArgButtonVariant } from '../button/button-base';
import { ArgIcon } from '../icon/icon';
import type { ArgIconName } from '../icon/icons.generated';
import { ArgSpinner } from '../spinner/spinner';

/**
 * Botão só com ícone. O `label` é obrigatório: vira o nome acessível do
 * botão, e sem ele o template não compila.
 *
 * ```html
 * <button arg-icon-button icon="x" label="Fechar" (click)="fechar()"></button>
 * ```
 */
@Component({
  selector: 'button[arg-icon-button], a[arg-icon-button]',
  imports: [ArgIcon, ArgSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <arg-spinner class="arg-button__spinner" decorative />
    }
    <span class="arg-button__content"><arg-icon [name]="icon()" [size]="size()" /></span>
  `,
  styleUrls: ['../button/button.css', './icon-button.css'],
  host: {
    '[attr.aria-label]': 'label()',
  },
})
export class ArgIconButton extends ArgButtonBase {
  /** Ícone, pela forma: `x`, `plus`, `trash`. Registre-o com `provideArgIcons`. */
  readonly icon = input.required<ArgIconName>();
  /** O que o botão faz, para leitores de tela: "Fechar", "Excluir agendamento". */
  readonly label = input.required<string>();
  /** Peso visual. O padrão é discreto: botões de ícone costumam ficar em barras de ação. */
  readonly variant = input<ArgButtonVariant>('tertiary');
}
