import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { ArgSpinner } from '../spinner/spinner';

/** Uma opção do combobox. */
export interface ArgComboboxOption {
  /** Valor guardado no formulário. */
  value: string;
  /** Texto mostrado e lido. */
  label: string;
  /** Texto menor embaixo do rótulo, ex.: o tutor de um pet. */
  description?: string;
}

/** O que o painel mostra. */
export type ArgComboboxState = 'loading' | 'empty' | 'results';

/**
 * Painel da lista do `arg-combobox`, num `popover="manual"` logo depois do
 * campo. Interno. O foco nunca entra aqui: fica no campo, e a opção ativa é
 * indicada por `aria-activedescendant`.
 */
@Component({
  selector: 'arg-combobox-panel',
  imports: [ArgSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './combobox.css',
  host: {
    class: 'arg-combobox__panel',
    popover: 'manual',
    '[style.position-anchor]': 'anchor()',
    // Clicar numa opção não pode tirar o foco do campo antes do clique
    '(mousedown)': '$event.preventDefault()',
    // As opções não recebem foco (aria-activedescendant): o clique é ouvido aqui
    '(click)': 'onClick($event)',
  },
  template: `
    @switch (state()) {
      @case ('loading') {
        <p class="arg-combobox__status"><arg-spinner size="sm" decorative /> {{ loadingText() }}</p>
      }
      @case ('empty') {
        <p class="arg-combobox__status">{{ emptyText() }}</p>
      }
    }
    <ul class="arg-combobox__list" role="listbox" [id]="listId()" [attr.aria-label]="label()">
      @for (option of options(); track option.value; let i = $index) {
        <li
          role="option"
          class="arg-combobox__option"
          [id]="listId() + '-' + i"
          [class.arg-combobox__option--active]="i === active()"
          [attr.aria-selected]="option.value === selected()"
          [attr.data-index]="i"
        >
          <span class="arg-combobox__label">{{ option.label }}</span>
          @if (option.description) {
            <span class="arg-combobox__description">{{ option.description }}</span>
          }
        </li>
      }
    </ul>
  `,
})
export class ArgComboboxPanel {
  /** Id da lista, ligado ao campo por `aria-controls`. */
  readonly listId = input.required<string>();
  /** Nome da lista (o mesmo do campo). */
  readonly label = input('');
  readonly options = input<readonly ArgComboboxOption[]>([]);
  /** Índice da opção ativa (setas), ou -1. */
  readonly active = input(-1);
  /** Valor escolhido, marcado com `aria-selected`. */
  readonly selected = input<string | null>(null);
  readonly state = input<ArgComboboxState>('results');
  readonly loadingText = input('Buscando…');
  readonly emptyText = input('Nenhum resultado.');
  /** Nome do anchor CSS do campo. */
  readonly anchor = input<string | null>(null);
  /** Opção clicada. */
  readonly picked = output<number>();

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  /** Navegador sem a API de popover: o painel é mostrado e escondido por código. */
  private readonly native = typeof this.element.showPopover === 'function';

  constructor() {
    if (!this.native) this.element.style.display = 'none';
    // A opção ativa sempre visível dentro da lista que rola
    effect(() => {
      const active = this.active();
      afterNextRender(
        () =>
          this.element
            .querySelector(`[id="${this.listId()}-${active}"]`)
            ?.scrollIntoView?.({ block: 'nearest' }),
        { injector: this.injector },
      );
    });
  }

  protected onClick(event: MouseEvent): void {
    const option = (event.target as Element).closest<HTMLElement>('[role="option"]');
    if (option) this.picked.emit(Number(option.dataset['index']));
  }

  /** @internal */
  show(): void {
    if (this.native) {
      if (!this.element.matches(':popover-open')) this.element.showPopover();
    } else {
      this.element.style.display = 'block';
    }
  }

  /** @internal */
  hide(): void {
    if (this.native) {
      if (this.element.matches(':popover-open')) this.element.hidePopover();
    } else {
      this.element.style.display = 'none';
    }
  }
}
