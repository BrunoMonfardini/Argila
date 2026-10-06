import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgIcon } from '../icon';

@Component({
  selector: 'doc-icon-in-button-example',
  imports: [ArgButton, ArgIcon],
  template: `
    <button arg-button><arg-icon name="plus" /> Novo agendamento</button>
    <button arg-button variant="secondary"><arg-icon name="check" /> Confirmar</button>
  `,
})
export class IconInButtonExample {}
