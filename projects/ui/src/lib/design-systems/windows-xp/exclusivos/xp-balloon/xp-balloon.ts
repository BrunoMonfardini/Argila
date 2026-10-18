import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgXpBalloonTail = 'start' | 'end';

/**
 * Balão de aviso do Windows XP, como o "System Update Complete" da
 * referência. Exclusivo do Windows XP.
 *
 * ```html
 * <div arg-xp-balloon>Atualização concluída</div>
 * ```
 *
 * É um `role="status"`: quando o texto aparece ou muda, o leitor de tela o
 * anuncia sem tirar o foco de onde a pessoa está.
 */
@Component({
  selector: 'div[arg-xp-balloon]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './xp-balloon.css',
  host: {
    class: 'arg-xp-balloon',
    role: 'status',
    '[class]': '`arg-xp-balloon--tail-${tail()}`',
  },
})
export class ArgXpBalloon {
  /** De que lado fica a ponta do balão: `start` ou `end`. */
  readonly tail = input<ArgXpBalloonTail>('start');
}
