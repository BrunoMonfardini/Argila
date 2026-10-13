import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArgAnnouncer } from '../internal/announcer';
import { injectUniqueId } from '../internal/unique-id';
import { ArgValueControlBase } from '../internal/value-control';
import { ArgSkeleton } from '../skeleton/skeleton';

/** Um horário da agenda. */
export interface ArgTimeSlot {
  /** Horário mostrado e usado como valor, ex.: "14:30". */
  time: string;
  /** `false` quando já está ocupado. */
  available: boolean;
}

/**
 * Grade de horários livres e ocupados de um dia, sobre `<fieldset>` e
 * rádios nativos: as setas andam entre os horários livres (os ocupados ficam
 * desabilitados e são pulados) e escolhem.
 *
 * ```html
 * <fieldset arg-time-slots label="Horário" [slots]="horarios()" [loading]="carregando()"
 *   [formControl]="horario"></fieldset>
 * ```
 *
 * O valor é o horário escolhido (`"14:30"`), ou `null`. Funciona com
 * Reactive Forms, com formulários de signals e com `[(value)]`.
 */
@Component({
  selector: 'fieldset[arg-time-slots]',
  imports: [ArgSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-slots.html',
  styleUrls: ['./time-slots.css', '../internal/sr-only.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArgTimeSlots), multi: true },
  ],
  host: {
    class: 'arg-time-slots',
    '[attr.aria-busy]': 'loading() || null',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class ArgTimeSlots extends ArgValueControlBase<string | null> {
  /** Nome do grupo (vira a `<legend>`): "Horário". */
  readonly label = input.required<string>();
  /** Horários do dia, na ordem. */
  readonly slots = input<readonly ArgTimeSlot[]>([]);
  /** Buscando os horários: mostra marcadores no lugar da grade. */
  readonly loading = input(false);
  /** Texto quando o dia não tem horários livres. */
  readonly emptyText = input('Nenhum horário livre neste dia.');
  /** Horário escolhido; `null` quando nenhum. */
  readonly value = model<string | null>(null);

  protected readonly name = injectUniqueId('arg-time-slots');
  protected readonly placeholders = Array.from({ length: 8 }, (_, i) => i);
  protected readonly free = computed(() => this.slots().filter((slot) => slot.available).length);

  private readonly announcer = inject(ArgAnnouncer);

  constructor() {
    super();
    // Ao terminar de carregar, diz quantos horários há (os marcadores são ocultos)
    let wasLoading = false;
    effect(() => {
      const loading = this.loading();
      if (wasLoading && !loading) {
        untracked(() =>
          this.announcer.announce(
            this.free() ? `${this.free()} horários livres` : this.emptyText(),
          ),
        );
      }
      wasLoading = loading;
    });
  }

  protected choose(time: string): void {
    this.value.set(time);
    this.notifyChange(time);
  }

  /** Saiu do grupo (não só de um horário para outro): marca como tocado. */
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.element.contains(next)) this.onBlur();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? null);
  }
}
