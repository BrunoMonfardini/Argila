import { Component } from '@angular/core';
import { ArgIcon } from '../icon';

@Component({
  selector: 'doc-icon-sizes-example',
  imports: [ArgIcon],
  template: `
    <arg-icon name="check" size="sm" />
    <arg-icon name="check" size="md" />
    <arg-icon name="check" size="lg" />
  `,
})
export class IconSizesExample {}
