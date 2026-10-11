import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgTooltip } from '../tooltip';

/** Perto da borda da tela, o balão vira para o lado oposto sozinho. */
@Component({
  selector: 'doc-tooltip-positions-example',
  imports: [ArgButton, ArgTooltip],
  template: `
    <button arg-button variant="tertiary" argTooltip="Em cima" argTooltipPosition="top">Top</button>
    <button arg-button variant="tertiary" argTooltip="Embaixo" argTooltipPosition="bottom">
      Bottom
    </button>
    <button arg-button variant="tertiary" argTooltip="À esquerda" argTooltipPosition="left">
      Left
    </button>
    <button arg-button variant="tertiary" argTooltip="À direita" argTooltipPosition="right">
      Right
    </button>
  `,
})
export class TooltipPositionsExample {}
