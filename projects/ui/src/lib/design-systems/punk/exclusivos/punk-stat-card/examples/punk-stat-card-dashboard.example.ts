import { Component } from '@angular/core';
import { ArgPunkStatCard } from '../punk-stat-card';

/** Três indicadores lado a lado, em cores diferentes. */
@Component({
  selector: 'doc-punk-stat-card-dashboard-example',
  imports: [ArgPunkStatCard],
  template: `
    <div class="cards">
      <article arg-punk-stat-card tone="yellow" label="Leads na semana" value="128">
        12 a mais que a semana passada
      </article>
      <article arg-punk-stat-card tone="pink" label="Encontros hoje" value="3"></article>
      <article arg-punk-stat-card tone="green" label="Vendas" value="R$ 2,4 mil"></article>
    </div>
  `,
  styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: var(--arg-space-3);
    }
  `,
})
export class PunkStatCardDashboardExample {}
