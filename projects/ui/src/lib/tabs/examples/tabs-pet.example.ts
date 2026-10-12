import { Component, signal } from '@angular/core';
import { ARG_LIST } from '../../list/list';
import { ARG_TABS } from '../tabs';

/**
 * Teclado: Tab entra na aba aberta; setas trocam de aba (a "Financeiro" está
 * desabilitada e é pulada); Tab de novo vai para o painel.
 */
@Component({
  selector: 'doc-tabs-pet-example',
  imports: [ARG_TABS, ARG_LIST],
  template: `
    <arg-tabs label="Ficha de Thor" [(selected)]="tab">
      <arg-tab label="Dados" value="dados">
        <ul arg-list divided>
          <li arg-list-item><span arg-list-title>Golden retriever</span></li>
          <li arg-list-item><span arg-list-title>4 anos · 32 kg</span></li>
        </ul>
      </arg-tab>
      <arg-tab label="Vacinas" value="vacinas">
        <p>Antirrábica em dia (até março). V10 vence em 10 dias.</p>
      </arg-tab>
      <arg-tab label="Histórico" value="historico">
        <p>Último banho em 12/09. Consulta de rotina em 02/08.</p>
      </arg-tab>
      <arg-tab label="Financeiro" value="financeiro" disabled>
        <p>Sem permissão.</p>
      </arg-tab>
    </arg-tabs>
    <p class="doc-said">Aba aberta: {{ tab() }}</p>
  `,
  styles: `
    arg-tabs {
      flex: 1 1 100%;
      max-width: 36rem;
    }
    .doc-said {
      flex: 1 1 100%;
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class TabsPetExample {
  protected readonly tab = signal<string | undefined>('vacinas');
}
