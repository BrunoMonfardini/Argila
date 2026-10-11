import { Component, signal } from '@angular/core';
import { ArgBadge } from '../../badge/badge';
import { ArgButton } from '../../button/button';
import { ARG_CARD } from '../card';

interface Pet {
  name: string;
  breed: string;
  status: string;
}

/** Clique em qualquer lugar do card para abrir; "Agendar" faz outra coisa. */
@Component({
  selector: 'doc-card-clickable-example',
  imports: [ARG_CARD, ArgBadge, ArgButton],
  template: `
    <ul class="doc-grid">
      @for (pet of pets; track pet.name) {
        <li arg-card>
          <h3 arg-card-title>
            <button
              arg-card-link
              type="button"
              (click)="said.set('Abrindo a ficha de ' + pet.name)"
            >
              {{ pet.name }}
            </button>
          </h3>
          <p arg-card-description>{{ pet.breed }}</p>
          <footer arg-card-actions>
            <button
              arg-button
              variant="secondary"
              size="sm"
              (click)="said.set('Agendando um horário para ' + pet.name)"
            >
              Agendar
            </button>
            <span arg-badge tone="info">{{ pet.status }}</span>
          </footer>
        </li>
      }
    </ul>
    <p class="doc-said" role="status">{{ said() }}</p>
  `,
  styles: `
    .doc-grid,
    .doc-said {
      flex: 1 1 100%;
    }
    .doc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      gap: var(--arg-space-4);
      margin: 0;
      padding: 0;
    }
    .doc-said {
      min-height: 1.5em;
      margin: var(--arg-space-3) 0 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class CardClickableExample {
  protected readonly pets: Pet[] = [
    { name: 'Thor', breed: 'Golden retriever, 4 anos', status: 'Vacinas em dia' },
    { name: 'Mel', breed: 'Gata sem raça definida, 2 anos', status: 'Banho na sexta' },
    { name: 'Pipoca', breed: 'Shih-tzu, 7 anos', status: 'Novo' },
  ];
  protected readonly said = signal('');
}
