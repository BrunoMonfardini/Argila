import { Component, computed, signal } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ArgEmptyState } from '../../lib/empty-state/empty-state';
import { ARG_FIELD } from '../../lib/field/field';
import { ArgInput } from '../../lib/input/input';

/** Lista vazia: diz o que vai aparecer ali e oferece o primeiro passo. */
@Component({
  selector: 'doc-template-empty-list',
  imports: [ArgButton, ArgEmptyState],
  template: `
    <section arg-empty-state heading="Nenhum agendamento hoje" icon="calendar" [level]="3" bordered>
      Os agendamentos do dia aparecem aqui, em ordem de horário.
      <button arg-button arg-empty-state-action>Novo agendamento</button>
    </section>
  `,
})
export class EmptyListTemplate {}

const CLIENTS = ['Maria Souza', 'João Pereira', 'Ana Lima'];

/** Busca sem resultado: repete o termo e oferece limpar a busca. */
@Component({
  selector: 'doc-template-empty-search',
  imports: [ArgButton, ArgEmptyState, ARG_FIELD, ArgInput],
  template: `
    <div class="doc-template">
      <arg-field label="Buscar cliente">
        <input arg-input type="search" [value]="query()" (input)="search($event)" />
      </arg-field>
      @if (results().length) {
        <ul>
          @for (client of results(); track client) {
            <li>{{ client }}</li>
          }
        </ul>
      } @else {
        <section
          arg-empty-state
          [heading]="'Nada encontrado para “' + query() + '”'"
          icon="search"
          [level]="3"
        >
          Confira a grafia ou busque pelo telefone.
          <button arg-button arg-empty-state-action variant="secondary" (click)="clear()">
            Limpar busca
          </button>
        </section>
      }
    </div>
  `,
  styles: `
    .doc-template {
      display: grid;
      gap: var(--arg-space-4);
      width: 100%;
      max-width: 32rem;
    }
  `,
})
export class EmptySearchTemplate {
  protected readonly query = signal('Mariana');
  protected readonly results = computed(() =>
    CLIENTS.filter((client) => client.toLowerCase().includes(this.query().trim().toLowerCase())),
  );

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.query.set('');
  }
}

/** Primeiro uso: dá as boas-vindas e explica o valor antes de pedir algo. */
@Component({
  selector: 'doc-template-first-use',
  imports: [ArgButton, ArgEmptyState],
  template: `
    <section arg-empty-state heading="Cadastre o primeiro pet" icon="paw" [level]="3" bordered>
      Com os pets cadastrados, você agenda em dois toques e recebe os lembretes das vacinas.
      <button arg-button arg-empty-state-action>Cadastrar pet</button>
      <button arg-button arg-empty-state-action variant="tertiary">Importar de uma planilha</button>
    </section>
  `,
})
export class FirstUseTemplate {}
