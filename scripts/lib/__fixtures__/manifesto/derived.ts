import { Component, input } from '@angular/core';
import { ArgBase } from './base';

@Component({
  selector: 'arg-derived',
  template: '',
  styleUrls: ['./sample.css', './derived.css'],
})
export class ArgDerived extends ArgBase {
  /** Tom da filha. */
  override readonly tone = input('filha');
}
