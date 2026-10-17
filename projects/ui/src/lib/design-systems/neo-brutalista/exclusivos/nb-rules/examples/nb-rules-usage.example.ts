import { Component } from '@angular/core';
import { ArgNbRules } from '../nb-rules';

/** As regras do Neo-brutalista numa caixa de contorno grosso. */
@Component({
  selector: 'doc-nb-rules-usage-example',
  imports: [ArgNbRules],
  template: `
    <aside arg-nb-rules label="Regras de uso">
      <ul>
        <li>Contorno preto grosso</li>
        <li>Cantos retos e sombra dura</li>
        <li>Uma ação primária por tela</li>
        <li>Foco sempre visível</li>
      </ul>
    </aside>
  `,
  styles: `
    aside {
      max-width: 24rem;
    }
  `,
})
export class NbRulesUsageExample {}
