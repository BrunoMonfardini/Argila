import { Component, signal } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_TABS } from '../../lib/tabs/tabs';
import { ArgTooltip } from '../../lib/tooltip/tooltip';

/** Mais detalhes no lugar: o botão diz se está aberto (`aria-expanded`). */
@Component({
  selector: 'doc-pattern-disclosure-more',
  imports: [ArgButton],
  template: `
    <div class="doc-stack">
      <p>Thor: golden retriever, 4 anos, 32 kg.</p>
      <p id="mais-detalhes" [hidden]="!open()">
        Alergia a shampoo com perfume. Prefere atendimento pela manhã.
      </p>
      <button
        arg-button
        variant="tertiary"
        size="sm"
        aria-controls="mais-detalhes"
        [attr.aria-expanded]="open()"
        (click)="open.set(!open())"
      >
        {{ open() ? 'Mostrar menos' : 'Mostrar mais' }}
      </button>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
    }

    p {
      margin: 0;
    }
  `,
})
export class DisclosureMoreExample {
  protected readonly open = signal(false);
}

/** Conteúdo do mesmo nível, um por vez: abas. */
@Component({
  selector: 'doc-pattern-disclosure-tabs',
  imports: [ARG_TABS],
  template: `
    <arg-tabs label="Ficha do pet">
      <arg-tab label="Dados">Golden retriever, 4 anos.</arg-tab>
      <arg-tab label="Vacinas">V10 em dia.</arg-tab>
    </arg-tabs>
  `,
})
export class DisclosureTabsExample {}

/** Uma dica curta sobre um controle: tooltip, que abre também no foco. */
@Component({
  selector: 'doc-pattern-disclosure-tip',
  imports: [ArgButton, ArgTooltip],
  template: `<button arg-button variant="secondary" argTooltip="Envia o lembrete por WhatsApp">
    Lembrar cliente
  </button>`,
})
export class DisclosureTipExample {}
