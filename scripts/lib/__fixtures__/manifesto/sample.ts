import { Component, booleanAttribute, input } from '@angular/core';

export type SampleTone = 'calm' | 'loud';

@Component({
  selector: 'arg-sample',
  template: '',
  styleUrl: './sample.css',
})
export class ArgSample {
  /** Tom da amostra. */
  readonly tone = input<SampleTone>('calm');
  /** Liga o modo compacto. */
  readonly compact = input(false, { transform: booleanAttribute });
  readonly label = input('Amostra');
  /** Quantidade de itens. */
  readonly count = input(3);
  /** Nome obrigatório. */
  readonly name = input.required<'a' | 'b'>();
  /** Tamanho opcional. */
  readonly size = input<'sm' | 'lg'>();
  readonly items = input<string[]>([]);
  readonly notAnInput = 42;
  readonly computedLater = Math.max(1, 2);
  plain?: string;

  method(): void {
    return;
  }
}

@Component({ selector: 'arg-no-style', template: '' })
export class ArgNoStyle {}

/** Parte do ArgSample: documentada pela página dele, por estar no mesmo arquivo. */
@Component({ selector: 'arg-sample-item', template: '' })
export class ArgSampleItem {}
