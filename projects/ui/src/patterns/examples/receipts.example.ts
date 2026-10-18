import { Component } from '@angular/core';
import { ArgBadge } from '../../lib/badge/badge';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';

const RECEIPTS = [
  {
    date: '24/10',
    title: 'Banho e tosa',
    value: 'R$ 85,50',
    status: 'Pago',
    tone: 'success' as const,
  },
  {
    date: '10/10',
    title: 'Consulta',
    value: 'R$ 120,00',
    status: 'Pago',
    tone: 'success' as const,
  },
  {
    date: '02/10',
    title: 'Vacina V10',
    value: 'R$ 90,00',
    status: 'Estornado',
    tone: 'neutral' as const,
  },
];

/** Histórico: cada comprovante numa linha, com data, valor e situação. */
@Component({
  selector: 'doc-pattern-receipts-history',
  imports: [ARG_CARD, ArgBadge],
  template: `
    <ul class="doc-receipts">
      @for (receipt of receipts; track receipt.date) {
        <li arg-card>
          <span class="doc-receipts__date">{{ receipt.date }}</span>
          <span>{{ receipt.title }}</span>
          <strong>{{ receipt.value }}</strong>
          <span arg-badge [tone]="receipt.tone">{{ receipt.status }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    .doc-receipts {
      display: grid;
      gap: var(--arg-space-2);
      max-width: 30rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
      grid-template-columns: 3rem 1fr auto auto;
      gap: var(--arg-space-3);
      align-items: center;
    }

    .doc-receipts__date {
      color: var(--arg-color-text-muted);
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class ReceiptsHistoryExample {
  protected readonly receipts = RECEIPTS;
}

/** Ações do comprovante sempre no mesmo lugar: compartilhar e baixar. */
@Component({
  selector: 'doc-pattern-receipts-actions',
  imports: [ArgButton],
  template: `
    <div class="doc-actions">
      <button arg-button>Compartilhar</button>
      <button arg-button variant="secondary">Baixar PDF</button>
    </div>
  `,
  styles: `
    .doc-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
  `,
})
export class ReceiptsActionsExample {}
