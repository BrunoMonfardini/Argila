import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { DocExample } from '../../registry';
import { DocText } from '../../shared/text';

/** Um exemplo da página: título, descrição e o componente renderizado. */
@Component({
  selector: 'doc-example-frame',
  imports: [DocText, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 [id]="headingId()">{{ example().name }}</h3>
    @if (example().description; as description) {
      <p class="doc-example__description"><doc-text [text]="description" /></p>
    }
    <div class="doc-example__preview" role="group" [attr.aria-labelledby]="headingId()">
      <ng-container *ngComponentOutlet="example().component" />
    </div>
    <ng-content />
  `,
  styleUrl: './example-frame.css',
  // Sem encapsulamento: o estilo precisa alcançar o exemplo, criado dinamicamente.
  encapsulation: ViewEncapsulation.None,
  host: { class: 'doc-example' },
})
export class DocExampleFrame {
  readonly example = input.required<DocExample>();
  /** Id do título, para nomear a área do exemplo. */
  readonly headingId = input.required<string>();
}
