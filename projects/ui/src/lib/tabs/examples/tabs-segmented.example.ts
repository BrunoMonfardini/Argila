import { Component } from '@angular/core';
import { ARG_TABS } from '../tabs';

/** `variant="segmented"`: trilho em pílula para alternar poucas visões curtas. */
@Component({
  selector: 'doc-tabs-segmented-example',
  imports: [ARG_TABS],
  template: `
    <arg-tabs label="Período" variant="segmented">
      <arg-tab label="Hoje"><p>12 atendimentos.</p></arg-tab>
      <arg-tab label="Semana"><p>64 atendimentos.</p></arg-tab>
      <arg-tab label="Mês"><p>251 atendimentos.</p></arg-tab>
    </arg-tabs>
  `,
})
export class TabsSegmentedExample {}
