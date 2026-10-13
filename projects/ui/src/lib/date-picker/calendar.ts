import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ArgIconButton } from '../icon-button/icon-button';
import { injectUniqueId } from '../internal/unique-id';
import {
  ArgDateRules,
  IsoDate,
  addDays,
  addMonths,
  dateProblem,
  dayLabel,
  monthLabel,
  monthWeeks,
  todayIso,
  weekday,
  weekdayNames,
} from './dates';

/**
 * Grade de um mês, no padrão "date picker dialog" do ARIA APG. Interna: é
 * aberta pelo botão do `arg-date`.
 *
 * Teclado: ← → dia, ↑ ↓ semana, Home/End início e fim da semana,
 * PageUp/PageDown mês (com Shift, ano), Enter ou Espaço escolhe.
 */
@Component({
  selector: 'arg-calendar',
  imports: [ArgIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  host: { class: 'arg-calendar' },
})
export class ArgCalendar {
  /** Data escolhida, destacada na grade. */
  readonly value = input<IsoDate | null>(null);
  /** Limites e dias bloqueados. */
  readonly rules = input<ArgDateRules>({});
  /** Data escolhida com clique, Enter ou Espaço. */
  readonly picked = output<IsoDate>();

  protected readonly headingId = injectUniqueId('arg-calendar-month');
  protected readonly today = todayIso();
  protected readonly weekdays = weekdayNames();
  /** Dia com o foco; a grade mostra o mês dele. */
  protected readonly focus = signal<IsoDate>(this.today);
  protected readonly month = computed(() => monthLabel(this.focus()));
  protected readonly weeks = computed(() =>
    monthWeeks(this.focus()).map((week) =>
      week.map((iso) =>
        iso
          ? {
              iso,
              day: Number(iso.slice(8)),
              label: dayLabel(iso),
              blocked: dateProblem(iso, this.rules()) !== null,
            }
          : null,
      ),
    ),
  );

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  /** @internal Começa no dia escolhido (ou hoje) e põe o foco nele. */
  start(): void {
    this.focus.set(this.value() ?? this.today);
    this.focusCell();
  }

  protected moveMonths(months: number): void {
    this.focus.update((day) => addMonths(day, months));
  }

  protected pick(iso: IsoDate): void {
    if (dateProblem(iso, this.rules()) === null) this.picked.emit(iso);
  }

  protected onKeydown(event: KeyboardEvent, iso: IsoDate): void {
    const year = event.shiftKey ? 12 : 1;
    const moves: Record<string, () => IsoDate> = {
      ArrowLeft: () => addDays(iso, -1),
      ArrowRight: () => addDays(iso, 1),
      ArrowUp: () => addDays(iso, -7),
      ArrowDown: () => addDays(iso, 7),
      Home: () => addDays(iso, -weekday(iso)),
      End: () => addDays(iso, 6 - weekday(iso)),
      PageUp: () => addMonths(iso, -year),
      PageDown: () => addMonths(iso, year),
    };
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.pick(iso);
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    this.focus.set(move());
    this.focusCell();
  }

  /** Move o foco para a célula do dia em foco, depois que a grade renderiza. */
  private focusCell(): void {
    afterNextRender(
      () => this.element.querySelector<HTMLElement>(`[data-date="${this.focus()}"]`)?.focus(),
      { injector: this.injector },
    );
  }
}
