import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ARG_FIELD } from '../../field/field';
import { ArgDateInput, IsoDate, addDays, formatBr, todayIso, weekday } from '../date-input';

/** Feriados de exemplo: Finados e Proclamação da República. */
const HOLIDAYS = new Set(['2026-11-02', '2026-11-15']);

/**
 * Agendamento a partir de hoje e até 60 dias, sem domingos nem feriados.
 * Digite a data ou use o calendário (setas, PageUp/PageDown, Enter).
 */
@Component({
  selector: 'doc-date-picker-booking-example',
  imports: [ARG_FIELD, ArgDateInput, ReactiveFormsModule],
  template: `
    <div class="doc-stack">
      <arg-field label="Data do banho" hint="De segunda a sábado." [error]="error()">
        <input arg-date [formControl]="date" [min]="min" [max]="max" [blocked]="closed" />
      </arg-field>
      <p class="doc-said">
        Valor do formulário: <code>{{ value() ?? 'null' }}</code>
      </p>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-2);
      max-width: 20rem;
    }
    .doc-said {
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class DatePickerBookingExample {
  protected readonly min = todayIso();
  protected readonly max = addDays(this.min, 60);
  protected readonly closed = (iso: IsoDate) => weekday(iso) === 0 || HOLIDAYS.has(iso);
  protected readonly date = new FormControl<IsoDate | null>(null, Validators.required);
  protected readonly value = toSignal(this.date.valueChanges, { initialValue: null });
  // Mudanças de valor, estado ou "tocado" recalculam a mensagem
  private readonly events = toSignal(this.date.events);

  protected error(): string | null {
    this.events();
    const errors = this.date.touched ? this.date.errors : null;
    if (!errors) return null;
    // O que foi digitado vem antes do required: com a data incompleta, o
    // valor é null e os dois erros aparecem juntos
    if (errors['incomplete']) return 'Data incompleta: use dd/mm/aaaa.';
    if (errors['date']) return 'Essa data não existe.';
    if (errors['required']) return 'Escolha uma data.';
    if (errors['dateMin']) return `Escolha a partir de ${formatBr(this.min)}.`;
    if (errors['dateMax']) return `Escolha até ${formatBr(this.max)}.`;
    return 'Não atendemos nesse dia: escolha outro.';
  }
}
