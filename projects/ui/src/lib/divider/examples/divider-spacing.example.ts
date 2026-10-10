import { Component } from '@angular/core';
import { ArgDivider } from '../divider';

@Component({
  selector: 'doc-divider-spacing-example',
  imports: [ArgDivider],
  template: `
    <div>
      <span>Sem espaço</span>
      <hr arg-divider spacing="none" />
      <span>Pequeno</span>
      <hr arg-divider spacing="sm" />
      <span>Médio (padrão)</span>
      <hr arg-divider />
      <span>Grande</span>
      <hr arg-divider spacing="lg" />
    </div>
  `,
})
export class DividerSpacingExample {}
