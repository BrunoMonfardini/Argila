import { Component } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';
import { ArgEmptyState } from '../../lib/empty-state/empty-state';

const SUMMARY = [
  { label: 'Agendamentos hoje', value: '12' },
  { label: 'A confirmar', value: '3' },
  { label: 'Faturamento do mês', value: 'R$ 8.420' },
];

/** Início: o que pede atenção agora, os números do dia e a ação mais comum. */
@Component({
  selector: 'doc-pattern-home',
  imports: [ARG_CARD, ArgButton],
  template: `
    <div class="doc-home">
      <header>
        <h4>Bom dia, Carla</h4>
        <button arg-button size="sm">Novo agendamento</button>
      </header>
      <ul>
        @for (item of summary; track item.label) {
          <li arg-card>
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .doc-home {
      display: grid;
      gap: var(--arg-space-4);
    }

    header {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-3);
      align-items: center;
      justify-content: space-between;
    }

    h4 {
      margin: 0;
    }

    ul {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      gap: var(--arg-space-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
      gap: var(--arg-space-1);
    }

    strong {
      font-size: var(--arg-font-size-heading-sm);
    }
  `,
})
export class HomeExample {
  protected readonly summary = SUMMARY;
}

/** Primeiro acesso: no lugar dos números, o primeiro passo. */
@Component({
  selector: 'doc-pattern-home-first',
  imports: [ArgButton, ArgEmptyState],
  template: `
    <section arg-empty-state heading="Sua agenda começa aqui" icon="calendar" [level]="4" bordered>
      Cadastre os serviços da clínica para receber os primeiros agendamentos.
      <button arg-button arg-empty-state-action>Cadastrar serviços</button>
    </section>
  `,
})
export class HomeFirstExample {}
