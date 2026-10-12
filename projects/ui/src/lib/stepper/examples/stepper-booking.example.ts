import { Component, input, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgStepper, ArgStepperOrientation } from '../stepper';

const STEPS = ['Serviço', 'Pet', 'Horário', 'Confirmação'];

/** Agendamento em etapas. Com `navigable`, as etapas feitas viram botões para voltar. */
@Component({
  selector: 'doc-stepper-booking-example',
  imports: [ArgButton, ArgStepper],
  template: `
    <div class="doc-stack">
      <arg-stepper
        label="Etapas do agendamento"
        [steps]="steps"
        [current]="current()"
        [orientation]="orientation()"
        navigable
        (stepSelect)="current.set($event)"
      />
      <p class="doc-step">{{ steps[current()] }}: o conteúdo da etapa fica aqui.</p>
      <div class="doc-row">
        <button
          arg-button
          variant="secondary"
          [disabled]="current() === 0"
          (click)="current.set(current() - 1)"
        >
          Voltar
        </button>
        <button
          arg-button
          [disabled]="current() === steps.length - 1"
          (click)="current.set(current() + 1)"
        >
          Avançar
        </button>
      </div>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-4);
      max-width: 40rem;
    }
    .doc-step {
      margin: 0;
    }
    .doc-row {
      display: flex;
      gap: var(--arg-space-2);
    }
  `,
})
export class StepperBookingExample {
  /** Orientação do stepper no exemplo. */
  readonly orientation = input<ArgStepperOrientation>('horizontal');
  protected readonly steps = STEPS;
  protected readonly current = signal(2);
}

/** Vertical, para fluxos longos ou ao lado do conteúdo. */
@Component({
  selector: 'doc-stepper-vertical-example',
  imports: [StepperBookingExample],
  template: '<doc-stepper-booking-example orientation="vertical" />',
  styles: ':host { flex: 1 1 100%; display: flex; }',
})
export class StepperVerticalExample {}
