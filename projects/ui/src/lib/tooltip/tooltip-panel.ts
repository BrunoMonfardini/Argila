import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Balão do tooltip. Não é usado direto: a diretiva `argTooltip` cria um por
 * gatilho, no `<body>`, como `popover="manual"` (camada de topo do navegador).
 */
@Component({
  selector: 'arg-tooltip-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '{{ text() }}',
  styleUrl: './tooltip-panel.css',
  host: {
    popover: 'manual',
    role: 'tooltip',
    '[id]': 'id()',
    '[class]': '"arg-tooltip arg-tooltip--" + position()',
    '[style.position-anchor]': 'anchor()',
  },
})
export class ArgTooltipPanel {
  readonly text = input.required<string>();
  readonly id = input.required<string>();
  /** Nome do anchor CSS do gatilho, ex.: `--arg-tooltip-1`. */
  readonly anchor = input.required<string>();
  readonly position = input<ArgTooltipPosition>('top');
}
