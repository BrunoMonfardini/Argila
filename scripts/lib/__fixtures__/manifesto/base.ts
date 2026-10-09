import { Directive, input } from '@angular/core';

/** Base abstrata exportada: a checagem não exige página para ela. */
@Directive()
export abstract class ArgBase {
  /** Tamanho, herdado. */
  readonly size = input<'sm' | 'lg'>('sm');
  /** Tom, sobrescrito pela classe filha. */
  readonly tone = input('base');
}
