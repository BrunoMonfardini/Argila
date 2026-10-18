import { Component, signal } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_CHOICE } from '../../lib/choice/choice';

/** Pergunta curta, logo depois da tarefa, com resposta em um toque. */
@Component({
  selector: 'doc-pattern-experience-rating',
  imports: [ARG_CHOICE, ArgButton],
  template: `
    @if (sent()) {
      <p role="status">Obrigado! Sua resposta ajuda a melhorar o app.</p>
    } @else {
      <form class="doc-rating" (submit)="$event.preventDefault(); sent.set(true)">
        <arg-choice-group label="Como foi agendar hoje?">
          @for (option of options; track option) {
            <label arg-choice><input type="radio" name="nota" arg-radio /> {{ option }}</label>
          }
        </arg-choice-group>
        <button arg-button type="submit" size="sm">Enviar</button>
      </form>
    }
  `,
  styles: `
    .doc-rating {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
    }
  `,
})
export class ExperienceRatingExample {
  protected readonly options = ['Fácil', 'Normal', 'Difícil'];
  protected readonly sent = signal(false);
}
