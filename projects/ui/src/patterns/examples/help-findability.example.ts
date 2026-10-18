import { Component } from '@angular/core';
import { ARG_FIELD } from '../../lib/field/field';
import { ArgIconButton } from '../../lib/icon-button/icon-button';
import { ArgInput } from '../../lib/input/input';
import { ArgLink } from '../../lib/link/link';
import { ArgTooltip } from '../../lib/tooltip/tooltip';

/** Ajuda no ponto da dúvida: uma dica curta ao lado do campo. */
@Component({
  selector: 'doc-pattern-help-inline',
  imports: [ARG_FIELD, ArgIconButton, ArgInput, ArgTooltip],
  template: `
    <div class="doc-help">
      <arg-field label="Microchip" hint="15 números, na carteira de vacinação">
        <input arg-input inputmode="numeric" />
      </arg-field>
      <button
        arg-icon-button
        icon="help-circle"
        label="O que é o microchip"
        argTooltip="Chip de identificação implantado pelo veterinário"
      ></button>
    </div>
  `,
  styles: `
    .doc-help {
      display: flex;
      gap: var(--arg-space-2);
      align-items: center;
      max-width: 24rem;
    }

    arg-field {
      flex: 1;
    }
  `,
})
export class HelpInlineExample {}

/** Caminho fixo para a ajuda completa, sempre no mesmo lugar. */
@Component({
  selector: 'doc-pattern-help-link',
  imports: [ArgLink],
  template: `<p>
    Ainda com dúvida? <a arg-link href="#" (click)="$event.preventDefault()">Fale com o suporte</a>.
  </p>`,
})
export class HelpLinkExample {}
