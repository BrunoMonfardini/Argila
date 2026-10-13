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
  viewChild,
} from '@angular/core';
import { ArgIconButton } from '../icon-button/icon-button';
import { ArgCalendar } from './calendar';
import { ArgDateRules, IsoDate, dayLabel } from './dates';

/**
 * Botão do calendário e o `<dialog>` com a grade. Interno: o `arg-date` o
 * cria logo depois do `<input>` e liga os valores.
 */
@Component({
  selector: 'arg-date-toggle',
  imports: [ArgCalendar, ArgIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      arg-icon-button
      #button
      icon="calendar"
      size="sm"
      class="arg-date-toggle__button"
      [label]="buttonLabel()"
      [disabled]="disabled()"
      (click)="open()"
    ></button>
    <dialog
      #dialog
      class="arg-date-toggle__dialog"
      aria-label="Escolher data"
      [style.position-anchor]="anchor()"
      (cancel)="onCancel($event)"
    >
      @if (opened()) {
        <arg-calendar [value]="value()" [rules]="rules()" (picked)="choose($event)" />
      }
    </dialog>
  `,
  styleUrl: './date-toggle.css',
  host: { class: 'arg-date-toggle', '(click)': 'onDialogClick($event)' },
})
export class ArgDateToggle {
  /** Data atual do campo. */
  readonly value = input<IsoDate | null>(null);
  /** Limites e dias bloqueados. */
  readonly rules = input<ArgDateRules>({});
  /** Desabilita o botão, junto com o campo. */
  readonly disabled = input(false);
  /** Nome do anchor CSS do campo, para o calendário abrir junto dele. */
  readonly anchor = input<string | null>(null);
  /** Data escolhida no calendário. */
  readonly picked = output<IsoDate>();

  protected readonly opened = signal(false);
  protected readonly buttonLabel = computed(() => {
    const value = this.value();
    return value ? `Mudar a data, ${dayLabel(value)}` : 'Escolher data';
  });

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly button = viewChild.required('button', { read: ElementRef<HTMLButtonElement> });
  private readonly calendar = viewChild(ArgCalendar);
  private readonly injector = inject(Injector);

  /** Abre o calendário modal, com o foco no dia escolhido (ou hoje). */
  open(): void {
    const dialog = this.dialog().nativeElement;
    this.opened.set(true);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    // O calendário só existe depois que o @if renderiza
    afterNextRender(() => this.calendar()?.start(), { injector: this.injector });
  }

  /**
   * Fecha e devolve o foco ao botão. Não depende do evento `close` do
   * `<dialog>`: o foco tem de voltar mesmo quando o botão não estava focado
   * antes de abrir (o navegador só restaura o foco que havia).
   */
  close(): void {
    if (!this.opened()) return;
    const dialog = this.dialog().nativeElement;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    this.opened.set(false);
    this.button().nativeElement.focus();
  }

  protected choose(iso: IsoDate): void {
    this.picked.emit(iso);
    this.close();
  }

  /** Esc: fecha pelo mesmo caminho, para o foco voltar ao botão. */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /** Clique no fundo do diálogo modal (fora da caixa) fecha. */
  protected onDialogClick(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (!inside) this.close();
  }
}
