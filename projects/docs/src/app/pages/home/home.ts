import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Página inicial do catálogo. */
@Component({
  selector: 'doc-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Argila</h1>
    <p class="doc-lead">
      Biblioteca de componentes Angular compartilhada entre todos os nossos produtos. Cada página
      mostra o componente funcionando, os controles para testar variações e o código para copiar.
    </p>
  `,
})
export class HomePage {}
