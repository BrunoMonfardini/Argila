import { Component, inject } from '@angular/core';
import { ArgBadge } from '../../lib/badge/badge';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';
import { ArgDivider } from '../../lib/divider/divider';
import { ArgToast } from '../../lib/toast/toast';

const ITEMS = [
  { label: 'Banho', value: 'R$ 60,00' },
  { label: 'Tosa higiênica', value: 'R$ 35,00' },
  { label: 'Desconto de cliente', value: '− R$ 9,50' },
];

/** Comprovante: resumo no topo, detalhes, total e as ações de compartilhar e baixar. */
@Component({
  selector: 'doc-template-receipt',
  imports: [ARG_CARD, ArgBadge, ArgButton, ArgDivider],
  template: `
    <article arg-card class="doc-template" aria-labelledby="comprovante-titulo">
      <header class="doc-template__head">
        <h4 id="comprovante-titulo">Comprovante de pagamento</h4>
        <span arg-badge tone="success">Pago</span>
      </header>
      <p class="doc-template__total">R$ 85,50</p>
      <p>Pix para Clínica Patas, sexta, 24/10/2026, às 10h12.</p>
      <hr arg-divider />
      <dl>
        @for (item of items; track item.label) {
          <div>
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
        <div class="doc-template__sum">
          <dt>Total</dt>
          <dd>R$ 85,50</dd>
        </div>
      </dl>
      <hr arg-divider />
      <p class="doc-template__code">Autenticação: E1234 5678 9012</p>
      <footer class="doc-template__actions">
        <button arg-button (click)="share()">Compartilhar</button>
        <button arg-button variant="secondary" (click)="download()">Baixar PDF</button>
      </footer>
    </article>
  `,
  styles: `
    .doc-template {
      display: grid;
      gap: var(--arg-space-4);
      width: 100%;
      max-width: 32rem;
    }

    h4,
    p,
    dl {
      margin: 0;
    }

    .doc-template__head,
    dl > div {
      display: flex;
      gap: var(--arg-space-2);
      align-items: baseline;
      justify-content: space-between;
    }

    .doc-template__total {
      font-family: var(--arg-font-family-heading);
      font-size: var(--arg-font-size-display);
      font-weight: var(--arg-font-weight-heading);
      font-variant-numeric: tabular-nums;
    }

    dl {
      display: grid;
      gap: var(--arg-space-2);
    }

    dd {
      margin: 0;
      font-variant-numeric: tabular-nums;
    }

    .doc-template__sum {
      font-weight: var(--arg-font-weight-strong);
    }

    .doc-template__code {
      color: var(--arg-color-text-muted);
      font-size: var(--arg-font-size-body-sm);
    }

    .doc-template__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
  `,
})
export class ReceiptTemplate {
  private readonly toast = inject(ArgToast);
  protected readonly items = ITEMS;

  protected share(): void {
    this.toast.show('Link do comprovante copiado', { tone: 'success' });
  }

  protected download(): void {
    this.toast.show('Comprovante baixado', { tone: 'success' });
  }
}
