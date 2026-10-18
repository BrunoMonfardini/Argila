import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgIcon } from '../../icon/icon';
import { ArgIconButton } from '../../icon-button/icon-button';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-toast-anatomy-example',
  imports: [ArgButton, ArgIcon, ArgIconButton],
  template: `
    <!-- Réplica parada do toast, para mostrar as partes; o de verdade aparece no canto da tela -->
    <div class="replica" data-anatomy="1">
      <arg-icon name="check-circle" data-anatomy="2" />
      <p class="replica__body">
        <strong data-anatomy="3">Agendamento salvo</strong>
        <span data-anatomy="4">Thor, sexta às 10h.</span>
      </p>
      <button arg-button variant="tertiary" size="sm" data-anatomy="5">Desfazer</button>
      <button
        arg-icon-button
        icon="x"
        size="sm"
        label="Fechar notificação"
        data-anatomy="6"
      ></button>
    </div>
  `,
  styles: `
    .replica {
      display: flex;
      gap: var(--arg-space-3);
      align-items: flex-start;
      max-width: 24rem;
      padding: var(--arg-space-3) var(--arg-space-2) var(--arg-space-3) var(--arg-space-4);
      border: 1px solid var(--arg-color-border);
      border-inline-start: 4px solid var(--arg-color-success);
      border-radius: var(--arg-radius-container);
      box-shadow: var(--arg-shadow-md);
      background: var(--arg-color-surface-raised);
      font-size: var(--arg-font-size-body-sm);
    }

    .replica arg-icon {
      color: var(--arg-color-success);
    }

    .replica__body {
      display: grid;
      flex: 1;
      margin: 0;
    }
  `,
})
export class ToastAnatomyExample {}
