import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type ArgSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Indicador de progresso indeterminado:
 *
 * ```html
 * <arg-spinner label="Carregando pedidos" />
 * ```
 *
 * Dentro de um controle que já anuncia o estado (ex.: botão com `aria-busy`),
 * use `decorative` para escondê-lo de leitores de tela.
 */
@Component({
  selector: 'arg-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './spinner.css',
  host: {
    class: 'arg-spinner',
    '[class]': '`arg-spinner--${size()}`',
    '[attr.role]': 'decorative() ? null : "progressbar"',
    '[attr.aria-label]': 'decorative() ? null : label()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class ArgSpinner {
  /** Diâmetro: `sm` (16 px) ao lado de texto, `lg` (40 px) para áreas vazias. */
  readonly size = input<ArgSpinnerSize>('md');
  /** Nome acessível: diga o que está carregando. */
  readonly label = input('Carregando');
  /** Esconde de tecnologias assistivas quando o contexto já informa o carregamento. */
  readonly decorative = input(false, { transform: booleanAttribute });
}
