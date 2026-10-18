import { Component } from '@angular/core';
import { ArgLink } from '../../lib/link/link';
import { ARG_TABS } from '../../lib/tabs/tabs';

/** Topo de uma página interna: o caminho de volta e as seções dela. */
@Component({
  selector: 'doc-pattern-navigation-page',
  imports: [ArgLink, ARG_TABS],
  template: `
    <div class="doc-stack">
      <a arg-link href="#" (click)="$event.preventDefault()">← Clientes</a>
      <h4>Maria Souza</h4>
      <arg-tabs label="Cliente">
        <arg-tab label="Pets">Thor e Mel.</arg-tab>
        <arg-tab label="Agendamentos">2 na semana.</arg-tab>
        <arg-tab label="Pagamentos">Tudo em dia.</arg-tab>
      </arg-tabs>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-3);
    }

    h4 {
      margin: 0;
    }
  `,
})
export class NavigationPageExample {}

/** Trocar a visão dos mesmos dados: abas segmentadas. */
@Component({
  selector: 'doc-pattern-navigation-views',
  imports: [ARG_TABS],
  template: `
    <arg-tabs label="Período" variant="segmented">
      <arg-tab label="Dia">12 atendimentos.</arg-tab>
      <arg-tab label="Semana">58 atendimentos.</arg-tab>
      <arg-tab label="Mês">231 atendimentos.</arg-tab>
    </arg-tabs>
  `,
})
export class NavigationViewsExample {}
