import { DOCUMENT, Directive, ElementRef, inject, input, output, signal } from '@angular/core';
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
 * Comportamento comum aos painéis junto de um gatilho (`arg-popover`,
 * `arg-menu`): `popover="auto"` nativo (clique fora e Esc fecham), posição
 * por anchor CSS e abrir e fechar por código.
 */
@Directive({
  host: {
    popover: 'auto',
    '[id]': 'id',
    '[style.position-anchor]': 'anchorName',
    '(toggle)': 'onToggle($event)',
  },
})
export abstract class ArgPopoverBase {
  /** Lado do gatilho; se faltar espaço, o painel vira para o lado oposto. */
  readonly position = input<ArgPopoverPosition>('bottom-start');
  /** Abriu (`true`) ou fechou (`false`), por clique, Esc ou código. */
  readonly openChange = output<boolean>();

  readonly id = injectUniqueId(this.idPrefix());
  /** @internal Nome do anchor CSS que o gatilho recebe. */
  readonly anchorName = `--${this.id}`;
  /** Se o painel está aberto. */
  readonly isOpen = signal(false);

  protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly document = inject(DOCUMENT);
  protected trigger: HTMLElement | null = null;
  /** Navegador sem a API de popover: o painel é mostrado e escondido por código. */
  private readonly native = typeof this.element.showPopover === 'function';

  constructor() {
    if (!this.native) this.element.style.display = 'none';
  }

  /** Abre junto de `trigger` (o último gatilho usado, se omitido). */
  show(trigger?: HTMLElement): void {
    if (trigger) this.setTrigger(trigger);
    if (this.isOpen()) return;
    if (this.native) this.element.showPopover();
    else this.setOpen(true);
  }

  /** Fecha o painel. */
  hide(): void {
    if (!this.isOpen()) return;
    if (this.native) this.element.hidePopover();
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

  /** Prefixo do id do painel. */
  protected idPrefix(): string {
    return 'arg-popover';
  }

  /** Chamado depois de abrir ou fechar, para cada painel reagir (ex.: mover o foco). */
  protected afterToggle(open: boolean): void {
    void open;
  }

  protected onToggle(event: Event): void {
    this.setOpen((event as ToggleEvent).newState === 'open');
  }

  private setOpen(open: boolean): void {
    if (this.isOpen() === open) return;
    this.isOpen.set(open);
    if (!this.native) this.element.style.display = open ? 'block' : 'none';
    if (open && this.trigger && !supportsAnchor(this.document.defaultView)) {
      const [side, align] = PLACEMENT[this.position()];
      placeBeside(this.trigger, this.element, side, align);
    }
    this.afterToggle(open);
    this.openChange.emit(open);
  }
}

/**
 * Comportamento comum aos gatilhos (`argPopoverTrigger`, `argMenuTrigger`),
 * sobre um `<button>` com o `popovertarget` nativo: o navegador abre e fecha o
 * painel e devolve o foco ao botão.
 */
@Directive({
  host: {
    '[attr.popovertarget]': 'panel().id',
    '[attr.aria-expanded]': 'panel().isOpen()',
    '[attr.aria-controls]': 'panel().id',
    '[style.anchor-name]': 'panel().anchorName',
    '(click)': 'onClick()',
  },
})
export abstract class ArgPopoverTriggerBase {
  /** O painel que este botão abre. */
  protected abstract panel(): ArgPopoverBase;

  protected readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  protected onClick(): void {
    const panel = this.panel();
    panel.setTrigger(this.element);
    // Sem suporte a popover (navegadores antigos, testes): abre por código
    if (typeof this.element.showPopover !== 'function') panel.toggle(this.element);
  }
}
