import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgPunkBurstTone = 'pink' | 'ink';

/**
 * Estrela "explosão" do Punk: ornamento de capa e de card, como a da tela de
 * entrada da referência. Exclusivo do Punk.
 *
 * ```html
 * <arg-punk-burst tone="pink" />
 * ```
 *
 * É só decoração (`aria-hidden`): nunca use como ícone de ação ou para
 * comunicar algo.
 */
@Component({
  selector: 'arg-punk-burst',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 100 100" focusable="false">
      <path
        d="M50 2 55 38 78 8 62 42 96 26 64 50 98 66 62 58 80 92 54 62 50 98 46 62 20 92 38 58 2 66 36 50 4 26 38 42 22 8 45 38Z"
      />
    </svg>
  `,
  styleUrl: './punk-burst.css',
  host: {
    class: 'arg-punk-burst',
    'aria-hidden': 'true',
    '[class]': '`arg-punk-burst--${tone()}`',
  },
})
export class ArgPunkBurst {
  /** Cor da estrela: `pink` (marca) ou `ink` (a cor do texto). */
  readonly tone = input<ArgPunkBurstTone>('pink');
}
