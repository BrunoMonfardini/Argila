import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgBadgeTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

/**
 * Rótulo curto de status ou categoria, só para leitura:
 *
 * ```html
 * <span arg-badge tone="success">Confirmado</span>
 * ```
 *
 * O texto carrega o significado; a cor só reforça.
 */
@Component({
  selector: 'span[arg-badge]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './badge.css',
  host: {
    class: 'arg-badge',
    '[class]': '`arg-badge--${tone()}`',
  },
})
export class ArgBadge {
  /** Cor do rótulo: `success` para concluído, `warning` para pendente, `danger` para problema. */
  readonly tone = input<ArgBadgeTone>('neutral');
}
