import { Component, input } from '@angular/core';
import { ArgAvatar } from '../../avatar/avatar';
import { ARG_LIST } from '../../list/list';
import { ArgAppShell } from '../app-shell';

/**
 * Shell numa caixa de 28rem de altura; numa aplicação ele ocupa a tela toda.
 * Aqui o modo compacto começa em 560 px, para caber na página do catálogo.
 */
@Component({
  selector: 'doc-app-shell-basic-example',
  imports: [ArgAppShell, ArgAvatar, ARG_LIST],
  template: `
    <arg-app-shell
      brandName="Clínica Patas"
      [brandLogo]="logo"
      brandHref="#"
      [compactBelow]="width() ? 768 : 560"
    >
      <div arg-app-shell-actions><arg-avatar name="Maria Souza" size="sm" /></div>
      <nav arg-app-shell-nav aria-label="Principal">
        <ul arg-list>
          @for (page of pages; track page) {
            <li arg-list-item>
              <a
                arg-list-action
                href="#"
                [attr.aria-current]="page === current ? 'page' : null"
                (click)="$event.preventDefault(); current = page"
              >
                <span arg-list-title>{{ page }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>
      <div class="doc-page">
        <h2>{{ current }}</h2>
        <p>O conteúdo da página fica aqui, na área principal, com rolagem própria.</p>
      </div>
    </arg-app-shell>
  `,
  styles: `
    :host {
      flex: 1 1 100%;
    }
    arg-app-shell {
      --arg-app-shell-height: 28rem;

      max-width: var(--doc-shell-width, none);
      border: 1px solid var(--arg-color-border);
      border-radius: var(--arg-radius-container);
    }
    .doc-page {
      padding: var(--arg-space-6);
    }
    .doc-page h2 {
      margin: 0 0 var(--arg-space-2);
    }
  `,
  host: { '[style.--doc-shell-width]': 'width()' },
})
export class AppShellBasicExample {
  /** Largura máxima da caixa, para mostrar o modo compacto. */
  readonly width = input<string | null>(null);
  protected readonly pages = ['Agenda', 'Clientes', 'Pets', 'Financeiro'];
  protected current = 'Agenda';
  // Logo gerado aqui mesmo, para o exemplo não depender de site externo
  protected readonly logo =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#d27a4c"/><circle cx="16" cy="19" r="6" fill="#fff"/><circle cx="10" cy="11" r="3" fill="#fff"/><circle cx="16" cy="8" r="3" fill="#fff"/><circle cx="22" cy="11" r="3" fill="#fff"/></svg>',
    );
}

/** Mais estreito que `compactBelow` (768 px): o menu vira gaveta, aberta pelo botão. */
@Component({
  selector: 'doc-app-shell-compact-example',
  imports: [AppShellBasicExample],
  template: '<doc-app-shell-basic-example width="22rem" />',
  styles: ':host { flex: 1 1 100%; display: flex; }',
})
export class AppShellCompactExample {}
