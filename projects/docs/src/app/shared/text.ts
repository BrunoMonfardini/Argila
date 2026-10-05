import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TextPart {
  text: string;
  code: boolean;
}

/** "Use `<a arg-button>` para links" → partes de texto e de código, alternadas. */
export function splitInlineCode(text: string): TextPart[] {
  return text
    .split('`')
    .map((part, index) => ({ text: part, code: index % 2 === 1 }))
    .filter((part) => part.text);
}

/**
 * Texto curto escrito nos `*.docs.ts`, com trechos de código entre crases.
 * Renderizado sem innerHTML: o conteúdo nunca vira marcação.
 */
@Component({
  selector: 'doc-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (part of parts(); track $index) {
    @if (part.code) {
      <code>{{ part.text }}</code>
    } @else {
      {{ part.text }}
    }
  }`,
})
export class DocText {
  readonly text = input.required<string>();

  protected readonly parts = computed(() => splitInlineCode(this.text()));
}
