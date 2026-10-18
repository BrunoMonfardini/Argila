import { Component, signal } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';
import { ArgProgressBar } from '../../lib/progress-bar/progress-bar';
import { ArgSpinner } from '../../lib/spinner/spinner';

/** Tela cheia: só quando não há nada para mostrar ainda, com o que está acontecendo. */
@Component({
  selector: 'doc-template-loader-page',
  imports: [ArgSpinner],
  template: `
    <div class="doc-template__page">
      <arg-spinner size="lg" label="Abrindo a agenda" />
      <p>Abrindo a agenda…</p>
    </div>
  `,
  styles: `
    .doc-template__page {
      display: grid;
      place-items: center;
      gap: var(--arg-space-3);
      min-height: 12rem;
    }

    p {
      margin: 0;
    }
  `,
})
export class LoaderPageTemplate {}

/** De seção: o resto da tela funciona enquanto um bloco carrega. */
@Component({
  selector: 'doc-template-loader-section',
  imports: [ARG_CARD, ArgSpinner],
  template: `
    <article arg-card class="doc-template">
      <h4>Faturamento do mês</h4>
      <div class="doc-template__section">
        <arg-spinner label="Carregando o faturamento" />
      </div>
    </article>
  `,
  styles: `
    .doc-template {
      max-width: 22rem;
    }

    h4 {
      margin: 0;
    }

    .doc-template__section {
      display: grid;
      place-items: center;
      min-height: 6rem;
    }
  `,
})
export class LoaderSectionTemplate {}

/** De ação: o botão carrega; com duração conhecida, a barra mostra quanto falta. */
@Component({
  selector: 'doc-template-loader-action',
  imports: [ArgButton, ArgProgressBar],
  template: `
    <div class="doc-template">
      <button arg-button [loading]="sending()" (click)="send()">Enviar fotos</button>
      @if (progress() !== undefined) {
        <progress arg-progress label="Enviando fotos" [value]="progress()" [max]="100"></progress>
      }
    </div>
  `,
  styles: `
    .doc-template {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
      max-width: 22rem;
    }

    progress {
      width: 100%;
    }
  `,
})
export class LoaderActionTemplate {
  protected readonly sending = signal(false);
  protected readonly progress = signal<number | undefined>(undefined);

  protected send(): void {
    this.sending.set(true);
    this.progress.set(0);
    const timer = setInterval(() => {
      const next = (this.progress() ?? 0) + 25;
      this.progress.set(next);
      if (next >= 100) {
        clearInterval(timer);
        this.sending.set(false);
      }
    }, 300);
  }
}
