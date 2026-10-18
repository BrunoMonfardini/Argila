import { Component } from '@angular/core';
import { ArgBadge } from '../../lib/badge/badge';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';

/** Um destaque por vez, com o que é, por que importa e uma ação. */
@Component({
  selector: 'doc-pattern-showcase',
  imports: [ARG_CARD, ArgBadge, ArgButton],
  template: `
    <article arg-card class="doc-showcase">
      <span arg-badge tone="primary">Novo</span>
      <h4>Lembretes de vacina por WhatsApp</h4>
      <p>Os clientes recebem o aviso 7 dias antes e confirmam com um toque.</p>
      <button arg-button size="sm">Ativar lembretes</button>
    </article>
  `,
  styles: `
    .doc-showcase {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
      max-width: 24rem;
    }

    h4,
    p {
      margin: 0;
    }
  `,
})
export class ShowcaseExample {}
