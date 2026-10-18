import { Component } from '@angular/core';
import { ArgBadge } from '../../lib/badge/badge';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';
import { ArgDivider } from '../../lib/divider/divider';

const PETS = [
  { name: 'Thor', info: 'Golden, 4 anos', status: 'Vacinas em dia', tone: 'success' as const },
  { name: 'Mel', info: 'SRD, 2 anos', status: 'V10 vence logo', tone: 'warning' as const },
  { name: 'Nina', info: 'Persa, 7 anos', status: 'Vacinas em dia', tone: 'success' as const },
];

/** Grade que se ajusta à largura: cards do mesmo tamanho, sem rolagem para o lado. */
@Component({
  selector: 'doc-pattern-layout-grid',
  imports: [ARG_CARD, ArgBadge],
  template: `
    <ul class="doc-grid">
      @for (pet of pets; track pet.name) {
        <li arg-card>
          <h4>{{ pet.name }}</h4>
          <p>{{ pet.info }}</p>
          <span arg-badge [tone]="pet.tone">{{ pet.status }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    .doc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      gap: var(--arg-space-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
    }

    h4,
    p {
      margin: 0;
    }
  `,
})
export class LayoutGridExample {
  protected readonly pets = PETS;
}

/** Seções de uma tela separadas por divisor, com a ação no fim. */
@Component({
  selector: 'doc-pattern-layout-sections',
  imports: [ARG_CARD, ArgButton, ArgDivider],
  template: `
    <article arg-card class="doc-sections">
      <h4>Resumo do dia</h4>
      <p>12 atendimentos, 2 cancelamentos.</p>
      <hr arg-divider />
      <h4>Pendências</h4>
      <p>3 clientes sem confirmação.</p>
      <footer>
        <button arg-button size="sm">Confirmar todos</button>
      </footer>
    </article>
  `,
  styles: `
    .doc-sections {
      display: grid;
      gap: var(--arg-space-3);
      max-width: 24rem;
    }

    h4,
    p {
      margin: 0;
    }
  `,
})
export class LayoutSectionsExample {}
