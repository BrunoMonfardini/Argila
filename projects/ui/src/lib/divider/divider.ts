import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type ArgDividerOrientation = 'horizontal' | 'vertical';
export type ArgDividerSpacing = 'none' | 'sm' | 'md' | 'lg';

/**
 * Linha que separa seções ou grupos de itens, sobre o `<hr>` nativo:
 *
 * ```html
 * <hr arg-divider />
 * <hr arg-divider orientation="vertical" spacing="sm" />
 * ```
 */
@Component({
  selector: 'hr[arg-divider]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './divider.css',
  host: {
    class: 'arg-divider',
    '[class]': '`arg-divider--${orientation()} arg-divider--spacing-${spacing()}`',
    '[attr.aria-orientation]': 'orientation() === "vertical" ? "vertical" : null',
    '[attr.role]': 'decorative() ? "none" : null',
  },
})
export class ArgDivider {
  /** `vertical` separa itens lado a lado, como botões numa barra de ações. */
  readonly orientation = input<ArgDividerOrientation>('horizontal');
  /** Espaço antes e depois da linha, pelos tokens de espaçamento. */
  readonly spacing = input<ArgDividerSpacing>('md');
  /** Só visual: some para leitores de tela quando não separa seções de conteúdo. */
  readonly decorative = input(false, { transform: booleanAttribute });
}
