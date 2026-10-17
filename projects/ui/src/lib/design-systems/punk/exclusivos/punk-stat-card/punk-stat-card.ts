import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgPunkStatTone = 'pink' | 'yellow' | 'green' | 'blue';

/**
 * Card de indicador do Punk: bloco de cor chapada com um rótulo e um número,
 * como o "Leads activity" da referência. Exclusivo do Punk.
 *
 * ```html
 * <article arg-punk-stat-card tone="yellow" label="Leads na semana" value="128">
 *   12 a mais que a semana passada
 * </article>
 * ```
 *
 * O texto é sempre preto: as quatro cores do Punk são claras.
 */
@Component({
  selector: 'article[arg-punk-stat-card]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="arg-punk-stat-card__label">{{ label() }}</p>
    <p class="arg-punk-stat-card__value">{{ value() }}</p>
    <div class="arg-punk-stat-card__detail"><ng-content /></div>
  `,
  styleUrl: './punk-stat-card.css',
  host: {
    class: 'arg-punk-stat-card',
    '[class]': '`arg-punk-stat-card--${tone()}`',
  },
})
export class ArgPunkStatCard {
  /** Cor do card: `pink` (marca), `yellow`, `green` ou `blue`. */
  readonly tone = input<ArgPunkStatTone>('pink');
  /** O que o número mede: "Leads na semana". */
  readonly label = input.required<string>();
  /** O número, já formatado: "128", "R$ 2,4 mil", "75%". */
  readonly value = input.required<string>();
}
