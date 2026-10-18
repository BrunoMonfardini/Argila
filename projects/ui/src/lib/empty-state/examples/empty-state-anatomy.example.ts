import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgEmptyState } from '../empty-state';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-empty-state-anatomy-example',
  imports: [ArgButton, ArgEmptyState],
  template: `
    <section arg-empty-state heading="Nenhum pedido ainda" icon="plus" [level]="3">
      Os pedidos aparecem aqui assim que alguém compra.
      <button arg-button arg-empty-state-action>Novo pedido</button>
    </section>
  `,
})
export class EmptyStateAnatomyExample {}
