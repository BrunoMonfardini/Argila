import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ARG_CARD } from '../card';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-card-anatomy-example',
  imports: [ARG_CARD, ArgButton],
  template: `
    <article arg-card data-anatomy="1">
      <h3 arg-card-title data-anatomy="2">Thor</h3>
      <p arg-card-content data-anatomy="3">Golden retriever, 4 anos. Próxima vacina em março.</p>
      <footer arg-card-actions data-anatomy="4">
        <button arg-button variant="secondary" size="sm">Ver ficha</button>
      </footer>
    </article>
  `,
  styles: `
    article {
      max-width: 22rem;
    }
  `,
})
export class CardAnatomyExample {}
