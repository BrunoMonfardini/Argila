import { Component } from '@angular/core';
import { ArgLink } from '../link';

@Component({
  selector: 'doc-link-muted-example',
  imports: [ArgLink],
  template: `
    <small>
      <a arg-link variant="muted" href="#termos">Termos de uso</a> ·
      <a arg-link variant="muted" href="#privacidade">Privacidade</a> ·
      <a arg-link variant="muted" external href="https://status.exemplo.com">Status do sistema</a>
    </small>
  `,
})
export class LinkMutedExample {}
