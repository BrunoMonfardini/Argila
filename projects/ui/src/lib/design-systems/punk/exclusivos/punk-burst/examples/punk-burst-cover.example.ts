import { Component } from '@angular/core';
import { ArgPunkBurst } from '../punk-burst';

/** A estrela como ornamento de uma capa, como a tela de entrada da referência. */
@Component({
  selector: 'doc-punk-burst-cover-example',
  imports: [ArgPunkBurst],
  template: `
    <div class="cover">
      <arg-punk-burst />
      <p class="title">Gerencie seus leads num lugar só</p>
    </div>
  `,
  styles: `
    .cover {
      display: grid;
      gap: var(--arg-space-4);
      justify-items: start;
    }

    arg-punk-burst {
      --arg-punk-burst-size: 8rem;
    }

    .title {
      margin: 0;
      font-family: var(--arg-font-family-heading);
      font-size: var(--arg-font-size-heading-md);
      font-weight: var(--arg-font-weight-heading);
      text-transform: uppercase;
    }
  `,
})
export class PunkBurstCoverExample {}
