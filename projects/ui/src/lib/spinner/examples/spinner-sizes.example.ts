import { Component } from '@angular/core';
import { ArgSpinner } from '../spinner';

@Component({
  selector: 'doc-spinner-sizes-example',
  imports: [ArgSpinner],
  template: `
    <arg-spinner size="sm" label="Carregando (pequeno)" />
    <arg-spinner size="md" label="Carregando (médio)" />
    <arg-spinner size="lg" label="Carregando (grande)" />
  `,
})
export class SpinnerSizesExample {}
