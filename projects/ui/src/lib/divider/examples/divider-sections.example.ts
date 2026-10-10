import { Component } from '@angular/core';
import { ArgDivider } from '../divider';

@Component({
  selector: 'doc-divider-sections-example',
  imports: [ArgDivider],
  template: `
    <div>
      <p>Dados do tutor: Maria Souza, (11) 98765-4321.</p>
      <hr arg-divider />
      <p>Dados do pet: Thor, 4 anos, sem alergias conhecidas.</p>
    </div>
  `,
})
export class DividerSectionsExample {}
