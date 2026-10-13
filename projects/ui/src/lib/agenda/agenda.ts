import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ArgButton } from '../button/button';
import { IsoDate, addDays, dayLabel, todayIso, weekdayNames } from '../date-picker/dates';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconChevronLeft, argIconChevronRight } from '../icon/icons.generated';
import { ArgIconButton } from '../icon-button/icon-button';
import { injectUniqueId } from '../internal/unique-id';
import {
  ArgAgendaEvent,
  ArgAgendaView,
  ArgPlacedEvent,
  layoutDay,
  rangeLabel,
  timeSlots,
  toMinutes,
  visibleDays,
} from './layout';

export * from './layout';

/** Horário livre escolhido na grade. */
export interface ArgAgendaSlot {
  date: IsoDate;
  time: string;
}

interface Cell {
  day: IsoDate;
  slot: number;
  label: string;
  starting: ArgPlacedEvent[];
  covering: ArgPlacedEvent | null;
}

/**
 * Agenda de dia e de semana, no padrão "grid" do ARIA APG: linhas são
 * horários e colunas são dias. Os agendamentos ficam posicionados pelo
 * horário, lado a lado quando simultâneos.
 *
 * ```html
 * <arg-agenda [events]="agendamentos()" [(date)]="dia" [(view)]="visao"
 *   (eventSelect)="abrir($event)" (slotSelect)="novo($event)" />
 * ```
 *
 * Teclado: setas andam entre horários e dias (passando para a semana
 * vizinha), Home/End vão ao primeiro e ao último dia (com Ctrl, ao primeiro e
 * ao último horário), PageUp/PageDown mudam a semana (ou o dia), Enter ou
 * Espaço abrem o agendamento ou escolhem o horário livre.
 */
@Component({
  selector: 'arg-agenda',
  imports: [ArgButton, ArgIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css', '../internal/sr-only.css'],
  host: {
    class: 'arg-agenda',
    // Clique do mouse num agendamento ou numa célula (os blocos não têm foco próprio)
    '(click)': 'onClick($event)',
  },
})
export class ArgAgenda {
  /** Agendamentos. */
  readonly events = input<readonly ArgAgendaEvent[]>([]);
  /** Dia em foco (ISO). Na semana, a semana que o contém. */
  readonly date = model<IsoDate>(todayIso());
  /** `day` ou `week`. */
  readonly view = model<ArgAgendaView>('week');
  /** Primeiro horário da grade. */
  readonly start = input('08:00');
  /** Fim da grade (o último horário começa antes dele). */
  readonly end = input('19:00');
  /** Intervalo entre horários, em minutos. */
  readonly step = input(30);
  /** Escolheu um agendamento (clique, Enter ou Espaço). */
  readonly eventSelect = output<ArgAgendaEvent>();
  /** Escolheu um horário livre (clique, Enter ou Espaço). */
  readonly slotSelect = output<ArgAgendaSlot>();

  protected readonly headingId = injectUniqueId('arg-agenda-range');
  protected readonly today = todayIso();
  protected readonly weekdays = weekdayNames();
  protected readonly days = computed(() => visibleDays(this.date(), this.view()));
  protected readonly slots = computed(() => timeSlots(this.start(), this.end(), this.step()));
  protected readonly range = computed(() => rangeLabel(this.days()));
  /** Última célula escolhida pela pessoa; `null` até ela navegar. */
  private readonly cursor = signal<{ day: IsoDate; slot: number } | null>(null);
  /**
   * Célula com o foco (roving): só ela entra no Tab. Sempre existe na grade
   * mostrada: começa no dia escolhido e no primeiro horário que ainda não passou.
   */
  private readonly active = computed(() => {
    const days = this.days();
    const cursor = this.cursor();
    const day =
      cursor && days.includes(cursor.day)
        ? cursor.day
        : days.includes(this.date())
          ? this.date()
          : days[0];
    const slot = Math.min(cursor?.slot ?? this.firstSlotFromNow(), this.slots().length - 1);
    return { day, slot };
  });

  private readonly placedByDay = computed(() => {
    const map = new Map<IsoDate, ArgPlacedEvent[]>();
    for (const day of this.days()) {
      map.set(day, layoutDay(this.events(), day, this.start(), this.end(), this.step()));
    }
    return map;
  });

  protected readonly rows = computed(() =>
    this.slots().map((time, slot) => ({
      time,
      cells: this.days().map((day) => this.cell(day, slot, time)),
    })),
  );

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  constructor() {
    inject(ArgIconRegistry).register([argIconChevronLeft, argIconChevronRight]);
  }

  protected isActive(cell: Cell): boolean {
    const active = this.active();
    return active.day === cell.day && active.slot === cell.slot;
  }

  protected dayNumber(day: IsoDate): number {
    return Number(day.slice(8));
  }

  protected weekdayOf(day: IsoDate): string {
    return this.weekdays[new Date(`${day}T12:00:00Z`).getUTCDay()].short;
  }

  protected setView(view: ArgAgendaView): void {
    this.view.set(view);
  }

  protected goToday(): void {
    this.date.set(this.today);
    this.cursor.set({ day: this.today, slot: this.active().slot });
  }

  /** ‹ e ›: um dia ou uma semana. */
  protected move(direction: number): void {
    const days = this.view() === 'week' ? 7 * direction : direction;
    this.date.update((date) => addDays(date, days));
    const { day, slot } = this.active();
    this.cursor.set({ day: addDays(day, days), slot });
  }

  protected onKeydown(event: KeyboardEvent, cell: Cell): void {
    const last = this.slots().length - 1;
    const days = this.days();
    const week = this.view() === 'week' ? 7 : 1;
    let { day, slot } = cell;
    switch (event.key) {
      case 'ArrowUp':
        slot = Math.max(0, slot - 1);
        break;
      case 'ArrowDown':
        slot = Math.min(last, slot + 1);
        break;
      case 'ArrowLeft':
        day = addDays(day, -1);
        break;
      case 'ArrowRight':
        day = addDays(day, 1);
        break;
      case 'Home':
        if (event.ctrlKey) slot = 0;
        else day = days[0];
        break;
      case 'End':
        if (event.ctrlKey) slot = last;
        else day = days[days.length - 1];
        break;
      case 'PageUp':
        day = addDays(day, -week);
        break;
      case 'PageDown':
        day = addDays(day, week);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activate(cell);
        return;
      default:
        return;
    }
    event.preventDefault();
    // Saiu da semana (ou do dia) mostrada: a grade acompanha
    if (!days.includes(day)) this.date.set(day);
    this.cursor.set({ day, slot });
    this.focusActive();
  }

  protected onClick(event: MouseEvent): void {
    const target = event.target as Element;
    const eventId = target.closest<HTMLElement>('[data-event-id]')?.dataset['eventId'];
    if (eventId) {
      const found = this.events().find((item) => item.id === eventId);
      if (found) this.eventSelect.emit(found);
      return;
    }
    const cellKey = target.closest<HTMLElement>('[data-cell]')?.dataset['cell'];
    if (!cellKey) return;
    const [day, slot] = cellKey.split('|');
    const cell = this.cell(day, Number(slot), this.slots()[Number(slot)]);
    this.cursor.set({ day, slot: Number(slot) });
    this.activate(cell);
  }

  /** Enter, Espaço ou clique: abre o agendamento do horário ou escolhe o horário livre. */
  private activate(cell: Cell): void {
    const event = cell.starting[0] ?? cell.covering;
    if (event) this.eventSelect.emit(event.event);
    else this.slotSelect.emit({ date: cell.day, time: this.slots()[cell.slot] });
  }

  private cell(day: IsoDate, slot: number, time: string): Cell {
    const placed = this.placedByDay().get(day) ?? [];
    const starting = placed.filter((item) => item.slot === slot);
    const covering = starting.length
      ? null
      : (placed.find((item) => item.slot < slot && item.slot + item.span > slot) ?? null);
    const what = starting.length
      ? starting.map((item) => describe(item.event)).join('; ')
      : covering
        ? `ocupado: ${describe(covering.event)}`
        : 'livre';
    return { day, slot, label: `${time}, ${dayLabel(day)}, ${what}`, starting, covering };
  }

  private firstSlotFromNow(): number {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const index = Math.floor((minutes - toMinutes(this.start())) / this.step());
    return Math.min(Math.max(index, 0), this.slots().length - 1);
  }

  private focusActive(): void {
    afterNextRender(
      () => {
        const { day, slot } = this.active();
        this.element.querySelector<HTMLElement>(`[data-cell="${day}|${slot}"]`)?.focus();
      },
      { injector: this.injector },
    );
  }
}

function describe(event: ArgAgendaEvent): string {
  const time = `${event.start.slice(11, 16)} às ${event.end.slice(11, 16)}`;
  return [event.title, event.description, time].filter(Boolean).join(', ');
}
