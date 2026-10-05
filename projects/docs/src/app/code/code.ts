import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ArgButton } from '@brunomonfardini/ui';
import { CodeLanguage, highlight } from './highlight';

/**
 * Bloco de código com destaque de sintaxe e botão de copiar. O texto é
 * renderizado como texto (nunca como marcação), trecho a trecho.
 */
@Component({
  selector: 'doc-code',
  imports: [ArgButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Dentro do <pre>, todo espaço do template aparece: por isso o @for numa linha só.
  template: `
    <div class="doc-code__toolbar">
      <span class="doc-code__language">{{ language() }}</span>
      <button arg-button type="button" variant="tertiary" size="sm" (click)="copy()">
        {{ copied() ? 'Copiado' : 'Copiar' }}
      </button>
      <span class="doc-code__status" role="status">{{ copied() ? 'Código copiado' : '' }}</span>
    </div>
    <pre
      class="doc-code__pre"
      tabindex="0"
      [attr.aria-label]="label()"
    ><code>@for (token of tokens(); track $index) {<span [class]="'doc-code--' + token.kind">{{ token.text }}</span>}</code></pre>
  `,
  styleUrl: './code.css',
})
export class DocCode {
  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('ts');
  /** Nome acessível da área de código, que recebe foco para rolar pelo teclado. */
  readonly label = input('Código');

  protected readonly tokens = computed(() => highlight(this.code().trimEnd(), this.language()));
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code().trimEnd());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
