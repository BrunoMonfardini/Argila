import { Component } from '@angular/core';
import { ArgAvatar } from '../../avatar/avatar';
import { ArgBadge } from '../../badge/badge';
import { ArgButton } from '../../button/button';
import { ARG_CARD } from '../card';

@Component({
  selector: 'doc-card-basic-example',
  imports: [ARG_CARD, ArgAvatar, ArgBadge, ArgButton],
  template: `
    <article arg-card>
      <header arg-card-header>
        <arg-avatar name="Maria Souza" decorative />
        <div>
          <h3 arg-card-title>Maria Souza</h3>
          <p arg-card-description>Tutora de Thor e Mel</p>
        </div>
      </header>
      <p arg-card-content>
        Prefere atendimento pela manhã. Thor tem alergia a shampoo com perfume.
      </p>
      <footer arg-card-actions>
        <button arg-button variant="secondary" size="sm">Ver histórico</button>
        <span arg-badge tone="success">Cliente desde 2023</span>
      </footer>
    </article>
  `,
  styles: `
    article {
      max-width: 24rem;
    }
  `,
})
export class CardBasicExample {}
