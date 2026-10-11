import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  contentChildren,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { RovingFocus } from '../internal/roving-focus';
import { injectUniqueId } from '../internal/unique-id';
import { ArgPopoverBase, ArgPopoverTriggerBase } from '../popover/popover-base';

export type ArgMenuItemTone = 'default' | 'danger';

/** Item do menu, sobre um `<button>`. Ao ser escolhido, o menu fecha e o foco volta ao gatilho. */
@Component({
  selector: 'button[arg-menu-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './menu-item.css',
  host: {
    type: 'button',
    role: 'menuitem',
    tabindex: '-1',
    class: 'arg-menu__item',
    '[class.arg-menu__item--danger]': 'tone() === "danger"',
    '(click)': 'menu.closeAndReturnFocus()',
  },
})
export class ArgMenuItem {
  /** `danger` pinta o item de vermelho, para ações destrutivas como "Excluir". */
  readonly tone = input<ArgMenuItemTone>('default');

  /** @internal */
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  protected readonly menu = inject(forwardRef(() => ArgMenu));
}

/**
 * Lista de ações junto de um botão, sobre o `popover="auto"` nativo com
 * `role="menu"` (padrão "menu button" do ARIA APG). Setas, Home e End andam
 * entre os itens; digitar letras leva ao item; Esc fecha e devolve o foco.
 *
 * ```html
 * <button arg-button [argMenuTrigger]="acoes">Ações</button>
 * <arg-menu #acoes>
 *   <button arg-menu-item (click)="editar()">Editar</button>
 *   <hr arg-divider />
 *   <button arg-menu-item tone="danger" (click)="excluir()">Excluir</button>
 * </arg-menu>
 * ```
 */
@Component({
  selector: 'arg-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrls: ['../popover/popover.css', './menu.css'],
  host: {
    role: 'menu',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[class]': '"arg-popover arg-popover--" + position() + " arg-menu"',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ArgMenu extends ArgPopoverBase {
  private readonly items = contentChildren(ArgMenuItem, { descendants: true });
  private readonly roving = new RovingFocus({
    items: () => this.items().map((item) => item.element),
    typeahead: true,
  });
  /** O gatilho dá nome ao menu: "Ações". */
  protected readonly labelledBy = signal<string | null>(null);
  private focusOnOpen: 'first' | 'last' = 'first';

  /** @internal Abre e põe o foco no primeiro ou no último item (setas no gatilho). */
  openFrom(trigger: HTMLElement, focus: 'first' | 'last'): void {
    this.focusOnOpen = focus;
    if (this.isOpen()) this.focusItem();
    else this.show(trigger);
  }

  /** @internal Fecha e devolve o foco ao gatilho (item escolhido ou Esc). */
  closeAndReturnFocus(): void {
    this.hide();
    this.trigger?.focus();
  }

  override setTrigger(trigger: HTMLElement): void {
    super.setTrigger(trigger);
    this.labelledBy.set(trigger.id || null);
  }

  protected override idPrefix(): string {
    return 'arg-menu';
  }

  protected override afterToggle(open: boolean): void {
    if (open) this.focusItem();
    this.focusOnOpen = 'first';
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeAndReturnFocus();
      return;
    }
    // Tab sai do menu e o fecha; o foco segue a ordem normal da página
    if (event.key === 'Tab') {
      this.hide();
      return;
    }
    this.roving.handleKeydown(event);
  }

  private focusItem(): void {
    const enabled = this.items()
      .map((item, index) => ({ index, disabled: item.element.disabled }))
      .filter((item) => !item.disabled);
    if (!enabled.length) return;
    const target = this.focusOnOpen === 'last' ? enabled[enabled.length - 1] : enabled[0];
    this.roving.setActive(target.index, { focus: true });
  }
}

/**
 * Gatilho do menu, sobre um `<button>`. Clique, Enter e Espaço abrem com o foco
 * no primeiro item; seta para baixo abre no primeiro e seta para cima, no último.
 */
@Directive({
  selector: 'button[argMenuTrigger]',
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ArgMenuTrigger extends ArgPopoverTriggerBase {
  /** O `arg-menu` que este botão abre: `[argMenuTrigger]="acoes"`. */
  readonly argMenuTrigger = input.required<ArgMenu>();

  constructor() {
    super();
    // O menu leva o nome do botão (aria-labelledby): o botão precisa de id
    if (!this.element.id) this.element.id = injectUniqueId('arg-menu-trigger');
  }

  protected panel(): ArgMenu {
    return this.argMenuTrigger();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.argMenuTrigger().openFrom(this.element, event.key === 'ArrowDown' ? 'first' : 'last');
  }
}

/** Tudo o que um menu usa, para importar de uma vez: `imports: [ARG_MENU]`. */
export const ARG_MENU = [ArgMenu, ArgMenuItem, ArgMenuTrigger] as const;
