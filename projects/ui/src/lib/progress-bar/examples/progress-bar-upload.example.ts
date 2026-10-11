import { Component, computed, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgProgressBar } from '../progress-bar';

/** Determinada: o `label` repete o texto visível, e `valueText` diz o valor em fotos. */
@Component({
  selector: 'doc-progress-bar-upload-example',
  imports: [ArgButton, ArgProgressBar],
  template: `
    <div class="doc-stack">
      <div class="doc-row">
        <span>Enviando fotos</span>
        <span class="doc-muted">{{ text() }}</span>
      </div>
      <progress
        arg-progress
        label="Enviando fotos"
        [value]="sent()"
        [max]="total"
        [valueText]="text()"
      ></progress>
      <div class="doc-row doc-actions">
        <button arg-button variant="secondary" size="sm" [disabled]="done()" (click)="next()">
          Enviar a próxima
        </button>
        <button arg-button variant="tertiary" size="sm" (click)="sent.set(0)">Recomeçar</button>
      </div>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-2);
      max-width: 28rem;
    }
    .doc-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: var(--arg-space-2);
      font-size: var(--arg-font-size-body-sm);
    }
    .doc-actions {
      justify-content: flex-start;
    }
    .doc-muted {
      color: var(--arg-color-text-muted);
    }
  `,
})
export class ProgressBarUploadExample {
  protected readonly total = 5;
  protected readonly sent = signal(2);
  protected readonly done = computed(() => this.sent() >= this.total);
  protected readonly text = computed(() => `${this.sent()} de ${this.total} fotos`);

  protected next(): void {
    this.sent.update((sent) => Math.min(sent + 1, this.total));
  }
}
