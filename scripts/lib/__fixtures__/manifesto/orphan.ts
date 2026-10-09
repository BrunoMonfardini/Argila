import { Component, input } from '@angular/core';

@Component({ selector: 'arg-orphan', template: '' })
export class ArgOrphan {
  /** Documentada. */
  readonly tone = input('calm');
  readonly size = input(1);
}
