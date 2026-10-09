export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingFocusOptions {
  /** Os itens navegáveis, na ordem visual. Lido a cada tecla: a lista pode mudar. */
  items: () => readonly HTMLElement[];
  /** Quais setas movem o foco. Padrão: `vertical`. */
  orientation?: RovingOrientation;
  /** Do último item volta ao primeiro (e vice-versa). Padrão: `true`. */
  loop?: boolean;
  /** Digitar letras leva ao item cujo texto começa com elas (menus, listas). */
  typeahead?: boolean;
  /** Avisa quando o item ativo muda, pelo teclado ou por `setActive`. */
  onActiveChange?: (index: number) => void;
  /** Relógio da busca por letra; troque nos testes. */
  now?: () => number;
}

/** Tempo para digitar várias letras como uma busca só, como nos menus nativos. */
const TYPEAHEAD_RESET_MS = 500;

function isDisabled(item: HTMLElement): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true';
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
}

/**
 * Navegação por setas num grupo de itens com um único ponto de tabulação
 * ("roving tabindex", do ARIA Authoring Practices): o item ativo tem
 * `tabindex="0"` e os outros `-1`. Tab entra e sai do grupo de uma vez;
 * as setas, Home e End andam dentro dele. Itens desabilitados são pulados.
 *
 * ```ts
 * private readonly roving = new RovingFocus({
 *   items: () => this.tabs().map((tab) => tab.nativeElement),
 *   orientation: 'horizontal',
 * });
 * // no host: '(keydown)': 'roving.handleKeydown($event)'
 * ```
 */
export class RovingFocus {
  private readonly options: Required<Omit<RovingFocusOptions, 'onActiveChange'>> &
    Pick<RovingFocusOptions, 'onActiveChange'>;
  private active = 0;
  private search = '';
  private lastKeyAt = 0;

  constructor(options: RovingFocusOptions) {
    this.options = {
      orientation: 'vertical',
      loop: true,
      typeahead: false,
      now: Date.now,
      ...options,
    };
  }

  /** Índice do item que recebe o Tab. */
  get activeIndex(): number {
    return this.active;
  }

  /**
   * Torna o item ativo e atualiza os tabindex. Chame ao iniciar e quando o
   * item escolhido mudar por clique; `focus: true` move o foco também.
   */
  setActive(index: number, { focus = false } = {}): void {
    const items = this.options.items();
    if (!items.length) return;
    this.active = Math.min(Math.max(index, 0), items.length - 1);
    items.forEach((item, i) => item.setAttribute('tabindex', i === this.active ? '0' : '-1'));
    if (focus) items[this.active].focus();
    this.options.onActiveChange?.(this.active);
  }

  /**
   * Trata a tecla. Devolve `true` quando a tecla foi usada (e chama
   * `preventDefault`, para a página não rolar com as setas).
   */
  handleKeydown(event: KeyboardEvent): boolean {
    const items = this.options.items();
    if (!items.length || event.altKey || event.ctrlKey || event.metaKey) return false;
    const target = this.targetFor(event, items);
    if (target === undefined) return false;
    event.preventDefault();
    this.setActive(target, { focus: true });
    return true;
  }

  private targetFor(event: KeyboardEvent, items: readonly HTMLElement[]): number | undefined {
    const step = this.stepFor(event.key, items);
    if (step !== undefined) return this.move(items, step);
    if (event.key === 'Home') return this.firstEnabled(items, 0, 1);
    if (event.key === 'End') return this.firstEnabled(items, items.length - 1, -1);
    if (this.options.typeahead && event.key.length === 1 && event.key !== ' ') {
      return this.typeahead(event.key, items);
    }
    return undefined;
  }

  private stepFor(key: string, items: readonly HTMLElement[]): number | undefined {
    const { orientation } = this.options;
    const vertical = orientation !== 'horizontal';
    const horizontal = orientation !== 'vertical';
    const rtl = items[0].closest('[dir]')?.getAttribute('dir') === 'rtl';
    if (vertical && key === 'ArrowDown') return 1;
    if (vertical && key === 'ArrowUp') return -1;
    if (horizontal && key === 'ArrowRight') return rtl ? -1 : 1;
    if (horizontal && key === 'ArrowLeft') return rtl ? 1 : -1;
    return undefined;
  }

  /** Próximo item habilitado na direção; sem laço, para na ponta. */
  private move(items: readonly HTMLElement[], step: number): number {
    const count = items.length;
    let index = this.active;
    for (let tried = 0; tried < count; tried++) {
      const next = index + step;
      if (!this.options.loop && (next < 0 || next >= count)) return this.active;
      index = (next + count) % count;
      if (!isDisabled(items[index])) return index;
    }
    return this.active;
  }

  private firstEnabled(items: readonly HTMLElement[], from: number, step: number): number {
    for (let i = from; i >= 0 && i < items.length; i += step) {
      if (!isDisabled(items[i])) return i;
    }
    return this.active;
  }

  /** Busca pelo início do texto; a mesma letra repetida passa para o próximo item. */
  private typeahead(key: string, items: readonly HTMLElement[]): number | undefined {
    const now = this.options.now();
    const expired = now - this.lastKeyAt > TYPEAHEAD_RESET_MS;
    this.lastKeyAt = now;
    this.search = expired ? key : this.search + key;
    const term = normalize(this.search);
    const repeated = [...term].every((char) => char === term[0]);
    // "aa…": anda entre os itens que começam com "a", a partir do próximo
    const query = repeated ? term[0] : term;
    const start = repeated || expired ? this.active + 1 : this.active;
    for (let offset = 0; offset < items.length; offset++) {
      const index = (start + offset) % items.length;
      const item = items[index];
      if (!isDisabled(item) && normalize(item.textContent ?? '').startsWith(query)) {
        return index;
      }
    }
    return undefined;
  }
}
