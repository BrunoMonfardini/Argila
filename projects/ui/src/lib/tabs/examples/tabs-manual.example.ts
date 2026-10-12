import { Component } from '@angular/core';
import { ARG_TABS } from '../tabs';

/** `activation="manual"`: as setas só movem o foco; Enter ou Espaço abrem a aba. */
@Component({
  selector: 'doc-tabs-manual-example',
  imports: [ARG_TABS],
  template: `
    <arg-tabs label="Relatórios" activation="manual">
      <arg-tab label="Hoje"><p>12 atendimentos, R$ 1.480.</p></arg-tab>
      <arg-tab label="Semana"><p>64 atendimentos, R$ 7.920.</p></arg-tab>
      <arg-tab label="Mês"><p>251 atendimentos, R$ 31.400.</p></arg-tab>
    </arg-tabs>
  `,
  styles: `
    arg-tabs {
      flex: 1 1 100%;
      max-width: 36rem;
    }
  `,
})
export class TabsManualExample {}
