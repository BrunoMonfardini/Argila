import { Component } from '@angular/core';
import { ArgLink } from '../../link/link';
import { ARG_BREADCRUMB } from '../breadcrumb';

/** As páginas acima são links; a atual é só texto, com `current`. */
@Component({
  selector: 'doc-breadcrumb-pet-example',
  imports: [ARG_BREADCRUMB, ArgLink],
  template: `
    <nav arg-breadcrumb>
      <li arg-breadcrumb-item>
        <a arg-link variant="muted" href="#clientes" (click)="$event.preventDefault()">Clientes</a>
      </li>
      <li arg-breadcrumb-item>
        <a arg-link variant="muted" href="#maria" (click)="$event.preventDefault()">Maria Souza</a>
      </li>
      <li arg-breadcrumb-item>
        <a arg-link variant="muted" href="#pets" (click)="$event.preventDefault()">Pets</a>
      </li>
      <li arg-breadcrumb-item current>Thor</li>
    </nav>
  `,
})
export class BreadcrumbPetExample {}
