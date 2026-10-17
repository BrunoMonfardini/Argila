import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgNbStickerTone = 'primary' | 'accent' | 'neutral';
export type ArgNbStickerTilt = 'left' | 'right' | 'none';

/**
 * Selo inclinado do Neo-brutalista: destaca uma regra ou um aviso curto, como
 * "Uma ação primária" ou "Foco sempre visível". Exclusivo do Neo-brutalista.
 *
 * ```html
 * <span arg-nb-sticker tone="primary">Uma ação primária</span>
 * ```
 *
 * É texto comum: o leitor de tela lê o selo junto com o conteúdo ao redor. A
 * inclinação é só visual.
 */
@Component({
  selector: 'span[arg-nb-sticker]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './nb-sticker.css',
  host: {
    class: 'arg-nb-sticker',
    '[class]': '`arg-nb-sticker--${tone()} arg-nb-sticker--tilt-${tilt()}`',
  },
})
export class ArgNbSticker {
  /** Cor do selo: `primary` (bloco da marca), `accent` (destaque) ou `neutral` (papel). */
  readonly tone = input<ArgNbStickerTone>('primary');
  /** Para que lado o selo inclina: `left`, `right` ou `none`. */
  readonly tilt = input<ArgNbStickerTilt>('left');
}
