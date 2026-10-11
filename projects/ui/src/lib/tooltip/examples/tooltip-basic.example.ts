import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgIconButton } from '../../icon-button/icon-button';
import { ArgTooltip } from '../tooltip';

/** Passe o mouse ou chegue pelo Tab; Esc fecha sem tirar o foco. */
@Component({
  selector: 'doc-tooltip-basic-example',
  imports: [ArgButton, ArgIconButton, ArgTooltip],
  template: `
    <button arg-button variant="secondary" argTooltip="Atalho: Ctrl + S">Salvar rascunho</button>
    <button
      arg-icon-button
      icon="plus"
      label="Novo agendamento"
      argTooltip="Novo agendamento"
    ></button>
    <button
      arg-icon-button
      icon="x"
      label="Cancelar"
      argTooltip="Cancelar"
      argTooltipPosition="bottom"
    ></button>
  `,
})
export class TooltipBasicExample {}
