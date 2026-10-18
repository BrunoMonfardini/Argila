import { Component } from '@angular/core';
import { ArgAlert } from '../../lib/alert/alert';
import { ArgBadge } from '../../lib/badge/badge';
import { ArgButton } from '../../lib/button/button';
import { ArgTag } from '../../lib/tag/tag';

/** Uma ação primária por tela; as outras, secundária e terciária. */
@Component({
  selector: 'doc-pattern-color-actions',
  imports: [ArgButton],
  template: `
    <div class="doc-row">
      <button arg-button>Confirmar agendamento</button>
      <button arg-button variant="secondary">Remarcar</button>
      <button arg-button variant="tertiary">Cancelar</button>
    </div>
  `,
  styles: `
    .doc-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
  `,
})
export class ColorActionsExample {}

/** A cor do tom diz a situação, sempre com texto junto. */
@Component({
  selector: 'doc-pattern-color-status',
  imports: [ArgAlert, ArgBadge, ArgTag],
  template: `
    <div class="doc-stack">
      <div class="doc-row">
        <span arg-badge tone="success">Pago</span>
        <span arg-badge tone="warning">Vence hoje</span>
        <span arg-badge tone="danger">Atrasado</span>
        <arg-tag>Banho</arg-tag>
      </div>
      <div arg-alert tone="info">A cor reforça; o texto é que informa.</div>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-3);
    }

    .doc-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
      align-items: center;
    }
  `,
})
export class ColorStatusExample {}
