import { Component } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';
import { ArgDivider } from '../../lib/divider/divider';
import { ArgEmptyState } from '../../lib/empty-state/empty-state';
import { ArgLink } from '../../lib/link/link';
import { ArgProgressBar } from '../../lib/progress-bar/progress-bar';

/** Fim de um fluxo: confirma o que aconteceu, resume e mostra os próximos passos. */
@Component({
  selector: 'doc-template-ending',
  imports: [ARG_CARD, ArgButton, ArgDivider, ArgEmptyState, ArgLink],
  template: `
    <article arg-card class="doc-template">
      <section arg-empty-state heading="Agendamento confirmado" icon="check-circle" [level]="3">
        Thor tem banho e tosa na sexta, 24/10, às 10h. Enviamos a confirmação por e-mail.
      </section>
      <hr arg-divider />
      <h4>Próximos passos</h4>
      <ol>
        <li>Leve a carteira de vacinação no dia.</li>
        <li>Chegue 10 minutos antes.</li>
      </ol>
      <footer class="doc-template__actions">
        <button arg-button>Ver agendamento</button>
        <button arg-button variant="secondary">Agendar outro pet</button>
      </footer>
      <a arg-link href="#" (click)="$event.preventDefault()">Voltar ao início</a>
    </article>
  `,
  styles: `
    .doc-template {
      display: grid;
      gap: var(--arg-space-4);
      width: 100%;
      max-width: 32rem;
    }

    h4,
    ol {
      margin: 0;
    }

    .doc-template__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
  `,
})
export class EndingTemplate {}

/** Fim de um cadastro em etapas: a barra cheia fecha a sensação de progresso. */
@Component({
  selector: 'doc-template-ending-steps',
  imports: [ArgButton, ArgEmptyState, ArgProgressBar],
  template: `
    <div class="doc-template">
      <progress arg-progress label="Cadastro" [value]="4" [max]="4"></progress>
      <section arg-empty-state heading="Cadastro concluído" icon="check-circle" [level]="3">
        A clínica já pode receber agendamentos pelo app.
        <button arg-button arg-empty-state-action>Abrir a agenda</button>
      </section>
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
export class EndingStepsTemplate {}
