import { Component } from '@angular/core';
import { ArgAlert } from '../alert';

/** Já na página quando ela abre: `live="off"`, para o leitor não anunciar os quatro de uma vez. */
@Component({
  selector: 'doc-alert-tones-example',
  imports: [ArgAlert],
  template: `
    <div class="doc-stack">
      <div arg-alert tone="info" live="off">A clínica fecha mais cedo na véspera do feriado.</div>
      <div arg-alert tone="success" live="off" heading="Agendamento confirmado">
        Thor tem banho e tosa na sexta, às 14h.
      </div>
      <div arg-alert tone="warning" live="off" heading="Vacina perto de vencer">
        A antirrábica da Mel vence em 10 dias.
      </div>
      <div arg-alert tone="danger" live="off" heading="Não foi possível salvar">
        Confira a conexão e tente de novo.
      </div>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-3);
      max-width: 36rem;
    }
  `,
})
export class AlertTonesExample {}
