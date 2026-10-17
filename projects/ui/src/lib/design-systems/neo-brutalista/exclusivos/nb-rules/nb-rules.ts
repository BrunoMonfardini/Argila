import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { injectUniqueId } from '../../../../internal/unique-id';

/**
 * Caixa de regras de uso do Neo-brutalista, como o "Usage rules" da
 * referência. Exclusivo do Neo-brutalista.
 *
 * ```html
 * <aside arg-nb-rules label="Regras de uso">
 *   <ul>
 *     <li>Contorno preto grosso</li>
 *     <li>Foco sempre visível</li>
 *   </ul>
 * </aside>
 * ```
 *
 * O `label` é o título visível e o nome do `<aside>` para o leitor de tela.
 */
@Component({
  selector: 'aside[arg-nb-rules]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="arg-nb-rules__title" [id]="titleId">{{ label() }}</p>
    <ng-content />
  `,
  styleUrl: './nb-rules.css',
  host: {
    class: 'arg-nb-rules',
    '[attr.aria-labelledby]': 'titleId',
  },
})
export class ArgNbRules {
  /** Título da caixa, lido também como nome do `<aside>`: "Regras de uso". */
  readonly label = input.required<string>();

  protected readonly titleId = injectUniqueId('arg-nb-rules');
}
