import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DocText } from '../../shared/text';

/** Duas colunas de regras: o que fazer (verde) e o que evitar (vermelho). */
@Component({
  selector: 'doc-rules',
  imports: [DocText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (doRules().length) {
      <div class="doc-rules__do">
        <h3>{{ doTitle() }}</h3>
        <ul>
          @for (rule of doRules(); track rule) {
            <li><doc-text [text]="rule" /></li>
          }
        </ul>
      </div>
    }
    @if (dontRules().length) {
      <div class="doc-rules__dont">
        <h3>{{ dontTitle() }}</h3>
        <ul>
          @for (rule of dontRules(); track rule) {
            <li><doc-text [text]="rule" /></li>
          }
        </ul>
      </div>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: var(--arg-space-4);
    }

    .doc-rules__do,
    .doc-rules__dont {
      padding: var(--arg-space-4) var(--arg-space-5);
      border-block-start: 4px solid var(--arg-color-success);
      border-radius: var(--arg-radius-container);
      background: var(--arg-color-surface);
    }

    .doc-rules__dont {
      border-block-start-color: var(--arg-color-danger);
    }

    ul {
      margin: 0;
      padding-inline-start: var(--arg-space-5);
    }

    li + li {
      margin-block-start: var(--arg-space-2);
    }
  `,
})
export class DocRules {
  readonly doRules = input<readonly string[]>([]);
  readonly dontRules = input<readonly string[]>([]);
  readonly doTitle = input('Faça');
  readonly dontTitle = input('Não faça');
}
