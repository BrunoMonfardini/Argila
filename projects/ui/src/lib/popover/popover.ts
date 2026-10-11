import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ArgAlign, ArgSide, placeBeside, supportsAnchor } from '../internal/place-beside';
import { injectUniqueId } from '../internal/unique-id';

export type ArgPopoverPosition =
  'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end' | 'start' | 'end';

/** Lado e alinhamento de cada posição, para o posicionamento sem anchor CSS. */
const PLACEMENT: Record<ArgPopoverPosition, [ArgSide, ArgAlign]> = {
  'bottom-start': ['bottom', 'start'],
  bottom: ['bottom', 'center'],
  'bottom-end': ['bottom', 'end'],
  'top-start': ['top', 'start'],
  top: ['top', 'center'],
  'top-end': ['top', 'end'],
  start: ['left', 'center'],
  end: ['right', 'center'],
};

/**
 * Painel com conteúdo livre (texto, links, botões, formulário curto) junto de
 * um gatilho. Sobre o `popover="auto"` nativo: clicar fora ou Esc fecham, e o
 * foco volta ao gatilho. Abra com um `<button [argPopoverTrigger]>`:
 *
 * ```html
 * <button arg-button [argPopoverTrigger]="detalhes">Detalhes</button>
 * <arg-popover #detalhes label="Detalhes do pet">…</arg-popover>
 * ```
 */
@Component({
  selector: 'arg-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './popover.css',
  host: {
    popover: 'auto',
    role: 'dialog',
    '[id]': 'id',
    '[attr.aria-label]': 'label()',
    '[class]': '"arg-popover arg-popover--" + position()',
    '[style.position-anchor]': 'anchorName',
    '(toggle)': 'onToggle($event)',
  },
})
export class ArgPopover {
  /** Nome do painel para leitores de tela: "Detalhes do pet". */
  readonly label = input.required<string>();
  /** Lado do gatilho; se faltar espaço, o painel vira para o lado oposto. */
  readonly position = input<ArgPopoverPosition>('bottom-start');
  /** Abriu (`true`) ou fechou (`false`), por clique, Esc ou código. */
  readonly openChange = output<boolean>();

  readonly id = injectUniqueId('arg-popover');
  /** @internal Nome do anchor CSS que o gatilho recebe. */
  readonly anchorName = `--${this.id}`;
  /** Se o painel está aberto. */
  readonly isOpen = signal(false);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private trigger: HTMLElement | null = null;

  /** Abre junto de `trigger` (o último gatilho usado, se omitido). */
  show(trigger?: HTMLElement): void {
    if (trigger) this.trigger = trigger;
    if (this.isOpen()) return;
    if (typeof this.element.showPopover === 'function') this.element.showPopover();
    else this.setOpen(true);
  }

  /** Fecha o painel. */
  hide(): void {
    if (!this.isOpen()) return;
    if (typeof this.element.hidePopover === 'function') this.element.hidePopover();
    else this.setOpen(false);
  }

  /** Abre ou fecha. */
  toggle(trigger?: HTMLElement): void {
    if (this.isOpen()) this.hide();
    else this.show(trigger);
  }

  /** @internal O gatilho avisa quem é, para o painel se posicionar junto dele. */
  setTrigger(trigger: HTMLElement): void {
    this.trigger = trigger;
  }

  protected onToggle(event: Event): void {
    this.setOpen((event as ToggleEvent).newState === 'open');
  }

  private setOpen(open: boolean): void {
    if (this.isOpen() === open) return;
    this.isOpen.set(open);
    if (open && this.trigger && !supportsAnchor(this.document.defaultView)) {
      const [side, align] = PLACEMENT[this.position()];
      placeBeside(this.trigger, this.element, side, align);
    }
    this.openChange.emit(open);
  }
}

/**
 * Gatilho do popover, sobre um `<button>`. Usa o `popovertarget` nativo: o
 * navegador abre e fecha o painel e devolve o foco ao botão.
 */
@Directive({
  selector: 'button[argPopoverTrigger]',
  host: {
    '[attr.popovertarget]': 'argPopoverTrigger().id',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'argPopoverTrigger().isOpen()',
    '[attr.aria-controls]': 'argPopoverTrigger().id',
    '[style.anchor-name]': 'argPopoverTrigger().anchorName',
    '(click)': 'onClick()',
  },
})
export class ArgPopoverTrigger {
  /** O `arg-popover` que este botão abre: `[argPopoverTrigger]="detalhes"`. */
  readonly argPopoverTrigger = input.required<ArgPopover>();

  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  protected onClick(): void {
    const popover = this.argPopoverTrigger();
    popover.setTrigger(this.element);
    // Sem suporte a popover (navegadores antigos, testes): abre por código
    if (typeof this.element.showPopover !== 'function') popover.toggle(this.element);
  }
}

/** Tudo o que um popover usa, para importar de uma vez: `imports: [ARG_POPOVER]`. */
export const ARG_POPOVER = [ArgPopover, ArgPopoverTrigger] as const;
