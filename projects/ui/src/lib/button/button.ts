import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { ArgSpinner } from '../spinner/spinner';
import { ArgButtonBase, ArgButtonVariant } from './button-base';

export type { ArgButtonSize, ArgButtonVariant } from './button-base';

/**
 * Botão do Argila. Aplicado como atributo para manter a semântica nativa:
 *
 * ```html
 * <button arg-button variant="primary" (click)="salvar()">Salvar</button>
 * <a arg-button variant="tertiary" href="/ajuda">Ajuda</a>
 * ```
 */
@Component({
  selector: 'button[arg-button], a[arg-button]',
  imports: [ArgSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ArgButton extends ArgButtonBase {
  /** Peso visual: uma única ação `primary` por tela; `danger` para ações destrutivas. */
  readonly variant = input<ArgButtonVariant>('primary');
  /** Ocupa toda a largura do contêiner. */
  readonly fullWidth = input(false, { transform: booleanAttribute });

  protected override modifierClasses(): string[] {
    return this.fullWidth() ? ['arg-button--full-width'] : [];
  }
}
