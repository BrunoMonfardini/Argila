import { Component } from '@angular/core';
import { ArgAlert } from '../alert';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-alert-anatomy-example',
  imports: [ArgAlert],
  template: `
    <div arg-alert tone="warning" heading="Pagamento pendente" dismissible>
      A fatura de março vence amanhã.
      <button arg-alert-action type="button">Pagar agora</button>
    </div>
  `,
})
export class AlertAnatomyExample {}
