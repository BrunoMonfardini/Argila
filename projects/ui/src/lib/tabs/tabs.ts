import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  viewChildren,
} from '@angular/core';
import { RovingFocus } from '../internal/roving-focus';
import { injectUniqueId } from '../internal/unique-id';

export type ArgTabsActivation = 'automatic' | 'manual';

/** `underline`: barra embaixo da aba aberta. `segmented`: trilho em pílula, aba aberta em relevo. */
export type ArgTabsVariant = 'underline' | 'segmented';

/**
 * Uma aba e o seu painel. O conteúdo é o painel (`role="tabpanel"`); o
 * botão da aba é desenhado pelo `arg-tabs`.
 */
@Component({
  selector: 'arg-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './tab.css',
  host: {
    role: 'tabpanel',
    tabindex: '0',
    class: 'arg-tabs__panel',
    '[id]': 'panelId',
    '[attr.aria-labelledby]': 'tabId',
    '[hidden]': '!selected()',
  },
})
export class ArgTab {
  /** Texto da aba. */
  readonly label = input.required<string>();
  /** Valor que identifica a aba no `selected` do `arg-tabs`. O padrão é o `label`. */
  readonly value = input<string>();
  /** Aba desabilitada: não pode ser escolhida e as setas a pulam. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** @internal */
  readonly tabId = injectUniqueId('arg-tab');
  /** @internal */
  readonly panelId = injectUniqueId('arg-tab-panel');
  /** @internal Identificador usado na seleção. */
  readonly key = computed(() => this.value() ?? this.label());

  private readonly tabs = inject(forwardRef(() => ArgTabs));
  protected readonly selected = computed(() => this.tabs.selectedKey() === this.key());
}

/**
 * Abas no padrão "tabs" do ARIA APG: uma lista de abas (`role="tablist"`) e
 * um painel por aba, ligado a ela por `aria-controls` e `aria-labelledby`.
 *
 * ```html
 * <arg-tabs label="Ficha do pet" [(selected)]="aba">
 *   <arg-tab label="Dados">…</arg-tab>
 *   <arg-tab label="Vacinas">…</arg-tab>
 * </arg-tabs>
 * ```
 *
 * Setas para a esquerda e para a direita andam entre as abas (dando a volta),
 * Home e End vão às pontas. Na ativação `automatic`, a aba em foco já abre o
 * painel; na `manual`, Enter ou Espaço abrem.
 */
@Component({
  selector: 'arg-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
  host: { class: 'arg-tabs', '[class.arg-tabs--segmented]': 'variant() === "segmented"' },
})
export class ArgTabs {
  /** Nome da lista de abas para leitores de tela: "Ficha do pet". */
  readonly label = input.required<string>();
  /** Aba escolhida (o `value`, ou o `label`). Sem valor, a primeira habilitada. */
  readonly selected = model<string | undefined>(undefined);
  /** `automatic`: a aba abre ao receber o foco. `manual`: só com Enter, Espaço ou clique. */
  readonly activation = input<ArgTabsActivation>('automatic');
  /**
   * Aparência: `underline` (barra embaixo da aba aberta) ou `segmented` (trilho
   * em pílula, com a aba aberta em relevo), para alternar poucas visões curtas.
   */
  readonly variant = input<ArgTabsVariant>('underline');

  protected readonly tabs = contentChildren(ArgTab);
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  /** @internal Aba aberta: a escolhida, ou a primeira habilitada. */
  readonly selectedKey = computed(() => {
    const tabs = this.tabs();
    const chosen = tabs.find((tab) => tab.key() === this.selected() && !tab.disabled());
    return (chosen ?? tabs.find((tab) => !tab.disabled()))?.key();
  });

  private readonly roving = new RovingFocus({
    items: () => this.buttons().map((button) => button.nativeElement),
    orientation: 'horizontal',
  });

  constructor() {
    // O Tab entra na lista pela aba aberta
    afterRenderEffect(() => {
      const index = this.tabs().findIndex((tab) => tab.key() === this.selectedKey());
      if (index >= 0) this.roving.setActive(index);
    });
  }

  protected select(tab: ArgTab): void {
    if (!tab.disabled()) this.selected.set(tab.key());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.roving.handleKeydown(event)) return;
    if (this.activation() === 'automatic') this.select(this.tabs()[this.roving.activeIndex]);
  }
}

/** Tudo o que as abas usam, para importar de uma vez: `imports: [ARG_TABS]`. */
export const ARG_TABS = [ArgTabs, ArgTab] as const;
