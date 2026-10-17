import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Trilha de progresso do Punk: uma pílula com pontos e uma alça que anda, como
 * o andamento das campanhas da referência. Exclusivo do Punk.
 *
 * ```html
 * <arg-punk-dot-track label="Campanha Inwood" [value]="3" [max]="8" />
 * ```
 *
 * Para o leitor de tela é uma barra de progresso (`role="progressbar"`); os
 * pontos e a alça são só visuais.
 */
@Component({
  selector: 'arg-punk-dot-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (dot of dots(); track $index) {
      <span class="arg-punk-dot-track__dot" [class.arg-punk-dot-track__dot--done]="dot"></span>
    }
    <span
      class="arg-punk-dot-track__knob"
      [style.--arg-punk-dot-track-progress]="fraction()"
    ></span>
  `,
  styleUrl: './punk-dot-track.css',
  host: {
    class: 'arg-punk-dot-track',
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'clamped()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuetext]': 'valueText()',
  },
})
export class ArgPunkDotTrack {
  /** Nome da trilha para o leitor de tela: "Campanha Inwood". */
  readonly label = input.required<string>();
  /** Etapas concluídas, de 0 a `max`. */
  readonly value = input(0);
  /** Total de etapas: um ponto por etapa. */
  readonly max = input(8);

  protected readonly clamped = computed(() => Math.min(this.max(), Math.max(0, this.value())));
  /** De 0 a 1: onde a alça fica na pílula. */
  protected readonly fraction = computed(() => (this.max() > 0 ? this.clamped() / this.max() : 0));
  protected readonly dots = computed(() =>
    Array.from({ length: Math.max(0, this.max()) }, (_, i) => i < this.clamped()),
  );
  protected readonly valueText = computed(() => `${this.clamped()} de ${this.max()}`);
}
