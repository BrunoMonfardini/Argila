import { Component, inject, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ARG_CHOICE } from '../../choice/choice';
import { ARG_DIALOG_DATA, ArgDialogRef, ArgDialogTitle } from '../../dialog/dialog';
import { ArgIconButton } from '../../icon-button/icon-button';
import { ArgDrawer } from '../drawer';

const SERVICES = ['Banho', 'Tosa', 'Consulta', 'Vacina'];

/** Conteúdo da gaveta: recebe os filtros atuais e devolve os novos. */
@Component({
  selector: 'doc-agenda-filters-drawer',
  imports: [ArgButton, ARG_CHOICE, ArgDialogTitle, ArgIconButton],
  template: `
    <header class="doc-head">
      <h2 argDialogTitle>Filtros da agenda</h2>
      <button arg-icon-button icon="x" label="Fechar" (click)="ref.close()"></button>
    </header>
    <div arg-dialog-content>
      <arg-choice-group label="Serviços">
        @for (service of services; track service) {
          <label arg-choice>
            <input
              type="checkbox"
              arg-checkbox
              [checked]="chosen().has(service)"
              (change)="toggle(service)"
            />
            {{ service }}
          </label>
        }
      </arg-choice-group>
    </div>
    <footer arg-dialog-actions>
      <button arg-button variant="secondary" (click)="clear()">Limpar</button>
      <button arg-button (click)="apply()">Aplicar</button>
    </footer>
  `,
  styles: `
    .doc-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--arg-space-2);
    }
  `,
})
export class AgendaFiltersDrawer {
  protected readonly ref = inject<ArgDialogRef<string[]>>(ArgDialogRef);
  protected readonly services = SERVICES;
  protected readonly chosen = signal(new Set(inject(ARG_DIALOG_DATA) as string[]));

  protected clear(): void {
    this.chosen.set(new Set());
  }

  protected apply(): void {
    this.ref.close([...this.chosen()]);
  }

  protected toggle(service: string): void {
    this.chosen.update((chosen) => {
      const next = new Set(chosen);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  }
}

/** No desktop, abre pela direita; numa tela estreita (ou no celular), sobe de baixo. */
@Component({
  selector: 'doc-drawer-filters-example',
  imports: [ArgButton],
  template: `
    <button arg-button variant="secondary" (click)="open()">Filtros</button>
    <p class="doc-said">
      {{ filters().length ? 'Mostrando: ' + filters().join(', ') : 'Mostrando todos os serviços' }}
    </p>
  `,
  styles: `
    .doc-said {
      flex: 1 1 100%;
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class DrawerFiltersExample {
  private readonly drawer = inject(ArgDrawer);
  protected readonly filters = signal<string[]>(['Banho']);

  protected async open(): Promise<void> {
    const ref = this.drawer.open<AgendaFiltersDrawer, string[], string[]>(AgendaFiltersDrawer, {
      data: this.filters(),
    });
    const filters = await ref.closed;
    if (filters) this.filters.set(filters);
  }
}
