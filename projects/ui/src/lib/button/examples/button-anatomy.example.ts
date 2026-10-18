import { Component } from '@angular/core';
import { ArgIcon } from '../../icon/icon';
import { ArgButton } from '../button';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-button-anatomy-example',
  imports: [ArgButton, ArgIcon],
  template: `
    <button arg-button data-anatomy="1">
      <arg-icon name="plus" data-anatomy="2" />
      <span data-anatomy="3">Novo agendamento</span>
    </button>
  `,
})
export class ButtonAnatomyExample {}
