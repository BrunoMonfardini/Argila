import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArgButton } from '../../button/button';
import { ArgTimeSlot, ArgTimeSlots } from '../time-slots';

/** Horários de cada dia; os ocupados variam para o exemplo. */
function slotsOf(day: number): ArgTimeSlot[] {
  const times = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
  ];
  if (day === 2) return times.map((time) => ({ time, available: false }));
  return times.map((time, i) => ({ time, available: (i + day) % 3 !== 0 }));
}

const DAYS = ['Hoje', 'Amanhã', 'Quinta-feira'];

/**
 * Trocar o dia busca os horários de novo (carregando por 1 segundo).
 * Tab entra na grade; as setas andam pelos livres e escolhem.
 */
@Component({
  selector: 'doc-time-slots-booking-example',
  imports: [ArgButton, ArgTimeSlots, ReactiveFormsModule],
  template: `
    <div class="doc-stack">
      <div class="doc-days" role="group" aria-label="Dia">
        @for (name of days; track name; let i = $index) {
          <button
            arg-button
            size="sm"
            [variant]="day() === i ? 'primary' : 'secondary'"
            [attr.aria-pressed]="day() === i"
            (click)="pickDay(i)"
          >
            {{ name }}
          </button>
        }
      </div>
      <fieldset
        arg-time-slots
        label="Horário do banho"
        [slots]="slots()"
        [loading]="loading()"
        [formControl]="time"
      ></fieldset>
      <p class="doc-said">
        Valor do formulário: <code>{{ value() ?? 'null' }}</code>
      </p>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-4);
      max-width: 32rem;
    }
    .doc-days {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
    }
    .doc-said {
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class TimeSlotsBookingExample {
  protected readonly days = DAYS;
  protected readonly day = signal(0);
  protected readonly slots = signal(slotsOf(0));
  protected readonly loading = signal(false);
  protected readonly time = new FormControl<string | null>(null);
  protected readonly value = toSignal(this.time.valueChanges, { initialValue: null });

  protected pickDay(day: number): void {
    this.day.set(day);
    this.time.setValue(null);
    this.loading.set(true);
    // Simula a busca no servidor
    setTimeout(() => {
      this.slots.set(slotsOf(day));
      this.loading.set(false);
    }, 1000);
  }
}
