import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgDivider } from '../divider';

@Component({
  selector: 'doc-divider-vertical-example',
  imports: [ArgButton, ArgDivider],
  template: `
    <button arg-button variant="tertiary" size="sm">Editar</button>
    <button arg-button variant="tertiary" size="sm">Duplicar</button>
    <hr arg-divider orientation="vertical" spacing="sm" decorative />
    <button arg-button variant="tertiary" size="sm">Excluir</button>
  `,
})
export class DividerVerticalExample {}
