import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { ArgButton } from '@brunomonfardini/ui';
import { DocCode } from '../../code/code';
import { DocExample } from '../../registry';
import { DocText } from '../../shared/text';

/** Um exemplo da página: título, descrição, o componente renderizado e o código. */
@Component({
  selector: 'doc-example-frame',
  imports: [ArgButton, DocCode, DocText, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 [id]="headingId()">{{ example().name }}</h3>
    @if (example().description; as description) {
      <p class="doc-example__description"><doc-text [text]="description" /></p>
    }
    <div class="doc-example__preview" role="group" [attr.aria-labelledby]="headingId()">
      <ng-container *ngComponentOutlet="example().component" />
    </div>
    @if (code(); as code) {
      <button
        arg-button
        type="button"
        variant="tertiary"
        size="sm"
        class="doc-example__toggle"
        [attr.aria-expanded]="showCode()"
        [attr.aria-controls]="headingId() + '-codigo'"
        (click)="showCode.set(!showCode())"
      >
        {{ showCode() ? 'Esconder código' : 'Ver código' }}
      </button>
      <div [id]="headingId() + '-codigo'" [hidden]="!showCode()">
        @if (showCode()) {
          <doc-code [code]="code" [label]="'Código do exemplo ' + example().name" />
        }
      </div>
    }
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
  /** Código-fonte do exemplo, vindo do manifesto. */
  readonly code = input<string>();

  protected readonly showCode = signal(false);
}
