import { Component } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ARG_CARD } from '../card';

/** Imagem de borda a borda no topo; `elevated` troca a borda por sombra. */
@Component({
  selector: 'doc-card-media-example',
  imports: [ARG_CARD, ArgButton],
  template: `
    <article arg-card variant="elevated">
      <img arg-card-media [src]="image" alt="" width="384" height="160" />
      <h3 arg-card-title>Banho e tosa</h3>
      <p arg-card-description>A partir de R$ 60 · cerca de 1h30</p>
      <p arg-card-content>Inclui corte de unhas e limpeza das orelhas.</p>
      <footer arg-card-actions>
        <button arg-button size="sm">Agendar</button>
      </footer>
    </article>
  `,
  styles: `
    article {
      max-width: 24rem;
    }
    img {
      height: 10rem;
    }
  `,
})
export class CardMediaExample {
  // Imagem gerada aqui mesmo, para o exemplo não depender de site externo
  protected readonly image =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 160"><rect width="384" height="160" fill="#f3e3d8"/><circle cx="192" cy="96" r="28" fill="#d27a4c"/><circle cx="152" cy="56" r="12" fill="#d27a4c"/><circle cx="178" cy="40" r="12" fill="#d27a4c"/><circle cx="206" cy="40" r="12" fill="#d27a4c"/><circle cx="232" cy="56" r="12" fill="#d27a4c"/></svg>',
    );
}
