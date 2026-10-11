import { Component } from '@angular/core';
import { ArgEmptyState } from '../empty-state';

@Component({
  selector: 'doc-empty-state-basic-example',
  imports: [ArgEmptyState],
  template: `
    <section arg-empty-state heading="Nenhuma pendência" icon="check-circle" [level]="3" bordered>
      Todos os pagamentos do mês foram recebidos.
    </section>
  `,
  styles: `
    section {
      flex: 1 1 100%;
      max-width: 32rem;
    }
  `,
})
export class EmptyStateBasicExample {}
