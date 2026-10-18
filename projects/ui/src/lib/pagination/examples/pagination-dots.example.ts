import { Component, signal } from '@angular/core';
import { ArgPagination } from '../pagination';

const SLIDES = [
  'Agende banho e tosa em poucos toques.',
  'Receba lembretes das vacinas.',
  'Pague pelo app, sem fila.',
  'Acompanhe o histórico de cada pet.',
];

/** Passos de boas-vindas: um ponto por passo, o atual em pílula. */
@Component({
  selector: 'doc-pagination-dots-example',
  imports: [ArgPagination],
  template: `
    <div class="doc-stack">
      <p aria-live="polite">{{ slides[page() - 1] }}</p>
      <nav
        arg-pagination
        variant="dots"
        label="Passos"
        [total]="slides.length"
        [(page)]="page"
      ></nav>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
    }

    p {
      margin: 0;
    }
  `,
})
export class PaginationDotsExample {
  protected readonly slides = SLIDES;
  protected readonly page = signal(1);
}
