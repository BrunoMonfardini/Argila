import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgIconButton } from '../../icon-button/icon-button';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-dialog-anatomy-example',
  imports: [ArgButton, ArgIconButton],
  template: `
    <!-- Réplica parada do diálogo, para mostrar as partes; o de verdade abre por cima da página -->
    <div class="replica" data-anatomy="1">
      <div class="replica__header">
        <p class="replica__title" data-anatomy="2">Cancelar o agendamento?</p>
        <button arg-icon-button icon="x" size="sm" label="Fechar" data-anatomy="5"></button>
      </div>
      <p data-anatomy="3">O horário volta a ficar livre para outros clientes.</p>
      <div class="replica__actions" data-anatomy="4">
        <button arg-button variant="secondary">Voltar</button>
        <button arg-button variant="danger">Cancelar agendamento</button>
      </div>
    </div>
  `,
  styles: `
    .replica {
      display: grid;
      gap: var(--arg-space-4);
      max-width: 26rem;
      padding: var(--arg-space-6);
      border-radius: var(--arg-radius-container);
      box-shadow: var(--arg-shadow-lg);
      background: var(--arg-color-surface-raised);
    }

    .replica__header,
    .replica__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
      align-items: center;
      justify-content: space-between;
    }

    .replica__header {
      flex-wrap: nowrap;
      align-items: flex-start;
    }

    .replica__actions {
      justify-content: flex-end;
    }

    .replica p {
      margin: 0;
    }

    .replica__title {
      font-family: var(--arg-font-family-heading);
      font-size: var(--arg-font-size-heading-sm);
      font-weight: var(--arg-font-weight-heading);
    }
  `,
})
export class DialogAnatomyExample {}
