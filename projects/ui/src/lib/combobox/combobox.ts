import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  ViewContainerRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArgFieldControl } from '../field/field';
import { ArgAnnouncer } from '../internal/announcer';
import { injectUniqueId } from '../internal/unique-id';
import { ArgValueControlBase } from '../internal/value-control';
import { ArgComboboxOption, ArgComboboxPanel, ArgComboboxState } from './combobox-panel';

export type { ArgComboboxOption } from './combobox-panel';

/** Busca as opções para o texto digitado (ex.: no Supabase). Pode ser síncrona. */
export type ArgComboboxSearch = (
  term: string,
) => Promise<readonly ArgComboboxOption[]> | readonly ArgComboboxOption[];

/** Sem acento e sem diferença de maiúsculas: "João" acha "joao". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Opções locais que contêm o texto. */
export function filterOptions(
  options: readonly ArgComboboxOption[],
  term: string,
): ArgComboboxOption[] {
  const query = normalize(term);
  return options.filter((option) => normalize(option.label).includes(query));
}

/**
 * Campo com sugestões, no padrão "combobox with list autocomplete" do ARIA
 * APG, sobre o `<input>` nativo. Filtra uma lista local (`options`) ou busca
 * fora (`search`), com carregando e vazio.
 *
 * ```html
 * <arg-field label="Tutor">
 *   <input arg-combobox [search]="buscarTutores" [formControl]="tutor" />
 * </arg-field>
 * ```
 *
 * O foco fica sempre no campo: ↓ e ↑ andam pelas sugestões
 * (`aria-activedescendant`), Enter escolhe, Esc fecha (e, fechado, limpa),
 * Alt+↓ abre e Alt+↑ fecha. O valor é o `value` da opção escolhida, ou `null`.
 */
@Component({
  selector: 'input[arg-combobox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrls: ['../input/control.css'],
  hostDirectives: [ArgFieldControl],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArgCombobox), multi: true },
  ],
  host: {
    class: 'arg-input arg-combobox',
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    'aria-autocomplete': 'list',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'listId',
    '[attr.aria-activedescendant]': 'activeId()',
    '[style.anchor-name]': 'anchorName',
    '(input)': 'onInput()',
    '(keydown)': 'onKeydown($event)',
    '(blur)': 'onFieldBlur()',
  },
})
export class ArgCombobox extends ArgValueControlBase<string | null> {
  /** Lista local, filtrada pelo texto digitado. */
  readonly options = input<readonly ArgComboboxOption[]>([]);
  /** Busca fora (ex.: no servidor). Com ela, `options` só serve para mostrar o valor inicial. */
  readonly search = input<ArgComboboxSearch | null>(null);
  /** Espera entre a última tecla e a busca, em ms. Padrão: 250 com `search`, 0 com `options`. */
  readonly debounce = input<number | null>(null);
  /** Quantas letras antes de buscar. */
  readonly minChars = input(0);
  /** Nome da lista de sugestões, lido pelo leitor de tela. */
  readonly listLabel = input('Sugestões');
  /** Texto enquanto busca. */
  readonly loadingText = input('Buscando…');
  /** Texto quando nada combina. */
  readonly emptyText = input('Nenhum resultado.');
  /** Valor da opção escolhida; `null` quando nenhuma. */
  readonly value = model<string | null>(null);

  protected readonly listId = injectUniqueId('arg-combobox-list');
  protected readonly anchorName = `--${this.listId}`;
  protected readonly open = signal(false);
  private readonly results = signal<readonly ArgComboboxOption[]>([]);
  private readonly active = signal(-1);
  private readonly state = signal<ArgComboboxState>('results');
  private readonly selected = signal<ArgComboboxOption | null>(null);
  protected readonly activeId = computed(() =>
    this.open() && this.active() >= 0 ? `${this.listId}-${this.active()}` : null,
  );

  private readonly announcer = inject(ArgAnnouncer);
  private readonly panel: ComponentRef<ArgComboboxPanel>;
  private request = 0;
  private timer?: ReturnType<typeof setTimeout>;
  /** Abrir com ↓ ou ↑ já ativa a primeira ou a última sugestão. */
  private activateOnResults: 'first' | 'last' | null = null;

  constructor() {
    super();
    this.panel = inject(ViewContainerRef).createComponent(ArgComboboxPanel);
    this.panel.instance.picked.subscribe((index) => this.choose(this.results()[index]));
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));

    effect(() => {
      const panel = this.panel;
      panel.setInput('listId', this.listId);
      panel.setInput('label', this.listLabel());
      panel.setInput('options', this.results());
      panel.setInput('active', this.active());
      panel.setInput('selected', this.value());
      panel.setInput('state', this.state());
      panel.setInput('loadingText', this.loadingText());
      panel.setInput('emptyText', this.emptyText());
      panel.setInput('anchor', this.anchorName);
    });
    effect(() => {
      if (this.open()) this.panel.instance.show();
      else this.panel.instance.hide();
    });
    // Valor vindo de fora (formulário de signals ou [value]): mostra o rótulo
    effect(() => {
      const value = this.value();
      untracked(() => {
        if (this.selected()?.value === value) return;
        this.showSelection(value);
      });
    });
  }

  protected onInput(): void {
    const term = this.element.value;
    this.active.set(-1);
    if (!term) {
      this.setSelection(null);
      this.notifyChange(null);
    }
    if (term.length < this.minChars()) {
      this.close();
      return;
    }
    this.query(term);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open()) {
          this.activateOnResults = event.altKey ? null : 'first';
          this.query(this.element.value);
        } else if (!event.altKey && count) {
          this.active.update((index) => (index + 1) % count);
        }
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) {
          this.close();
        } else if (!this.open()) {
          this.activateOnResults = 'last';
          this.query(this.element.value);
        } else if (count) {
          this.active.update((index) => (index <= 0 ? count - 1 : index - 1));
        }
        return;
      case 'Enter':
        if (this.open() && this.active() >= 0) {
          event.preventDefault();
          this.choose(this.results()[this.active()]);
        }
        return;
      case 'Escape':
        // Esc não chega a um diálogo por baixo enquanto o combobox o usa
        if (this.open()) {
          event.preventDefault();
          event.stopPropagation();
          this.close();
        } else if (this.element.value) {
          event.preventDefault();
          event.stopPropagation();
          this.element.value = '';
          this.setSelection(null);
          this.notifyChange(null);
        }
        return;
      case 'Tab':
        this.close();
        return;
    }
  }

  /** Saiu do campo: fecha e volta o texto da opção escolhida. */
  protected onFieldBlur(): void {
    this.close();
    this.element.value = this.selected()?.label ?? '';
  }

  writeValue(value: string | null): void {
    this.showSelection(value ?? null);
  }

  private query(term: string): void {
    clearTimeout(this.timer);
    const id = ++this.request;
    this.open.set(true);
    const search = this.search();
    if (!search) {
      this.show(id, filterOptions(this.options(), term));
      return;
    }
    this.state.set('loading');
    this.results.set([]);
    this.timer = setTimeout(() => {
      Promise.resolve(search(term)).then(
        (options) => this.show(id, options),
        () => this.show(id, []),
      );
    }, this.debounce() ?? 250);
  }

  /** Mostra os resultados da busca `id`, se ela ainda é a mais recente. */
  private show(id: number, options: readonly ArgComboboxOption[]): void {
    if (id !== this.request || !this.open()) return;
    this.results.set(options);
    this.state.set(options.length ? 'results' : 'empty');
    if (this.activateOnResults && options.length) {
      this.active.set(this.activateOnResults === 'first' ? 0 : options.length - 1);
    }
    this.activateOnResults = null;
    const count = options.length;
    this.announcer.announce(
      count ? `${count} ${count === 1 ? 'resultado' : 'resultados'}` : this.emptyText(),
    );
  }

  private choose(option: ArgComboboxOption | undefined): void {
    if (!option) return;
    this.setSelection(option);
    this.element.value = option.label;
    this.close();
    this.notifyChange(option.value);
  }

  private close(): void {
    clearTimeout(this.timer);
    this.request++;
    this.activateOnResults = null;
    this.open.set(false);
    this.active.set(-1);
  }

  private setSelection(option: ArgComboboxOption | null): void {
    this.selected.set(option);
    this.value.set(option?.value ?? null);
  }

  /** Acha o rótulo do valor nas opções conhecidas; sem rótulo, mostra o próprio valor. */
  private showSelection(value: string | null): void {
    const known = [...this.results(), ...this.options()].find((option) => option.value === value);
    const option = value === null ? null : (known ?? { value, label: value });
    this.selected.set(option);
    this.value.set(value);
    this.element.value = option?.label ?? '';
  }
}
