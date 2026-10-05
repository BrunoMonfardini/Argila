import { Component } from '@angular/core';
import { ArgSample } from '../sample';

@Component({
  selector: 'doc-sample-basic-example',
  imports: [ArgSample],
  template: `<arg-sample name="a" />`,
})
export class SampleBasicExample {}
