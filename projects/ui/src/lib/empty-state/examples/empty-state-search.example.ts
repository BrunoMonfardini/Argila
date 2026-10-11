import { Component, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgEmptyState } from '../empty-state';

/** Busca sem resultado: diga o que foi buscado e ofereça a saída. */
@Component({
  selector: 'doc-empty-state-search-example',
  imports: [ArgButton, ArgEmptyState],
  template: `
    <section arg-empty-state heading="Nenhum cliente encontrado" icon="info" [level]="3">
      Nada com "{{ query() }}". Confira a grafia ou busque pelo telefone.
      <button arg-button arg-empty-state-action variant="secondary" (click)="query.set('')">
        Limpar busca
      </button>
      <button arg-button arg-empty-state-action>Cadastrar cliente</button>
    </section>
  `,
  styles: `
    section {
      flex: 1 1 100%;
      max-width: 32rem;
    }
  `,
})
export class EmptyStateSearchExample {
  protected readonly query = signal('Thorr');
}
