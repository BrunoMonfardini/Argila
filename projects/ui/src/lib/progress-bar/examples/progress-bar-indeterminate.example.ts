import { Component } from '@angular/core';
import { ArgProgressBar } from '../progress-bar';

/** Sem `value`: indeterminada, quando não dá para saber quanto falta. `sm` para espaços pequenos. */
@Component({
  selector: 'doc-progress-bar-indeterminate-example',
  imports: [ArgProgressBar],
  template: `
    <div class="doc-stack">
      <span>Gerando o relatório do mês…</span>
      <progress arg-progress label="Gerando o relatório do mês"></progress>
      <span>Sincronizando a agenda…</span>
      <progress arg-progress label="Sincronizando a agenda" size="sm"></progress>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-2);
      max-width: 28rem;
      font-size: var(--arg-font-size-body-sm);
    }
    span + progress + span {
      margin-block-start: var(--arg-space-3);
    }
  `,
})
export class ProgressBarIndeterminateExample {}
