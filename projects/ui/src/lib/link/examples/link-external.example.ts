import { Component } from '@angular/core';
import { ArgLink } from '../link';

@Component({
  selector: 'doc-link-external-example',
  imports: [ArgLink],
  template: `
    <p>
      Dúvidas sobre os cuidados depois da consulta? Leia o
      <a arg-link external href="https://exemplo.com/cuidados">guia de cuidados</a>.
    </p>
  `,
})
export class LinkExternalExample {}
