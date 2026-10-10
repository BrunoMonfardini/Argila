import { Component } from '@angular/core';
import { ArgLink } from '../link';

@Component({
  selector: 'doc-link-inline-example',
  imports: [ArgLink],
  template: `
    <p>
      Seu agendamento foi confirmado. Você pode <a arg-link href="#reagendar">reagendar</a> até 24
      horas antes do horário.
    </p>
  `,
})
export class LinkInlineExample {}
