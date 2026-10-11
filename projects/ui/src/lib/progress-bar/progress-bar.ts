import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ArgProgressBarSize = 'sm' | 'md';

/**
 * Barra de progresso sobre o `<progress>` nativo. Com `value`, é
 * determinada; sem `value` (ou `null`), é indeterminada. O `label` é
 * obrigatório: vira o nome acessível, e sem ele o template não compila.
 *
 * ```html
 * <progress arg-progress label="Enviando fotos" [value]="enviadas()" [max]="total()"></progress>
 * <progress arg-progress label="Gerando relatório"></progress>
 * ```
 */
@Component({
  selector: 'progress[arg-progress]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './progress-bar.css',
  host: {
    '[class]': '"arg-progress arg-progress--" + size()',
    '[attr.value]': 'value() ?? null',
    '[attr.max]': 'max()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuetext]': 'valueText() ?? null',
  },
})
export class ArgProgressBar {
  /** O que está em andamento, para leitores de tela: "Enviando fotos". */
  readonly label = input.required<string>();
  /** Quanto já foi feito, de 0 a `max`. Sem valor, a barra fica indeterminada. */
  readonly value = input<number | null>();
  /** Total. O padrão é 100, para `value` em porcentagem. */
  readonly max = input(100);
  /** Valor lido no lugar da porcentagem, ex.: "3 de 5 fotos". */
  readonly valueText = input<string>();
  /** Espessura: `sm` (4 px) dentro de cards e listas; `md` (8 px) no resto. */
  readonly size = input<ArgProgressBarSize>('md');
}
