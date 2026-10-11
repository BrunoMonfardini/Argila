import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgAlert } from '../alert';

/**
 * Resposta a uma ação: o alerta aparece e o leitor de tela anuncia.
 * Ao fechar, o foco volta para o botão que abriu.
 */
@Component({
  selector: 'doc-alert-feedback-example',
  imports: [ArgAlert, ArgButton],
  template: `
    <div class="doc-stack">
      <div class="doc-row">
        <button #save arg-button (click)="shown.set('success')">Salvar ficha</button>
        <button arg-button variant="secondary" (click)="shown.set('danger')">Simular erro</button>
      </div>
      @if (shown() === 'success') {
        <div arg-alert tone="success" dismissible (dismissed)="close()">Ficha da Mel salva.</div>
      } @else if (shown() === 'danger') {
        <div
          arg-alert
          tone="danger"
          heading="Não foi possível salvar"
          dismissible
          (dismissed)="close()"
        >
          O servidor não respondeu. Seus dados continuam no formulário.
          <button
            arg-button
            arg-alert-action
            variant="secondary"
            size="sm"
            (click)="shown.set('success')"
          >
            Tentar de novo
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-3);
      max-width: 36rem;
    }
    .doc-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
  `,
})
export class AlertFeedbackExample {
  protected readonly shown = signal<'success' | 'danger' | null>(null);

  private readonly save = viewChild.required('save', { read: ElementRef<HTMLElement> });

  protected close(): void {
    this.shown.set(null);
    this.save().nativeElement.focus();
  }
}
