import { Component } from '@angular/core';
import { ARG_TABS } from '../tabs';

/** Anatomia: cada parte marcada é numerada pelo catálogo, na ordem da legenda. */
@Component({
  selector: 'doc-tabs-anatomy-example',
  imports: [ARG_TABS],
  template: `
    <arg-tabs label="Ficha do pet">
      <arg-tab label="Dados">Golden retriever, 4 anos.</arg-tab>
      <arg-tab label="Vacinas">V10 em dia.</arg-tab>
      <arg-tab label="Histórico">3 consultas.</arg-tab>
    </arg-tabs>
  `,
})
export class TabsAnatomyExample {}
