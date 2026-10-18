import { Component } from '@angular/core';
import { ArgAlert } from '../../lib/alert/alert';
import { ArgBadge } from '../../lib/badge/badge';
import { ArgButton } from '../../lib/button/button';
import { ARG_CARD } from '../../lib/card/card';

/** Sugestão gerada por IA: marcada, explicada e sempre com a decisão da pessoa. */
@Component({
  selector: 'doc-pattern-ai-suggestion',
  imports: [ARG_CARD, ArgBadge, ArgButton],
  template: `
    <article arg-card class="doc-ai">
      <span arg-badge tone="info">Sugestão automática</span>
      <p>Thor costuma vir a cada 30 dias. Sugerimos banho na sexta, 21/11, às 10h.</p>
      <p class="doc-ai__why">Com base nos últimos 6 agendamentos.</p>
      <footer>
        <button arg-button size="sm">Agendar</button>
        <button arg-button size="sm" variant="secondary">Escolher outro horário</button>
      </footer>
    </article>
  `,
  styles: `
    .doc-ai {
      display: grid;
      gap: var(--arg-space-2);
      justify-items: start;
      max-width: 26rem;
    }

    p {
      margin: 0;
    }

    .doc-ai__why {
      color: var(--arg-color-text-muted);
      font-size: var(--arg-font-size-body-sm);
    }

    footer {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
  `,
})
export class AiSuggestionExample {}

/** Quando a IA pode errar, o aviso vem antes do conteúdo. */
@Component({
  selector: 'doc-pattern-ai-limits',
  imports: [ArgAlert],
  template: `
    <div arg-alert tone="info" heading="Resumo feito automaticamente">
      Confira com o prontuário antes de enviar ao tutor.
    </div>
  `,
})
export class AiLimitsExample {}
