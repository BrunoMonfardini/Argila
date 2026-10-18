import { Component, signal } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';
import { ArgProgressBar } from '../../lib/progress-bar/progress-bar';
import { ArgSpinner } from '../../lib/spinner/spinner';

/** Salvar: o botão mostra a espera; o resto da tela continua igual. */
@Component({
  selector: 'doc-pattern-loading-save',
  imports: [ArgButton],
  template: `
    <button arg-button [loading]="saving()" (click)="save()">Salvar alterações</button>
    @if (saved()) {
      <p role="status">Alterações salvas.</p>
    }
  `,
})
export class LoadingSaveExample {
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);

  protected save(): void {
    this.saving.set(true);
    this.saved.set(false);
    setTimeout(() => {
      this.saving.set(false);
      this.saved.set(true);
    }, 800);
  }
}

/** Um bloco da tela carrega sozinho, com nome para o leitor de tela. */
@Component({
  selector: 'doc-pattern-loading-block',
  imports: [ARG_CARD, ArgSpinner],
  template: `
    <article arg-card>
      <h4>Próximas vacinas</h4>
      <arg-spinner label="Carregando as próximas vacinas" />
    </article>
  `,
  styles: `
    article {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
      max-width: 20rem;
    }

    h4 {
      margin: 0;
    }
  `,
})
export class LoadingBlockExample {}

/** Com duração conhecida, a barra mostra quanto falta. */
@Component({
  selector: 'doc-pattern-loading-progress',
  imports: [ArgProgressBar],
  template: `<progress
    arg-progress
    label="Importando clientes"
    [value]="68"
    [max]="100"
  ></progress>`,
  styles: `
    progress {
      width: min(100%, 20rem);
    }
  `,
})
export class LoadingProgressExample {}
