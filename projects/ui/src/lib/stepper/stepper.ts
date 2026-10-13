import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ArgIcon } from '../icon/icon';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconCheck } from '../icon/icons.generated';

export type ArgStepState = 'done' | 'current' | 'pending';
export type ArgStepperOrientation = 'horizontal' | 'vertical';

/** Estado lido pelo leitor de tela depois do nome da etapa. */
const STATE_TEXT: Record<ArgStepState, string> = {
  done: 'concluída',
  current: 'atual',
  pending: 'pendente',
};

function stateOf(index: number, current: number): ArgStepState {
  if (index < current) return 'done';
  return index === current ? 'current' : 'pending';
}

/**
 * Indicador de etapas de um fluxo em sequência (agendamento, cadastro,
 * pagamento). Os estados feita, atual e pendente se distinguem pela forma e
 * pelo texto, não só pela cor:
 *
 * - feita: ✓ no marcador e ", concluída" para o leitor de tela;
 * - atual: marcador preenchido, rótulo em negrito e `aria-current="step"`;
 * - pendente: marcador só com contorno e ", pendente" para o leitor de tela.
 *
 * ```html
 * <arg-stepper [steps]="['Serviço', 'Horário', 'Pagamento']" [current]="1" />
 * ```
 */
@Component({
  selector: 'arg-stepper',
  imports: [ArgIcon, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.css', '../internal/sr-only.css'],
  host: {
    class: 'arg-stepper',
    '[class.arg-stepper--vertical]': 'orientation() === "vertical"',
  },
})
export class ArgStepper {
  /** Nome de cada etapa, na ordem. */
  readonly steps = input.required<readonly string[]>();
  /** Índice da etapa atual, começando em 0. As anteriores ficam feitas. */
  readonly current = input(0);
  /** Nome da lista de etapas para leitores de tela. */
  readonly label = input('Etapas');
  /** `horizontal` em cima do conteúdo; `vertical` ao lado, para fluxos longos. */
  readonly orientation = input<ArgStepperOrientation>('horizontal');
  /** Etapas feitas viram botões, para voltar a elas (`stepSelect`). */
  readonly navigable = input(false, { transform: booleanAttribute });
  /** Etapa feita escolhida para voltar, quando `navigable`. */
  readonly stepSelect = output<number>();

  protected readonly items = computed(() =>
    this.steps().map((label, index) => {
      const state = stateOf(index, this.current());
      return { label, index, state, stateText: STATE_TEXT[state] };
    }),
  );

  constructor() {
    inject(ArgIconRegistry).register([argIconCheck]);
  }
}
